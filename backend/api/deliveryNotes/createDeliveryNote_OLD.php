<?php
require_once '../cors.php';
require_once '../connect-db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}


// Get authenticated user
$userResponse = getCurrentUser($con);
if (!$userResponse['success']) {
    respond($userResponse, $userResponse['code']);
}
$user = $userResponse['data'];
$username = $user['username'];


$input = get_json_input();

// Check required fields
if (empty($input['particulars']) || empty($input['date']) || empty($input['grandTotal'])) {
    respond(['success' => false, 'error' => 'Missing required fields'], 400);
}

$delivery_table = "delivery_notes";

// Fetch customer balance if applicable
$balance = 0;
$cust_id = isset($input['custId']) && !empty($input['custId']) ? $input['custId'] : null;

if (!is_null($cust_id)) {
    $customer = GetRow("SELECT balance FROM customers WHERE del=0 AND id={$cust_id}", $con);
    if (!$customer) {
        respond(['success' => false, 'error' => 'Customer not found'], 404);
    }
    $balance = floatval($customer['balance']);
}

$total_amount = floatval($input['grandTotal']);
$paid = floatval($input['paid'] ?? 0);

// Calculate new balance
$new_balance = $balance + $total_amount - $paid;

if ($new_balance < 0) {
    respond(['success' => false, 'error' => 'Updated balance cannot be negative: ' . $new_balance], 400);
}

// Prepare items data as JSON
$items = $input['particulars'];
$items_data = [];
foreach ($items as $item) {
    $items_data[] = [
        "item_id" => $item['itemId'],
        "item_name" => $item['itemName'],
        "item_price" => floatval($item['price']),
        "item_quantity" => floatval($item['quantity']),
        "total" => floatval($item['total'])
    ];
}

// Prepare delivery note data
$delivery_data = [
    "cust_id" => $cust_id,
    "name" => $input['name'] ?? null,
    "mobile" => $input['mobile'] ?? null,
    "date" => $input['date'],
    "items" => json_encode($items_data),
    "total_amount" => $total_amount,
    "old_balance" => $balance,
    "grand_total" => $balance + $total_amount,
    "paid" => $paid,
    "balance" => $new_balance,
    "status" => $input['status'] ?? 'pending',
    "del" => 0,
    "created_by" => $username,
    "created_at" => date('Y-m-d H:i:s'),
    "updated_at" => date('Y-m-d H:i:s'),
];

// Insert delivery note
$delivery_id = insert_data_id($delivery_data, $delivery_table, $con);

if (!$delivery_id) {
    respond(['success' => false, 'error' => 'Failed to create delivery note'], 500);
}

// Update customer balance if credit customer
if (!is_null($cust_id)) {
    $result = Execute("UPDATE customers SET balance={$new_balance} WHERE id={$cust_id}", $con);
    if (!$result) {
        Execute("DELETE FROM {$delivery_table} WHERE id={$delivery_id}", $con);
        respond(['success' => false, 'error' => 'Failed to update customer balance'], 500);
    }
}


// Send success response
respond([
    'success' => true,
    'message' => 'Delivery note created successfully'
]);
