<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'error' => 'Only POST allowed'], 405);
}

$body = get_json_input();

// Validate required fields
if (empty($body['customer_id']) || empty($body['name']) || empty($body['mobile'])) {
    respond(['success' => false, 'error' => 'customer_id, name and mobile are required'], 400);
}

$customerId = $body['customer_id'];

$con->begin_transaction();

try {
    // Check if customer exists
    $existingCustomer = GetRow("SELECT id FROM customers WHERE id = {$customerId} AND del = 0", $con);
    if (!$existingCustomer) {
        throw new Exception('Customer not found');
    }

    // Check if mobile is taken by another customer
    $mobileCheck = GetRow("SELECT id FROM customers WHERE mobile = {$body['mobile']} AND id != {$customerId} AND del = 0", $con);
    if ($mobileCheck) {
        throw new Exception('Mobile number already exists for another customer');
    }

    // Update customer basic info
    $customerData = [
        'name' => $body['name'],
        'mobile' => $body['mobile'],
        'address' => $body['address'] ?? '',
    ];

    $customerUpdated = update_data($customerData, 'customers', "id = {$customerId}", $con);
    if (!$customerUpdated) {
        throw new Exception('Failed to update customer');
    }

    $con->commit();

    respond([
        'success' => true,
        'message' => 'Customer updated successfully',
    ], 200);
} catch (Throwable $e) {
    $con->rollback();
    throw $e;
}
