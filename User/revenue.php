<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../../connectDB/connectDB.php';
$objCon = connectDB();

if ($objCon === false) {
  die(print_r(sqlsrv_errors(), true));
}

// Get parameters with defaults
$level      = $_GET['Level']      ?? null;
$currentYear  = date("Y");
$currentMonth = date("m");
$year_no    = $_GET['year_no']    ?? $currentYear;
$month_no   = $_GET['month_no']   ?? $currentMonth;
$channel    = $_GET['channel']    ?? null;
$Sales      = $_GET['Sales']?? null;
$is_new     = $_GET['is_new']     ?? null;

// Prepare WHERE conditions and params
$where = [[], [], [], []];
$params = [];

$is_new_array = match ($is_new) {
  'N', 'R', 'A', 'K' => [$is_new],
  default => []
};
if ($is_new !== '0') {
  if ($is_new_array) {
    $where[3][] = "A.customer_type IN ('" . implode("','", $is_new_array) . "')";
  }
  if ($year_no !== '0') {
    $where[0][] = "year_no = ?";
    $where[1][] = "YEAR(A.qt_date) = ?";
    $where[2][] = "YEAR(C.appoint_date) = ?";
    $where[3][] = "year_no = ?";
    $params[] = $year_no;
  }
  if ($month_no !== '0') {
    $where[0][] = "month_no = ?";
    $where[1][] = "MONTH(A.qt_date) = ?";
    $where[2][] = "MONTH(C.appoint_date) = ?";
    $where[3][] = "month_no = ?";
    $params[] = $month_no;
  }
} else {
  if ($year_no !== '0') {
    $where[0][] = "year_no = ?";
    $where[1][] = "YEAR(A.qt_date) = ?";
    $where[2][] = "YEAR(A.shipment_date) = ?";
    $where[3][] = "year_no = ?";
    $params[] = $year_no;
  }
  if ($month_no !== '0') {
    $where[0][] = "month_no = ?";
    $where[1][] = "MONTH(A.qt_date) = ?";
    $where[2][] = "MONTH(A.shipment_date) = ?";
    $where[3][] = "month_no = ?";
    $params[] = $month_no;
  }
}

if ($channel !== 'N') {
  $where[0][] = "A.is_call = ?";
  $where[1][] = "A.sales_channels_group_code = ?";
  $where[2][] = "C.sales_channels_group_code = ?";
  $where[3][] = "A.sales_channels_group_code = ?";
  $params[] = $channel;
}

if ($Sales !== 'N') {
  $where[0][] = "A.staff_id = ?";
  $where[1][] = "A.staff_id = ?";
  $where[2][] = "C.staff_id = ?";
  $where[3][] = "A.staff_id = ?";
  $params[] = $Sales;
}

// Build WHERE clauses
$where_clause  = $where[0] ? implode(" AND ", $where[0]) : "1=1";
$where_clause1 = $where[1] ? implode(" AND ", $where[1]) : "1=1";
$where_clause2 = $where[2] ? implode(" AND ", $where[2]) : "1=1";
$where_clause3 = $where[3] ? implode(" AND ", $where[3]) : "1=1";

// SQL Queries
$sqlappoint = "
  SELECT 
    COUNT(DISTINCT appoint_no) AS appoint_no,
    COUNT(DISTINCT appoint_quality) AS appoint_quality,
    COUNT(DISTINCT appoint_qt) AS appoint_qt,
    SUM(so_amount) AS value_customer
  FROM (
    SELECT 
      A.appoint_no AS appoint_no,
      CASE WHEN A.staff_id <> '1119900831940' THEN A.appoint_no END AS appoint_quality,
      CASE WHEN B.print_qt_count > 0 AND B.is_pre = 'N' AND B.print_qt_id IN (5,50) THEN B.appoint_no END AS appoint_qt,
      B.so_amount
    FROM appoint_head A
    LEFT JOIN cost_sheet_head B ON A.appoint_no = B.appoint_no 
    WHERE $where_clause
  ) AS subquery
";

