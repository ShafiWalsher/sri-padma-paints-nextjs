<?php
require_once  '../cors.php';
require_once  '../connect-db.php';
require_once  '../config.php';        // JWT configuration

validate_bearer_token();


require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Check if the JWT cookie exists
if (!isset($_COOKIE['jwt_token'])) {
    respond(['success' => false, 'error' => 'Not authenticated'], 401);
}

$jwt = $_COOKIE['jwt_token'];

try {
    // Decode the JWT
    $decoded = JWT::decode($jwt, new Key(JWT_SECRET_KEY, 'HS256'));

    // Prepare user data from the token payload
    $userData = [
        'id' => $decoded->sub,
        'username' => $decoded->username,
        'role' => $decoded->role
    ];

    // Respond with success and user data
    respond(['success' => true, 'data' => $userData]);

} catch (Exception $e) {
    // Handles expired, invalid signature, etc.
    respond(['success' => false, 'error' => 'Invalid or expired session.'], 401);
}