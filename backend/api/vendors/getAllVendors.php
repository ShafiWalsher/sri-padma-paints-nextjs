<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

$vendors = GetAllA("SELECT id, vendor_name, address, city, state, postal_code, mobile, email, gst_number FROM vendors", $con);


respond(['success' => true, 'data' => $vendors]);
