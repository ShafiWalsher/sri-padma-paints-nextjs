<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['error' => 'Invalid request method'], 405);
}

// Retrieve all products using the updated function GetAllA
$products = GetAllA("SELECT id, vendor_name, name, color, package, item_price, quantity FROM products", $con);
respond(['success' => true, 'data' => $products]);
