<?php
require_once  '../cors.php';
require_once  '../connect-db.php';
require_once  '../config.php';        // JWT configuration

validate_bearer_token();


// Include required files
require_once __DIR__ . '/../../vendor/autoload.php'; // Composer autoloader

use Firebase\JWT\JWT;

// Get the JSON input from the request body
$input = get_json_input();
$username = $input['username'] ?? null;
$password = $input['password'] ?? null;

if (!$username || !$password) {
    respond(['success' => false, 'error' => 'Username and password are required.'], 400);
}

$user = GetRow("SELECT * FROM users WHERE username = '{$username}'", $con);


if (!$user || !password_verify($password, $user['password_hash'])) {
    respond(['success' => false, 'error' => 'Invalid credentials.'], 401);
}


// --- User is authenticated, create JWT ---
$issuedAt = time();
$expirationTime = $issuedAt + JWT_EXPIRATION_TIME;

$payload = [
    'iss' => JWT_ISSUER,
    'aud' => JWT_AUDIENCE,
    'iat' => $issuedAt,
    'exp' => $expirationTime,
    'sub' => $user['id'], // Subject of the token (user ID)
    'username' => $user['username'],
    'role' => $user['role'],
];

$jwt = JWT::encode($payload, JWT_SECRET_KEY, 'HS256');

// Set the JWT in a secure, HTTP-only cookie
setcookie('jwt_token', $jwt, [
    'expires' => $expirationTime,
    'path' => '/',
    'domain' => '', // Set your domain in production
    'secure' => false, // Set to TRUE in production (HTTPS)
    'httponly' => true,
    'samesite' => 'Lax' // Or 'Strict'
]);

// Prepare user data for the response (do NOT include password hash)
$responseData = [
    'id' => (int) $user['id'],
    'username' => $user['username'],
    'role' => $user['role']
];

// Send success response as per our frontend requirements
respond([
    'success' => true,
    'data' => $responseData,
    'message' => 'Login successful!'
]);