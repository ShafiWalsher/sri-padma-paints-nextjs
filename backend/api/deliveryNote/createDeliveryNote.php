<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

/* Make every uncaught error return JSON */
set_exception_handler(
    fn(Throwable $e) =>
    respond(['success' => false, 'error' => 'Server error: ' . $e->getMessage()], 500)
);

/* Allow only POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

/* Authenticated user */
$user = getCurrentUser($con);
if (!$user['success']) respond($user, $user['code']);
$username = $user['data']['username'];

/* Body + validation */
$body = get_json_input();
if (empty($body['particulars']) || empty($body['date']) || empty($body['grandTotal'])) {
    respond(['success' => false, 'error' => 'Missing required fields'], 400);
}

/* Customer balance */
$custId = $body['custId'] ?? null;
$oldBal = 0.0;
if ($custId) {
    $row = GetRow("SELECT balance FROM customers WHERE del=0 AND id={$custId}", $con);
    if (!$row) respond(['success' => false, 'error' => 'Customer not found'], 404);
    $oldBal = (float)$row['balance'];
}

/* Money math */
$total  = (float)$body['grandTotal'];
$paid   = (float)($body['paid'] ?? 0);
$newBal = $oldBal + $total - $paid;
if ($newBal < 0) {
    respond(['success' => false, 'error' => 'Updated balance cannot be negative: ' . $newBal], 400);
}

/* Items JSON */
$items = $body['particulars'];

/* Start transaction */
$con->begin_transaction();
try {
    /* Insert delivery note */
    $noteId = insert_data_id([
        'cust_id'     => $custId ?: null,
        'name'        => $body['name']   ?? null,
        'mobile'      => $body['mobile'] ?? null,
        'date'        => $body['date'],
        'items'       => json_encode($items),
        'total_amount' => $total,
        'old_balance' => $oldBal,
        'grand_total' => $oldBal + $total,
        'paid'        => $paid,
        'balance'     => $newBal,
        'status'      => $body['status'] ?? 'pending',
        'del'         => 0,
        'created_by'  => $username,
        'created_at'  => date('Y-m-d H:i:s'),
        'updated_at'  => date('Y-m-d H:i:s'),
    ], 'delivery_notes', $con);

    if (!$noteId) throw new Exception('Failed to create delivery note');

    /* Update customer balance if credit customer */
    if ($custId) {
        $ok = Execute("UPDATE customers SET balance={$newBal} WHERE id={$custId}", $con);
        if (!$ok) throw new Exception('Failed to update customer balance');
    }

    $con->commit();
    respond([
        'success' => true,
        'message' => 'Delivery note created successfully',
        'data'   => ['id' => $noteId],
    ], 201);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;  // global handler converts to JSON
}
