<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Invalid request method'], 405);
}

$data = get_json_input();

// Check required fields
if (!isset($data['products'])) {
    respond(['error' => 'Missing required fields'], 400);
}

$products = $data['products'];

foreach ($products as $product) {

    $data = [
        "vendor_name" => $product['name'],
        "name" => $product['name'],
        "color" => $product['color'],
        "package" => $product['package'],
        "item_price" => $product['item_price'],
        "quantity" => $product['quantity'],
    ];
    $table_name = "products";


    $result = insert_data($data, $table_name, $con);

    if (!$result) {
        break;
    }
}

if ($result) {
    respond(['message' => 'Products created successfully!.']);
} else {
    respond(['error' => 'Failed to create products'], 500);
}
