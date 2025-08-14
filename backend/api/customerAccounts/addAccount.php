<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}


$body = get_json_input();
$customerId = $body['customer_id'] ?? null;


if (empty($customerId) || empty($body['account_name'])) {
    respond(['success' => false, 'error' => 'customer_id and account_name required'], 400);
}


// Check if customer exists
$customer = GetRow("SELECT id FROM customers WHERE id = {$customerId} AND del = 0",  $con);
if (!$customer) {
    respond(['success' => false, 'error' => 'Customer not found'], 404);
}


// Check if account name already exists for this customer
$existingAccount = GetRow("SELECT id FROM customer_accounts WHERE customer_id = {$customerId} AND account_name = '{$body['account_name']}' AND del = 0", $con);
if ($existingAccount) {
    respond(['success' => false, 'error' => 'Account name already exists for this customer'], 400);
}



$accountData = [
    'customer_id' => $customerId,
    'account_name' => $body['account_name'],
    'is_default' => 0,  // New accounts are never default
    'balance' => (float)($body['balance'] ?? 0),
    'address' => $body['address'],
    'remark' => $body['remark']
];

$accountId = insert_data_id($accountData, 'customer_accounts', $con);


if ($accountId) {
    respond([
        'success' => true,
        'message' => 'Account added successfully',
    ], 201);
} else {
    respond(['success' => false, 'error' => 'Failed to create account'], 500);
}
