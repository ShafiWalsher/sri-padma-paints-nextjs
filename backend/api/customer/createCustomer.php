<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

/* ───────── Allow only POST ───────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

/* ───────── Parse body and validate ───────── */
$body = get_json_input();

if (empty($body['name']) || empty($body['mobile'])) {
    respond(['success' => false, 'error' => 'Missing required fields'], 400);
}

/* ───────── Insert row (throws on SQL error) ───────── */
$customerId = insert_data_id($body, 'customers', $con);

if (!$customerId) {
    respond(['success' => false, 'error' => 'Failed to create user'], 500);
}

/* ───────── Success ───────── */
respond([
    'success' => true,
    'message' => 'User created successfully',
], 201);
