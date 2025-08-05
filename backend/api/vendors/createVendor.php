<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

/* ───────────────── Method guard ───────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

/* ───────────────── Parse & validate body ───────────────── */
$body = get_json_input();

if (!isset($body['vendor_name'], $body['mobile'])) {
    respond(['success' => false, 'error' => 'Missing required fields (Vendor Name & Mobile)'], 400);
}

/* ───────── Insert row (throws on SQL error) ───────── */
try {
    $id = insert_data_id($body, 'vendors', $con);
} catch (Throwable $e) {
    // Let the global handler convert to JSON
    throw $e;
}

respond([
    'success' => true,
    'message' => 'Vendor created successfully',
], 201);
