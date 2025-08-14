<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

$customerId = $_GET['customer_id'] ?? null;

if (!$customerId) {
    respond(['success' => false, 'error' => 'customer_id required'], 400);
}

// Retrieve all customers
$customer = GetRow("SELECT * FROM customers WHERE id={$customerId} AND del=0", $con);


if (!$customer) {
    respond(['success' => false, 'error' => 'Customer not found'], 404);
}

respond([
    'success' => true,
    'data' => $customer,
]);
