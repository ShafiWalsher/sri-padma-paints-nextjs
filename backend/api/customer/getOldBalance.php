<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['error' => 'Invalid request method'], 405);
}

if (!isset($_GET['user_id']) || !is_numeric($_GET['user_id'])) {
    respond(['error' => 'Missing or invalid user ID'], 400);
}

$id = (int) $_GET['user_id'];
$balance = GetOne("SELECT balance FROM customers WHERE id = $id", $con);

if ($balance) {
    respond(['balance' => $balance]);
} else {
    respond(['error' => 'Error fetching Old Balance of the user'], 404);
}
