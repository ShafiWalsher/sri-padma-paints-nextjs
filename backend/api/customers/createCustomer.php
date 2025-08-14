<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

$body = get_json_input();

// Validate required fields
if (empty($body['name']) || empty($body['mobile'])) {
    respond(['success' => false, 'error' => 'Missing required fields'], 400);
}

$con->begin_transaction();

try {
    // 1. Check if mobile already exists
    $existingCustomer = GetRow("SELECT id FROM customers WHERE mobile = {$body['mobile']} AND del = 0", $con);
    if ($existingCustomer) {
        throw new Exception('Mobile number already exists');
    }

    // 2. Create customer
    $customerData = [
        'name' => $body['name'],
        'mobile' => $body['mobile'],
        'address' => $body['address'] ?? '',
    ];

    $customerId = insert_data_id($customerData, 'customers', $con);
    if (!$customerId) throw new Exception('Failed to create customer');

    // 3. Create default account with initial balance
    $defaultAccountName = $body['account_name'] ?? 'Main Account';
    $initialBalance = (float)($body['balance'] ?? 0);

    $accountData = [
        'customer_id' => $customerId,
        'account_name' => $defaultAccountName,
        'is_default' => 1,
        'balance' => $initialBalance
    ];

    $accountId = insert_data_id($accountData, 'customer_accounts', $con);
    if (!$accountId) throw new Exception('Failed to create default account');

    $con->commit();

    respond([
        'success' => true,
        'message' => 'Customer created successfully',
    ], 201);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;
}
