<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Invalid request method'], 405);
}

$sql = "SELECT 
            c.*,
            ca.balance AS default_account_balance,
            ca.account_name AS default_account_name,
            (SELECT COUNT(*) 
            FROM customer_accounts 
            WHERE customer_id = c.id AND del = 0) AS accounts_count,
            (SELECT SUM(balance) 
            FROM customer_accounts 
            WHERE customer_id = c.id AND del = 0) AS total_balance
        FROM customers c
        JOIN customer_accounts ca 
            ON ca.customer_id = c.id 
        AND ca.is_default = 1 
        AND ca.del = 0
        WHERE c.del = 0
        ORDER BY c.name ASC";


// Retrieve all customers
$customers = GetAllA($sql, $con);

respond([
    'success' => true,
    'data' => $customers,
]);
