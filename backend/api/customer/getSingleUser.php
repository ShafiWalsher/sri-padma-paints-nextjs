<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['error' => 'Invalid request method'], 405);
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    respond(['error' => 'Missing or invalid user ID'], 400);
}

$id = (int) $_GET['id'];
$user = GetRow("SELECT * FROM customers WHERE id = $id", $con);

if ($user) {
    respond(['user' => $user]);
} else {
    respond(['error' => 'User not found'], 404);
}
