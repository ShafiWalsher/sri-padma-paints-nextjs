<?php

require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    respond(['error' => 'Invalid request method'], 405);
}

// Retrieve the user ID from URL parameters (?id=123)
$userId = $_GET['id'] ?? null;
if (!$userId || !is_numeric($userId)) {
    respond(['error' => 'Invalid or missing user ID'], 400);
}

// Parse the JSON body from the request
$data = get_json_input();

// Define fields which are allowed to be updated
$allowedFields = ['name', 'mobile', 'address'];
// Only retain keys in the input data which are allowed
$updateData = array_intersect_key($data, array_flip($allowedFields));

if (empty($updateData)) {
    respond(['error' => 'No valid fields provided for update'], 400);
}

// Update the user data in the "customers" table
$updated = update_data($updateData, 'customers', "id = $userId", $con);

if ($updated) {
    respond(['message' => 'User updated successfully']);
} else {
    respond(['error' => 'Failed to update user'], 500);
}
