<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['error' => 'Invalid request method'], 405);
}


// Retrieve all customers
$customers = GetAllA("SELECT * FROM customers", $con);

respond(['success' => true, 'data' => $customers]);