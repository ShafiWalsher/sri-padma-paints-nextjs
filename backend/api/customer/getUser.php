<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    respond(['success' => false, 'error' => 'Missing or invalid user ID'], 400);
}

$id = (int) $_GET['id'];
$user = GetRow("SELECT * FROM customers WHERE id = $id", $con);

if ($user) {
    respond(['success' => true, 'data' => $user]);
} else {
    respond(['success' => false, 'error' => 'User not found'], 404);
}
