<?php

/**
 * Database configuration
 */
$server = 'localhost';
$user   = 'root';
$pass   =  '';
$dbname = 'sri_padma_paints';

// Default Time Zone
date_default_timezone_set("Asia/Kolkata");

/**
 * Establish database connection using mysqli (procedural style).
 * On connection error, output a JSON error response.
 */
$con = mysqli_connect($server, $user, $pass, $dbname);
if (!$con) {
    // Sending JSON error response for REST APIs
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Connection to host is failed, perhaps the service is down!']);
    exit;
}

/**
 * API Auth Token (change as required)
 */
define('AUTH_TOKEN', 'XkrM5FQOVu');

/**
 * Validate the Bearer token from the Authorization header.
 * Responds with an error if token is missing, malformed, or invalid.
 */
function validate_bearer_token(): void
{
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        respond(['error' => 'Missing or malformed Authorization header'], 401);
    }
    $token = $matches[1];
    if ($token !== AUTH_TOKEN) {
        respond(['error' => 'Invalid token'], 403);
    }
}

/**
 * Send a JSON response with proper HTTP status and exit.
 */
function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Retrieve JSON input from the request body as an associative array.
 */
function get_json_input(): array
{
    $input = file_get_contents("php://input");
    return json_decode($input, true) ?? [];
}

/**
 * Get all rows from a SQL query as an associative array.
 */
function GetAllA(string $sql, mysqli $con): array
{
    $result = mysqli_query($con, $sql);
    $result_array = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $result_array[] = $row;
    }
    return $result_array;
}

/**
 * Convert a date string to a formatted date (d-m-Y).
 * Returns null if the date is invalid (e.g., '0000-00-00' or empty).
 */
function date_ch(string $dt): ?string
{
    if ($dt !== '0000-00-00' && $dt !== '') {
        $timestamp = strtotime($dt);
        return date('d-m-Y', $timestamp);
    }
    return null;
}

/**
 * Get a single row from a SQL query as an associative array.
 */
function GetRow(string $sql, mysqli $con): ?array
{
    $result = mysqli_query($con, $sql);
    return mysqli_fetch_assoc($result) ?: null;
}

/**
 * Insert data into a specified table.
 * Returns true on success, false otherwise.
 */
function insert_data(array $data, string $table_name, mysqli $con): bool
{
    $keys = array_keys($data);
    $values = array_map(function ($val) use ($con) {
        if (is_null($val)) {
            return 'NULL';
        } elseif (is_bool($val)) {
            return $val ? '1' : '0';
        } elseif (is_numeric($val)) {
            return $val;
        } else {
            return "'" . mysqli_real_escape_string($con, $val) . "'";
        }
    }, array_values($data));



    $query = "INSERT INTO `$table_name` (" . implode(',', $keys) . ") VALUES(" . implode(", ", $values) . ")";
    return mysqli_query($con, $query);
}

/**
 * Insert data into a table and return the newly inserted ID.
 * Returns the ID (int) on success or false on failure.
 */
function insert_data_id(array $data, string $table_name, mysqli $con): int|false
{
    $keys = array_keys($data);
    $values = array_map(function ($val) use ($con) {
        if (is_null($val)) {
            return 'NULL';
        } elseif (is_bool($val)) {
            return $val ? '1' : '0';
        } elseif (is_numeric($val)) {
            return $val;
        } else {
            return "'" . mysqli_real_escape_string($con, $val) . "'";
        }
    }, array_values($data));

    $query = "INSERT INTO `$table_name` (" . implode(',', $keys) . ") VALUES(" . implode(", ", $values) . ")";

    if (mysqli_query($con, $query)) {
        return (int) mysqli_insert_id($con);
    }
    return false;
}

/**
 * Update data in a table based on a specified WHERE condition.
 * Returns true on success, false otherwise.
 */
function update_data(array $data, string $table_name, string $where, mysqli $con): bool
{
    $cols = [];
    foreach ($data as $key => $val) {
        $escaped_val = mysqli_real_escape_string($con, (string)$val);
        $cols[] = "$key = '$escaped_val'";
    }


    $query = "UPDATE $table_name SET " . implode(', ', $cols) . " WHERE $where";
    return mysqli_query($con, $query);
}

/**
 * Get a single value from a SQL query.
 * Returns the value, or null if not found.
 */
function GetOne(string $sql, mysqli $con): mixed
{
    $result = mysqli_query($con, $sql);
    $row = mysqli_fetch_assoc($result);
    if ($row !== null) {
        $values = array_values($row);
        return $values[0] ?? null;
    }
    return null;
}


/**
 * Get the first column of each row from a SQL query.
 */
function GetCol(string $sql, mysqli $con): array
{
    $result = mysqli_query($con, $sql);
    $result_array = [];
    while ($row = mysqli_fetch_array($result)) {
        $result_array[] = $row[0];
    }
    return $result_array;
}

/**
 * Execute a SQL command (such as DELETE, UPDATE without result set).
 * Returns true if execution was successful, otherwise false.
 */
function Execute(string $sql, mysqli $con): bool
{
    $result = mysqli_query($con, $sql);
    return (bool)$result;
}

/**
 * Debug function to print an array in a readable format.
 */
function print_array(mixed $array, bool $exit = false): void
{
    echo '<pre>';
    print_r($array);
    echo '</pre>';
    if ($exit) {
        exit;
    }
}
