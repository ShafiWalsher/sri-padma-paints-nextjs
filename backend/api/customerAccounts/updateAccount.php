<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

$body = get_json_input();

if (empty($body['account_id']) || empty($body['account_name'])) {
    respond(['success' => false, 'error' => 'account_id and account_name required'], 400);
}

$accountId = $body['account_id'];

$con->begin_transaction();

try {
    // Get account details
    $account = GetRow("SELECT * FROM customer_accounts WHERE id ={$accountId} AND del = 0", $con);
    if (!$account) {
        throw new Exception('Account not found');
    }

    // Check if account name already exists for this customer (excluding current account)
    $duplicateCheck = GetRow("SELECT id 
                                    FROM customer_accounts 
                                WHERE account_name = '{$body['account_name']}' AND 
                                    customer_id = {$account['customer_id']} AND 
                                    id ={$accountId} AND del = 0", $con);

    // Prepare update data
    $updateData = [
        'account_name' => $body['account_name'],
        'address' => $body['address'],
        'remark' => $body['remark'],
        'updated_at' => date('Y-m-d H:i:s')
    ];

    // Only update balance if provided
    if (isset($body['balance'])) {
        $updateData['balance'] = (float)$body['balance'];
    }

    // Update account
    $updated = update_data($updateData, 'customer_accounts', "id = {$accountId}", $con);
    if (!$updated) {
        throw new Exception('Failed to update account');
    }

    $con->commit();

    respond([
        'success' => true,
        'message' => 'Account updated successfully',
    ], 200);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;
}
