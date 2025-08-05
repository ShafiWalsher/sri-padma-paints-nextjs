<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

// Retrieve all products using the updated function GetAllA
$sql = "SELECT
            p.id,
            v.vendor_name,         
            p.name,
            p.color,
            p.package,
            p.item_price,
            p.quantity
        FROM products AS p
        INNER JOIN vendors  AS v ON v.id = p.vendor_id 
        ORDER BY p.id ASC";

$products = GetAllA($sql, $con);

respond(['success' => true, 'data' => $products]);
