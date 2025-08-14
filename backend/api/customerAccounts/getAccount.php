<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

$accountId = $_GET['account_id'] ?? null;

if (!$accountId) {
    respond(['success' => false, 'error' => 'account_id required'], 400);
}

// Get account information
$account  = GetRow("SELECT * FROM customer_accounts WHERE id = {$accountId} AND del = 0", $con);


if (!$account) {
    respond(['success' => false, 'error' => 'Account not found'], 404);
}

respond([
    'success' => true,
    'data' => $account,
]);
