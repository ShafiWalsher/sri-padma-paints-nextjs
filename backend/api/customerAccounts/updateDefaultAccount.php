<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

$body = get_json_input();

$body = get_json_input();

if (empty($body['customer_id']) || empty($body['new_default_account_id'])) {
    respond(['success' => false, 'error' => 'customer_id and new_default_account_id required'], 400);
}


$customerId = $body['customer_id'];
$newDefaultAccountId = $body['new_default_account_id'];

$con->begin_transaction();

try {
    // Validate customer exists
    $customer = GetRow("SELECT id FROM customers WHERE id = {$customerId} AND del = 0", $con);
    if (!$customer) {
        throw new Exception('Customer not found');
    }

    // Validate new default account belongs to this customer
    $account = GetRow("SELECT id, account_name FROM customer_accounts WHERE id = {$newDefaultAccountId} AND customer_id = {$customerId} AND del = 0", $con);

    if (!$account) {
        throw new Exception('Account not found or does not belong to this customer');
    }


    // Check if account is already default
    $currentDefault = GetRow("SELECT id FROM customer_accounts WHERE customer_id = {$customerId} AND is_default = 1 AND del = 0",  $con);

    if ($currentDefault && $currentDefault['id'] == $newDefaultAccountId) {
        throw new Exception('Account is already the default account');
    }

    // ** STEP 1: Reset ALL accounts for this customer to non-default
    $resetResult = Execute("UPDATE customer_accounts SET is_default = 0 WHERE customer_id = {$customerId} AND del = 0", $con);
    if (!$resetResult) {
        throw new Exception('Failed to reset existing default accounts');
    }

    // ** STEP 2: Set the new account as default
    $setDefaultResult = Execute("UPDATE customer_accounts SET is_default = 1, updated_at = NOW() WHERE id = {$newDefaultAccountId} AND customer_id = {$customerId}", $con);

    if (!$setDefaultResult) {
        throw new Exception('Failed to set new default account');
    }

    $con->commit();

    respond([
        'success' => true,
        'message' => 'Default account updated successfully',
    ], 200);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;
}
