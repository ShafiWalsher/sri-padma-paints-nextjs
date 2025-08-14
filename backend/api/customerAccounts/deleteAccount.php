<?php
// api/customer_accounts/deleteAccount.php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

$body = get_json_input();

if (empty($body['account_id']) || empty($body['customer_id'])) {
    respond(['success' => false, 'error' => 'account_id and customer_id required'], 400);
}

$accountId = $body['account_id'];
$customerId = $body['customer_id'];

$con->begin_transaction();
try {
    // 1. Validate account exists and belongs to customer
    $account = GetRow("
        SELECT id, account_name, balance, is_default, customer_id 
        FROM customer_accounts 
        WHERE id = ? AND customer_id = ? AND del = 0
    ", [$accountId, $customerId], $con);

    if (!$account) {
        throw new Exception('Account not found or does not belong to this customer');
    }

    // 2. CRITICAL: Cannot delete default account
    if ($account['is_default'] == 1) {
        throw new Exception('Cannot delete default account. Set another account as default first.');
    }

    // 3. Check if customer would have no accounts left
    $accountCount = GetOne("
        SELECT COUNT(*) 
        FROM customer_accounts 
        WHERE customer_id = ? AND del = 0
    ", [$customerId], $con);

    if ($accountCount <= 1) {
        throw new Exception('Cannot delete account. Customer must have at least one account.');
    }

    // 4. Check account balance
    if (floatval($account['balance']) != 0) {
        throw new Exception('Cannot delete account with non-zero balance. Current balance: ₹' . $account['balance']);
    }

    // 5. TODO: Check for pending delivery notes (uncomment when delivery system is ready)
    /*
    $pendingNotes = GetOne("
        SELECT COUNT(*) 
        FROM delivery_notes 
        WHERE customer_account_id = ? AND status = 'pending' AND del = 0
    ", [$accountId], $con);
    
    if ($pendingNotes > 0) {
        throw new Exception('Cannot delete account with pending delivery notes');
    }
    */

    // 6. TODO: Check for unpaid bills (uncomment when billing system is ready)
    /*
    $unpaidBills = GetOne("
        SELECT COUNT(*) 
        FROM bills 
        WHERE customer_account_id = ? AND payment_status != 'paid' AND del = 0
    ", [$accountId], $con);
    
    if ($unpaidBills > 0) {
        throw new Exception('Cannot delete account with unpaid bills');
    }
    */

    // 7. Get current user for audit trail
    $userResp = getCurrentUser($con);
    if (!$userResp['success']) {
        throw new Exception('Unable to verify user for audit trail');
    }
    $username = $userResp['data']['username'];

    // 8. Soft delete the account
    $deleteResult = Execute("
        UPDATE customer_accounts 
        SET del = 1, updated_at = NOW() 
        WHERE id = ? AND customer_id = ?
    ", [$accountId, $customerId], $con);

    if (!$deleteResult) {
        throw new Exception('Failed to delete account');
    }

    // 9. TODO: Create audit log entry (optional)
    /*
    insert_data_id([
        'table_name' => 'customer_accounts',
        'record_id' => $accountId,
        'action' => 'delete',
        'old_values' => json_encode($account),
        'user_id' => $userResp['data']['id'],
        'timestamp' => date('Y-m-d H:i:s')
    ], 'audit_log', $con);
    */

    $con->commit();

    respond([
        'success' => true,
        'message' => 'Account deleted successfully',
        'data' => [
            'deleted_account_id' => $accountId,
            'account_name' => $account['account_name']
        ]
    ], 200);
} catch (Throwable $e) {
    $con->rollback();
    respond(['success' => false, 'error' => $e->getMessage()], 500);
}
