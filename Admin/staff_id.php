<?php
session_start();
include '../header.php';

$level = $_SESSION['level'] ?? null;
$role = $_SESSION['role'] ?? null;
$staff = $_SESSION['staff_id'] ?? null;

error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_clean();

include_once '../../connectDB/connectDB.php';
$objCon = connectDB();

if ($objCon === false) {
    error_log("Database connection failed: " . print_r(sqlsrv_errors(), true));
    die(json_encode(['error' => 'Database connection failed.']));
}

$usrid_default = ['16387'];

$usrid = match (true) {
    $level == '3' => [...$usrid_default, '36', '42', '47', '50', '79', '80', '96', '97', '101', '104', '105', '107', '110', '112', '115', '122', '124', '125', '126', '127', '128', '129', '131', '132', '133', '135', '140', '150'],
    $level == '2' && ($role == 'MK' || $role == 'SUPER ADMIN') => [...$usrid_default, '23', '36', '42', '47', '50', '79', '80', '96', '97', '101', '104', '105', '107', '110', '112', '115', '122', '124', '125', '126', '127', '128', '129', '131', '132', '133', '135', '140', '150'],
    $level == '2' && $role == 'MK Online' => [...$usrid_default, '23', '25', '26', '36', '42', '47', '50', '79', '80', '89', '96', '97', '101', '104', '105', '107', '110', '112', '115', '122', '124', '125', '126', '127', '128', '129', '131', '132', '133', '135', '140', '150'],
    $level == '2' && $role == 'MK Offline' => [...$usrid_default, '23', '25', '26', '30', '36', '42', '47', '50', '79', '80', '93', '96', '97', '101', '104', '105', '107', '110', '112', '115', '118', '122', '124', '125', '126', '127', '128', '129', '131', '132', '133', '135', '137', '138', '140', '150', '152'],
    default => $usrid_default
};

if (empty($usrid)) {
    echo json_encode(['error' => 'No valid users found']);
    exit;
}

$placeholders = implode(',', array_fill(0, count($usrid), '?'));
$sql = "SELECT A.staff_id, B.fname_e, B.nick_name 
        FROM xuser AS A
        LEFT JOIN hr_staff B ON A.staff_id = B.staff_id
        LEFT JOIN a_user C ON A.staff_id = C.staff_id
        WHERE gid = '16387' 
          AND usrid NOT IN ($placeholders)
          AND A.isactive = 'Y' 
          AND A.staff_id <> ''
          AND B.position_code = 067
          AND C.active = 'Y'";

$stmt1 = sqlsrv_query($objCon, $sql, $usrid);

if ($stmt1 === false) {
    error_log("SQL query failed: " . print_r(sqlsrv_errors(), true));
    die(json_encode(['error' => 'Query execution failed.']));
}

$sales_data = [];
while ($row = sqlsrv_fetch_array($stmt1, SQLSRV_FETCH_ASSOC)) {
    $sales_data[] = $row;
}

sqlsrv_close($objCon);

header('Content-Type: application/json');
echo json_encode($sales_data);
