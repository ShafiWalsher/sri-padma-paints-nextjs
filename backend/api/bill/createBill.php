<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Invalid request method'], 405);
}

$data = get_json_input();

// Check required fields
if (!isset($data) || empty($data['particulars'])) {
    respond(['error' => 'Missing required fields'], 400);
}

$bill_info_table = "bill_info";
$bill_items_table = "bill_items_info";

// If Credit Customer;
// Then, fetch the old_balance
$old_balance = 0;
$cust_id = null;
if (isset($data['custId']) && !empty($data['custId'])) {
    $cust_id = $data['custId'];

    $old_balance = floatval(GetOne("SELECT balance FROM customers WHERE del=0 AND id={$cust_id}", $con));
} else {
    $cust_id = null; // Make sure it’s null, not 0
}



$grand_total = floatval($data['grandTotal']);
$paid        = floatval($data['paid'] ?? 0);
if ($old_balance > 0) {
    // old + new charges − payment
    $new_balance = $old_balance + $grand_total - $paid;
} else {
    // brand-new customer (or paid in full previously)
    // $new_balance = $grand_total - $paid;
    $new_balance = 0;
    $paid = $grand_total;
}

// Negative Balance
if ($new_balance < 0) {
    respond(['error' => 'Updated Balance is Negative: ' . $new_balance], 500);
}


// STEP 2 : Insert in Bill_Info
$bill_data = [
    "cust_id" => $cust_id,
    "cust_name" => $data['name'],
    "cust_mobile" => $data['mobile'],
    "bill_date" => $data['date'],
    "bill_total" => $grand_total,
    "old_balance" => $old_balance,
    "grand_total" => $old_balance +  $grand_total,
    "paid" => $paid,
    "balance" => $new_balance,
    "created_at" => date('Y-m-d H:m:s'),
    "updated_at" => date('Y-m-d H:m:s'),
];


$bill_id = insert_data_id($bill_data, $bill_info_table, $con);

if (!isset($bill_id)) {
    // Failed to create bill, stop furthur execution
    respond(['error' => 'Failed to create bill'], 500);
}

// STEP 3 : Update "balance" of customer only if Credit Customer
if (!is_null($cust_id)) {
    $result = Execute("UPDATE customers SET balance={$new_balance} WHERE id={$cust_id}", $con);

    if (!isset($result)) {
        // Failed to update balance; stop execution and remove inserted bill
        Execute("DELETE FROM {$bill_info_table} WHERE id={$bill_id}", $con);
        respond(['error' => 'Failed to create bill'], 500);
    }
}

// STEP 4 : Insert in Bill_Items_Info
$particulars = $data['particulars'];


foreach ($particulars as $item) {
    $item_data  = [
        "bill_id" => $bill_id,
        "bill_date" => $data['date'],
        "cust_id" => $cust_id,
        "item_id" => $item['itemId'],
        "item_name" => $item['itemName'],
        "item_price" => $item['price'],
        "item_quantity" => $item['quantity'],
        "total" => $item['total'],
    ];

    $result = insert_data_id($item_data, $bill_items_table, $con);

    if (!isset($result)) {
        Execute("DELETE FROM {$bill_items_table} WHERE id = {$result}", $con);
        respond(['error' => 'Failed to create bill'], 500);
    }
}


if ($result) {
    respond(['message' => 'Bill created successfully', 'bill_id' => $bill_id]);
} else {
    respond(['error' => 'Failed to create bill'], 500);
}
