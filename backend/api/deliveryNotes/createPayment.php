<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

$user = getCurrentUser($con);
if (!$user['success']) respond($user, $user['code']);
$username = $user['data']['username'];

$body     = get_json_input();
$custId   = $body['custId'] ?? null;
$amount   = (float)($body['amount'] ?? 0);
$noteIds  = $body['noteIds'] ?? [];
$adminNote = $body['note'] ?? null;

if (!$custId || $amount <= 0) {
    respond(['success' => false, 'error' => 'custId and positive amount required'], 400);
}

/* Current balance */
$row = GetRow("SELECT balance FROM customers WHERE del=0 AND id={$custId}", $con);
if (!$row) respond(['success' => false, 'error' => 'Customer not found'], 404);
$currentBal = (float)$row['balance'];
if ($amount > $currentBal) {
    respond(['success' => false, 'error' => 'Payment exceeds outstanding balance'], 400);
}

/* Transaction */
$con->begin_transaction();
try {
    /* 1. record payment */
    insert_data_id([
        'cust_id'      => $custId,
        'payment_date' => date('Y-m-d'),
        'amount'       => $amount,
        'note'         => $adminNote,
        'created_by'   => $username,
    ], 'customer_payments', $con);

    /* 2. reduce customer balance */
    Execute("UPDATE customers SET balance=balance-{$amount} WHERE id={$custId}", $con);

    /* 3. apply to specific notes */
    if (!empty($noteIds)) {
        foreach ($noteIds as $id) {
            if ($amount <= 0) break;
            $note = GetRow("SELECT balance FROM delivery_notes WHERE id={$id} AND status='pending'", $con);

            if (!$note) continue;

            $pay  = min($amount, (float)$note['balance']);
            Execute("UPDATE delivery_notes
                        SET paid     = paid+{$pay},
                            balance  = balance-{$pay},
                            status   = IF(balance-{$pay} = 0,'complete','pending')
                        WHERE id={$id}", $con);

            $amount -= $pay;
        }
    }

    $con->commit();
    respond(['success' => true, 'message' => 'Payment recorded'], 201);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;
}
