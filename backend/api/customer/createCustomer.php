<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Invalid request method'], 405);
}

$data = get_json_input();

// Check required fields
if (!isset($data['name'], $data['mobile'])) {
    respond(['error' => 'Missing required fields'], 400);
}

$user = $data;
unset($data);


$inserted = insert_data_id($user, 'customers', $con);

if ($inserted) {
    respond(['success' => true, 'message' => 'User created successfully']);
} else {
    respond(['error' => 'Failed to create user'], 500);
}
