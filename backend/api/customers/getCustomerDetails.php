<?php
require_once '../cors.php';
require_once '../connect-db.php';
validate_bearer_token();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['success' => false, 'error' => 'Only GET allowed'], 405);
}

$customerId = $_GET['customer_id'] ?? null;

if (!$customerId) {
    respond(['success' => false, 'error' => 'customer_id required'], 400);
}

// Get customer basic info
$customer = GetRow("SELECT * FROM customers WHERE id = {$customerId} AND del = 0", $con);
if (!$customer) {
    respond(['success' => false, 'error' => 'Customer not found'], 404);
}

// Get all accounts for this customer
$accounts = GetAllA("SELECT 
                        id, 
                        account_name, 
                        balance, 
                        is_default, 
                        created_at, 
                        updated_at
                    FROM customer_accounts 
                    WHERE customer_id = {$customerId} AND del = 0 
                    ORDER BY is_default DESC, account_name ASC", $con);

// Calculate totals
$totalBalance = array_sum(array_column($accounts, 'balance'));
$accountsCount = count($accounts);

// Find default account
$defaultAccount = null;
foreach ($accounts as $account) {
    if ($account['is_default'] == 1) {
        $defaultAccount = $account;
        break;
    }
}

respond([
    'success' => true,
    'data' => [
        'customer' => $customer,
        'accounts' => $accounts,
        'default_account' => $defaultAccount,
        'total_balance' => $totalBalance,
        'accounts_count' => $accountsCount,
    ]
]);
