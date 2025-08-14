<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

$body = get_json_input();
$customerId = $body['customer_id'] ?? null;

if (!$customerId) {
    respond(['success' => false, 'error' => 'customer_id required'], 400);
}

$con->begin_transaction();

try {
    $customer = GetRow("SELECT id, name FROM customers WHERE id = {$customerId} AND del = 0",  $con);

    if (!$customer) {
        throw new Exception('Customer not found');
    }


    // TODO: Check if customer has pending delivery notes/bills
    // $pendingNotes = GetOne("SELECT COUNT(*) FROM delivery_notes WHERE customer_account_id IN (SELECT id FROM customer_accounts WHERE customer_id = ?) AND status = 'pending'", [$customerId], $con);
    // if ($pendingNotes > 0) {
    //     throw new Exception('Cannot delete customer with pending transactions');
    // }

    // Soft delete all customer accounts
    Execute("UPDATE customer_accounts SET del = 1 WHERE customer_id = {$customerId}", $con);

    // Soft delete customer
    Execute("UPDATE customers SET del = 1 WHERE id = {$customerId}", $con);

    $con->commit();

    respond([
        'success' => true,
        'message' => 'Customer deleted successfully'
    ]);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;
}
