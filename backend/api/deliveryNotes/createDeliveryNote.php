<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();


/* Allow only POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

/* Authenticated user */
$user = getCurrentUser($con);
if (!$user['success']) respond($user, $user['code']);
$username = $user['data']['username'];


$body = get_json_input();

// Validate required fields
$requiredFields = ['type', 'name', 'date', 'items', 'subtotal', 'total_amount'];
foreach ($requiredFields as $field) {
    if (empty($body[$field])) {
        respond(['success' => false, 'error' => "Missing required field: {$field}"], 400);
    }
}

$transactionType = $body['type'];
if (!in_array($transactionType, ['cash', 'credit'])) {
    respond(['success' => false, 'error' => 'Invalid transaction type'], 400);
}


// Validate credit transaction requirements
if ($transactionType === 'credit') {
    if (empty($body['cust_id']) || empty($body['account_id'])) {
        respond(['success' => false, 'error' => 'Customer and account are required for credit transactions'], 400);
    }
}


/* Start transaction */
$con->begin_transaction();
try {
    // Validate financial calculations
    $subtotal = $body['subtotal'];
    $discountPercent = $body['discount_percent'];
    $discountAmount = $body['discount_amount'];
    $totalAmount = $body['total_amount'];

    $expectedDiscountAmount = ($subtotal * $discountPercent) / 100;
    $expectedTotalAmount = $subtotal - $expectedDiscountAmount;


    if (abs($discountAmount - $expectedDiscountAmount) > 0.01) {
        throw new Exception('Discount calculation mismatch');
    }

    if (abs($totalAmount - $expectedTotalAmount) > 0.01) {
        throw new Exception('Total amount calculation mismatch');
    }

    $today = date('Ymd');
    $lastNote = GetOne("SELECT note_number FROM delivery_notes WHERE DATE(created_at) = CURDATE() ORDER BY id DESC LIMIT 1", $con);

    $sequence = 1;
    if ($lastNote && preg_match('/DN-\d{8}-(\d{3})/', $lastNote, $matches)) {
        $sequence = intval($matches[1]) + 1;
    }
    $noteNumber = "DN-{$today}-" . str_pad($sequence, 3, '0', STR_PAD_LEFT);


    // Validate customer account for credit transactions
    $customerAccountId = null;
    $customerName = $body['name'];
    $customerMobile = $body['mobile'] ?? '';


    if ($transactionType === 'credit') {
        $customerAccountId = $body['account_id'];

        $account = GetRow("SELECT ca.*, c.name, c.mobile 
                            FROM customer_accounts ca
                            JOIN customers c ON c.id = ca.customer_id
                            WHERE ca.id = {$customerAccountId} AND ca.del = 0 AND c.del = 0", $con);

        if (!$account) {
            throw new Exception('Customer account not found');
        }

        // Use customer data from database for consistency
        $customerName = $account['name'];
        $customerMobile = $account['mobile'];
    }


    // *** CREATE DELIVERY NOTE
    // Create delivery note record
    $noteData = [
        'note_number' => $noteNumber,
        'customer_account_id' => $customerAccountId,
        'customer_name' => $customerName,
        'customer_mobile' => $customerMobile,
        'date' => $body['date'],
        'payment_type' => $transactionType,
        'subtotal' => $subtotal,
        'discount_percent' => $discountPercent,
        'discount_amount' => $discountAmount,
        'total_amount' => $totalAmount,
        'status' => 'pending',
        'items' => json_encode($body['items']), // JSON snapshot
        'created_by' => $username,
        'created_at'  => date('Y-m-d H:i:s'),
        'updated_at'  => date('Y-m-d H:i:s'),
    ];

    $noteId = insert_data_id($noteData, 'delivery_notes', $con);
    if (!$noteId) throw new Exception('Failed to create delivery note');


    // *** STORE INDIVIDUAL ITEMS
    // Create normalized item records
    foreach ($body['items'] as $item) {
        // Validate item data
        if (empty($item['item_id']) || empty($item['item_name'])) {
            throw new Exception('Invalid item data: missing product information');
        }

        $itemData = [
            'delivery_note_id' => $noteId,
            'product_id' => $item['item_id'],
            'product_name' => $item['item_name'],
            'quantity' => $item['quantity'],
            'unit_price' => $item['price'],
            'color_code' => $item['color_code'] ?? '',
            'color_price' => $item['color_price'] ?? 0,
            'total' => $item['total'],
        ];

        $itemId = insert_data_id($itemData, 'delivery_note_items', $con);
        if (!$itemId) throw new Exception('Failed to create delivery note item');
    }

    // *** UPDATE CUSTOMER BALANCE [CREDIT]
    // Update customer account balance for credit transactions
    if ($transactionType === 'credit' && $customerAccountId) {
        $updated = Execute(" UPDATE customer_accounts SET balance = balance + {$totalAmount}, updated_at = NOW() WHERE id = {$customerAccountId}", $con);

        if (!$updated) throw new Exception('Failed to update customer balance');
    }


    $con->commit();
    respond([
        'success' => true,
        'message' => 'Delivery note created successfully',
    ], 201);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;  // global handler converts to JSON
}
