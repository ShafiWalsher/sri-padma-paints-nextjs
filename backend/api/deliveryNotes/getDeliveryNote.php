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

// Retrieve all delivery notes
$delivery_note = GetRow("SELECT * FROM delivery_notes WHERE del=0 AND id={$id}", $con);

if ($delivery_note) {
    // Decode JSON field
    $delivery_note['items'] = json_decode($delivery_note['items'], true);

    respond(['success' => true, 'data' => $delivery_note]);
} else {
    respond(['success' => false, 'error' => 'User not found'], 404);
}
