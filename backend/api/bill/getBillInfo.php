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
$bill_info = GetRow("SELECT * FROM bill_info WHERE id = $id", $con);

$bill_info['particulars'] = GetAllA("SELECT * FROM bill_items_info WHERE bill_id={$bill_info['id']}", $con);

if ($bill_info) {
    respond(['bill_info' => $bill_info]);
} else {
    respond(['error' => 'Bill not found'], 404);
}
