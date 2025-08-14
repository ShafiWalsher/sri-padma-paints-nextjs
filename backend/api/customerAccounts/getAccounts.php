<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

$customerId = $_GET['customer_id'] ?? null;

if (!$customerId) {
    respond(['success' => false, 'error' => 'account_id required'], 400);
}

// Get account information
$accounts  = GetAllA("SELECT * FROM customer_accounts WHERE customer_id = {$customerId} AND del = 0", $con);

if (!$accounts) {
    respond(['success' => false, 'error' => 'No Accounts not found'], 404);
}

respond([
    'success' => true,
    'data' => $accounts,
]);
