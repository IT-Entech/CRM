<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once('C:\xampp\htdocs\connectDB\connectDB.php');
$objCon = connectDB(); // Connect to the database

if ($objCon === false) {
    die(json_encode(["error" => sqlsrv_errors()]));
}

$year_no = $_GET['year_no'] ?? date('Y');
$month_no = $_GET['month_no'] ?? date('m');
$Status = $_GET['Status'] ?? '00';
$Sales = $_GET['Sales'] ?? 'N'; 
$staff = isset($_GET['staff']) ? $_GET['staff'] : NULL;

$isFullYear = ($month_no == '00');

// ------------------ SQL Revenue ------------------
$sqlrevenue = "
    SELECT 
        FORMAT(DATEFROMPARTS(A.year_no, A.month_no, 1), 'yyyy-MM') AS format_date,
        SUM(A.total_before_vat) AS so_amount,
        COUNT(A.so_no) AS so_no
    FROM View_SO_SUM A
    WHERE A.year_no = ?
";

$params = [$year_no];
if (!$isFullYear) {
    $sqlrevenue .= " AND A.month_no = ? ";
    $params[] = $month_no;
}

// กรอง staff ถ้าเลือก
if ($staff != 'N') {
    $sqlrevenue .= " AND A.staff_id = ? ";
    $params[] = $staff;
}

$sqlrevenue .= " GROUP BY FORMAT(DATEFROMPARTS(A.year_no, A.month_no, 1), 'yyyy-MM') ORDER BY format_date ASC ";

$stmt = sqlsrv_query($objCon, $sqlrevenue, $params);
$revenueData = [];
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $revenueData[] = $row;
}

// ------------------ SQL Appointment ------------------
$sqlap = "
    SELECT 
        FORMAT(appoint_date, 'yyyy-MM') AS format_date,
        COUNT(CASE WHEN qt_no IS NULL AND is_status <> 4 THEN appoint_no END) AS appoint_no,
        COUNT(CASE WHEN qt_no IS NULL AND is_status = 4 THEN appoint_no END) AS specific_appoint_no
    FROM appoint_head
    WHERE year_no = ?
";

$params = [$year_no];
if (!$isFullYear) {
    $sqlap .= " AND month_no = ? ";
    $params[] = $month_no;
}

// กรอง staff
if ($staff != 'N') {
    $sqlap .= " AND staff_id = ? ";
    $params[] = $staff;
}

$sqlap .= " AND qt_no IS NULL GROUP BY FORMAT(appoint_date, 'yyyy-MM') ORDER BY format_date ASC ";

$stmt = sqlsrv_query($objCon, $sqlap, $params);
$apData = [];
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $apData[] = $row;
}

// ------------------ SQL Cost Sheet ------------------
$sqlcostsheet = "
    SELECT 
        FORMAT(qt_date, 'yyyy-MM') AS format_date,
        SUM(so_amount) AS so_amount,
        COUNT(A.qt_no) AS qt_no,
        COUNT(CASE WHEN is_prospect = '00' THEN A.qt_no END) AS Unknown,
        SUM(CASE WHEN is_prospect = '00' AND is_tracking IN ('1','3') THEN so_amount END) AS Unknown_amount,
        SUM(CASE WHEN is_prospect = '00' AND is_tracking IN ('2','4') THEN so_amount END) AS lost_Unknown_amount,
        COUNT(CASE WHEN is_prospect = '05' THEN A.qt_no END) AS potential,
        SUM(CASE WHEN is_prospect = '05' AND is_tracking IN ('1','3') THEN so_amount END) AS potential_amount,
        SUM(CASE WHEN is_prospect = '05' AND is_tracking IN ('2','4') THEN so_amount END) AS lost_potential_amount,
        COUNT(CASE WHEN is_prospect = '04' THEN A.qt_no END) AS prospect,
        SUM(CASE WHEN is_prospect = '04' AND is_tracking IN ('1','3') THEN so_amount END) AS prospect_amount,
        SUM(CASE WHEN is_prospect = '04' AND is_tracking IN ('2','4') THEN so_amount END) AS lost_prospect_amount,
        COUNT(CASE WHEN is_prospect = '06' THEN A.qt_no END) AS pipeline,
        SUM(CASE WHEN is_prospect = '06' AND is_tracking IN ('1','3') THEN so_amount END) AS pipeline_amount,
        SUM(CASE WHEN is_prospect = '06' AND is_tracking IN ('2','4') THEN so_amount END) AS lost_pipeline_amount
    FROM cost_sheet_head A
    WHERE is_status <> 'C'
";

$params = [];
if (!$isFullYear) {
    $sqlcostsheet .= " AND MONTH(qt_date) = ? ";
    $params[] = $month_no;
}
$sqlcostsheet .= " AND YEAR(qt_date) = ? ";
$params[] = $year_no;

// กรอง staff
if ($staff != 'N') {
    $sqlcostsheet .= " AND staff_id = ? ";
    $params[] = $staff;
}

$sqlcostsheet .= " AND NOT EXISTS (SELECT 1 FROM so_detail B WHERE A.qt_no = B.qt_no) ";
$sqlcostsheet .= " GROUP BY FORMAT(qt_date, 'yyyy-MM') ORDER BY format_date ASC ";

$stmt = sqlsrv_query($objCon, $sqlcostsheet, $params);
$qtData = [];
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $qtData[] = $row;
}

// ------------------ SQL Table Data ------------------
$sqlappoint = "
    SELECT 
        FORMAT(A.appoint_date, 'dd-MM-yyyy') AS appoint_date,
        A.customer_name, A.qt_no,
        FORMAT(A.so_amount, 'N2') AS so_amount,
        pp.prospect_name, pp.prospect_code, 
        A.remark, ms.status_name, ms.status_code, A.reasoning
    FROM cost_sheet_head A
    LEFT JOIN ms_appoint_status ms ON A.is_tracking = ms.status_code
    LEFT JOIN ms_prospect pp ON A.is_prospect = pp.prospect_code
    LEFT JOIN so_customer_status B ON A.qt_no = B.qt_no
    WHERE A.is_status <> 'C' AND B.so_no IS NULL
";

// ถ้า Status != '00'
$params = [];
if ($Status != '00') {
    $sqlappoint .= " AND A.is_prospect = ? ";
    $params[] = $Status;
}

// เดือน/ปี
if ($isFullYear) {
    $sqlappoint .= " AND YEAR(A.qt_date) = ? ";
    $params[] = $year_no;
} else {
    $sqlappoint .= " AND MONTH(A.qt_date) = ? AND YEAR(A.qt_date) = ? ";
    $params[] = $month_no;
    $params[] = $year_no;
}

// กรอง staff
if ($staff != 'N') {
    $sqlappoint .= " AND A.staff_id = ? ";
    $params[] = $staff;
}

$sqlappoint .= " ORDER BY A.qt_date DESC ";

$stmt = sqlsrv_query($objCon, $sqlappoint, $params);
$tableData = [];
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $tableData[] = $row;
}

// ------------------ Return JSON ------------------
sqlsrv_close($objCon);
echo json_encode([
    'revenueData' => $revenueData,
    'apData'      => $apData,
    'qtData'      => $qtData,
    'tableData'   => $tableData
], JSON_UNESCAPED_UNICODE);
?>
