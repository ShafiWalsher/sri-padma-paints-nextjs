<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

/* ───────────────── Method guard ───────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

/* ───────────────── Parse & validate body ───────────────── */
$body = get_json_input();

if (empty($body['products']) || !is_array($body['products'])) {
    respond(['success' => false, 'error' => 'Field `products` must be a non-empty array'], 400);
}

$products = $body['products'];
$table    = 'products';

/* ───────────────── Bulk insert loop ───────────────── */
foreach ($products as $idx => $product) {
    $ok = insert_data($product, $table, $con);
    if (!$ok) {
        respond([
            'success' => false,
            'error'   => "Failed to insert product at index $idx",
        ], 500);
    }
}

/* ───────────────── Success ───────────────── */
respond([
    'success' => true,
    'message' => 'Products created successfully!',
], 201);