$sqlcostsheet = "
  SELECT 
    COUNT(DISTINCT A.appoint_no) AS qt_customer,
    COUNT(DISTINCT A.qt_no) AS qt_number,
    SUM(A.so_amount) AS so_amount
  FROM cost_sheet_head A
  LEFT JOIN View_SO_SUM B ON A.appoint_no = B.appoint_no
  WHERE A.print_qt_count > 0
    AND A.is_pre = 'N'
    AND A.print_qt_id IN (5,50)
    AND is_status = 'A'
    AND $where_clause1
";

$sqlorder = "
  SELECT 
    SUM(C.so_amount) AS order_amount,
    COUNT(A.order_no) AS order_no
  FROM order_head A
  LEFT JOIN so_detail B ON A.order_no = B.order_no
  LEFT JOIN cost_sheet_head C ON A.qt_no = C.qt_no
  WHERE A.is_status <> 'C'
    AND B.so_no IS NULL
    AND $where_clause2
";

$sqlrevenue = "
  SELECT 
    COUNT(customer_number) AS customer_number,
    COUNT(DISTINCT CASE WHEN lead IS NOT NULL AND lead <> '' THEN lead END) AS lead,
    SUM(so_amount) AS so_amount
  FROM (
    SELECT 
      A.qt_no AS customer_number,
      A.appoint_no AS lead,
      SUM(A.total_before_vat) AS so_amount
    FROM View_SO_SUM A
    WHERE $where_clause3
    GROUP BY A.qt_no, A.appoint_no
  ) AS subquery
";

$sqlsegment = "
  SELECT 
    b.customer_segment_name, 
    FORMAT(SUM(total_before_vat), 'N2') AS total_before_vat, 
    FORMAT(SUM(total_before_vat) / COUNT(a.customer_segment_code), 'N2') AS aov, 
    COUNT(a.customer_segment_code) AS segment_count 
  FROM View_SO_SUM A
  LEFT JOIN ms_customer_segment b ON a.customer_segment_code = b.customer_segment_code
  WHERE $where_clause3
  GROUP BY b.customer_segment_name
";

$sqlregion = "
  SELECT 
    C.customer_segment_name AS segment,
    COUNT(CASE WHEN B.zone_code = '01' THEN A.province_code END) AS 'North',
    COUNT(CASE WHEN B.zone_code = '02' THEN A.province_code END) AS 'Central',
    COUNT(CASE WHEN B.zone_code = '03' THEN A.province_code END) AS 'North_East',
    COUNT(CASE WHEN B.zone_code = '04' THEN A.province_code END) AS 'West',
    COUNT(CASE WHEN B.zone_code = '05' THEN A.province_code END) AS 'East',
    COUNT(CASE WHEN B.zone_code = '06' THEN A.province_code END) AS 'South'
  FROM View_SO_SUM A
  LEFT JOIN ms_province B ON A.province_code = B.province_code
  LEFT JOIN ms_customer_segment C ON A.customer_segment_code = C.customer_segment_code
  WHERE $where_clause3
  GROUP BY C.customer_segment_name
";

// Execute queries
$stmt_appoint   = sqlsrv_query($objCon, $sqlappoint, $params);
$stmt_costsheet = sqlsrv_query($objCon, $sqlcostsheet, $params);
$stmt_order     = sqlsrv_query($objCon, $sqlorder, $params);
$stmt_revenue   = sqlsrv_query($objCon, $sqlrevenue, $params);
$stmt_segment   = sqlsrv_query($objCon, $sqlsegment, $params);
$stmt_region    = sqlsrv_query($objCon, $sqlregion, $params);

// Error handling
if ($stmt_costsheet === false || $stmt_revenue === false) {
  die(print_r(sqlsrv_errors(), true));
}

// Fetch data
function fetchAll($stmt) {
  $data = [];
  while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $data[] = $row;
  }
  return $data;
}

$data = [
  'appointment' => fetchAll($stmt_appoint),
  'costSheets'  => fetchAll($stmt_costsheet),
  'orders'      => fetchAll($stmt_order),
  'revenue'     => fetchAll($stmt_revenue),
  'segments'    => fetchAll($stmt_segment),
  'regions'     => fetchAll($stmt_region)
];

sqlsrv_close($objCon);

header('Content-Type: application/json');
echo json_encode($data);
?>
