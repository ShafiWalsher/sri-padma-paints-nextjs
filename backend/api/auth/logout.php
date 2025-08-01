<?php
require_once  '../cors.php';
require_once  '../connect-db.php';

validate_bearer_token();


// Clear the cookie by setting its expiration date to the past
setcookie('jwt_token', '', [
    'expires' => time() - 3600, // 1 hour ago
    'path' => '/',
    'domain' => '',
    'secure' => false, // Set to TRUE in production
    'httponly' => true,
    'samesite' => 'Lax'
]);

respond(['success' => true, 'message' => 'Logout successful.']);