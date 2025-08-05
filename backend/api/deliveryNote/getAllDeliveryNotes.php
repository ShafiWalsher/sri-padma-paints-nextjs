<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

// Retrieve all delivery notes
$delivery_notes = GetAllA("SELECT * FROM delivery_notes WHERE del=0", $con);

// Decode `items` JSON for each delivery note
foreach ($delivery_notes as &$note) {
    if (isset($note['items'])) {
        $note['items'] = json_decode($note['items'], true);
    }
}

respond(['success' => true, 'data' => $delivery_notes]);
