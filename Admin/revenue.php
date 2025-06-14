<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../../connectDB/connectDB.php'; // Include your database connection script
$objCon = connectDB(); // Connect to the database

if ($objCon === false) {
    die(print_r(sqlsrv_errors(), true));
}
$level = isset($_GET['Level']) ? $_GET['Level'] : NULL;
$currentYear = date("Y");
$currentMonth = date("m");
$year_no = isset($_GET['year_no']) ? $_GET['year_no'] : $currentYear;
$month_no = isset($_GET['month_no']) ? $_GET['month_no'] : $currentMonth;
$channel = isset($_GET['channel']) ? $_GET['channel'] : NULL;
$Sales = isset($_GET['Sales']) ? $_GET['Sales'] : NULL;
$is_new = isset($_GET['is_new']) ? $_GET['is_new'] : NULL;


// Initialize the WHERE clause array
$where_conditions = [];
$where_conditions1 = [];
$where_conditions2 = [];
$where_conditions3 = [];

$is_new_array = match ($is_new) { 
  '1' => ['01'],
  '2' => ['04'],
  '3' => ['03'],
  default => [] // Optional: handle other cases if needed
};
$is_new_list = "'" . implode("','", $is_new_array) . "'";
if ($is_new <> '0') {
  $where_conditions3[] = "A.status IN ($is_new_list)";

  if ($year_no <> '0') {
  $where_conditions[] = "year_no = ?";
  $where_conditions1[] = "B.year_no = ?";
  $where_conditions2[] = "YEAR(C.appoint_date) = ?";
  $where_conditions3[] = "year_no = ?";
  $params[] = $year_no;  // Use appoint_date year instead of year_no
  }

  if ($month_no <> '0') {
      $where_conditions[] = "month_no = ?";
      $where_conditions1[] = "B.month_no = ?";
      $where_conditions2[] = "MONTH(C.appoint_date) = ?";
      $where_conditions3[] = "month_no = ?";
      $params[] = $month_no;  // Use appoint_date month instead of month_no
  }
} else {
  if ($year_no <> '0') {
  $where_conditions[] = "YEAR(A.appoint_date) = ?";
  $where_conditions1[] = "B.year_no = ?";
  $where_conditions2[] = "YEAR(A.shipment_date) = ?";
  $where_conditions3[] = "year_no = ?";
  $params[] = $year_no;
  }
  if ($month_no <> '0') {
      $where_conditions[] = "A.month_no = ?";
      $where_conditions1[] = "B.month_no = ?";
      $where_conditions2[] = "MONTH(A.shipment_date) = ?";
      $where_conditions3[] = "month_no = ?";
      $params[] = $month_no;
  }
}
if ($channel <> 'N') {
  $where_conditions[] = "A.is_call = ?";
  $where_conditions1[] = "A.sales_channels_group_code = ?";
  $where_conditions2[] = "C.sales_channels_group_code = ?";
  $where_conditions3[] = "A.sales_channels_group_code = ?";
  $params[] = $channel;
}


if ($Sales <> 'N') {
  $where_conditions[] = "A.staff_id = ?";
  $where_conditions1[] = "B.staff_id = ?";
  $where_conditions2[] = "C.staff_id = ?";
  $where_conditions3[] = "A.staff_id = ?";
  $params[] = $Sales;
}
$sum = count($where_conditions);
$sum1 = count($where_conditions1);
$sum2 = count($where_conditions2);
$sum3 = count($where_conditions3);

// Combine all conditions into a single WHERE clause
$where_clause = count($where_conditions) > 0 ? implode(" AND ", $where_conditions) : "";
$where_clause1 = count($where_conditions1) > 0 ? implode(" AND ", $where_conditions1) : "";
$where_clause2 = count($where_conditions2) > 0 ? implode(" AND ", $where_conditions2) : "";
$where_clause3 = count($where_conditions3) > 0 ? implode(" AND ", $where_conditions3) : "";

$sqlappoint = "SELECT 
    SUM(appoint_no) AS appoint_no,
    SUM(appoint_quality) AS appoint_quality
FROM (
SELECT 
          COUNT(appoint_no) AS appoint_no,
          CASE WHEN staff_id <> '1119900831940' THEN COUNT(appoint_no) END AS appoint_quality
          FROM 
          appoint_head A
          WHERE 
           $where_clause
          GROUP BY 
          staff_id
) AS subquery
";
$sqlcostsheet = "SELECT COUNT(DISTINCT(A.appoint_no)) AS qt_customer,SUM(A.so_amount) AS so_amount FROM cost_sheet_head A
LEFT JOIN appoint_head B ON A.appoint_no = B.appoint_no
WHERE A.print_qt_count > 0
AND A.is_pre = 'N'
AND A.print_qt_id IN (5,50)
AND
 $where_clause1
    ";

$sqlorder = "SELECT SUM(C.so_amount) AS order_amount,COUNT((A.order_no)) AS order_no
                  FROM order_head A
                  LEFT JOIN so_detail B ON A.order_no = B.order_no
                  LEFT JOIN cost_sheet_head C ON A.qt_no = C.qt_no
                  WHERE  A.is_status <> 'C'
                  AND B.so_no IS NULL
                  AND $where_clause2
                  
";

$sqlrevenue = "SELECT 
    COUNT(customer_number) AS customer_number,
    SUM(so_amount) AS so_amount
FROM (
    SELECT 
        A.so_no AS customer_number,
        SUM(A.total_before_vat) AS so_amount
    FROM 
        View_SO_SUM A
    WHERE 
        $where_clause3
    GROUP BY 
        A.so_no
) AS subquery";
$sqlsegment = "SELECT 
    b.customer_segment_name, 
    FORMAT(SUM(total_before_vat), 'N2') AS total_before_vat, 
    FORMAT(SUM(total_before_vat) / COUNT(a.customer_segment_code), 'N2') AS aov, 
    COUNT(a.customer_segment_code) AS segment_count 
FROM 
    View_SO_SUM A
LEFT JOIN 
    ms_customer_segment b ON a.customer_segment_code = b.customer_segment_code
WHERE 
    $where_clause3
GROUP BY 
    b.customer_segment_name
";

$sqlregion = "SELECT 
        C.customer_segment_name AS segment,
        COUNT(CASE WHEN B.zone_code = '01' THEN A.province_code END) AS 'North',
        COUNT(CASE WHEN B.zone_code = '02' THEN A.province_code END) AS 'Central',
        COUNT(CASE WHEN B.zone_code = '03' THEN A.province_code END) AS 'North_East',
        COUNT(CASE WHEN B.zone_code = '04' THEN A.province_code END) AS 'West',
        COUNT(CASE WHEN B.zone_code = '05' THEN A.province_code END) AS 'East',
        COUNT(CASE WHEN B.zone_code = '06' THEN A.province_code END) AS 'South'
    FROM 
        View_SO_SUM A
    LEFT JOIN 
        ms_province B ON A.province_code = B.province_code
    LEFT JOIN 
        ms_customer_segment C ON A.customer_segment_code = C.customer_segment_code
    WHERE 
        $where_clause3
    GROUP BY 
        C.customer_segment_name
";

// Execute queries
$stmt_appoint = sqlsrv_query($objCon, $sqlappoint, $params);
$stmt_costsheet = sqlsrv_query($objCon, $sqlcostsheet, $params);
$stmt_order = sqlsrv_query($objCon, $sqlorder, $params);
$stmt_revenue = sqlsrv_query($objCon, $sqlrevenue, $params);
$stmt_segment = sqlsrv_query($objCon, $sqlsegment, $params);
$stmt_region = sqlsrv_query($objCon, $sqlregion, $params);


// Error handling for query execution
if ($stmt_costsheet === false) {
  die(print_r(sqlsrv_errors(), true));
}
if ($stmt_revenue === false) {
  die(print_r(sqlsrv_errors(), true));
}
// Fetch data
$appointData = [];
$costSheetData = [];
$orderData = [];
$revenueData = [];
$segmentData = [];
$regionData = [];

// Process the result sets
while ($row = sqlsrv_fetch_array($stmt_appoint, SQLSRV_FETCH_ASSOC)) {
  $appointData[] = $row;
}
while ($row = sqlsrv_fetch_array($stmt_costsheet, SQLSRV_FETCH_ASSOC)) {
  $costSheetData[] = $row;
}
while ($row = sqlsrv_fetch_array($stmt_order, SQLSRV_FETCH_ASSOC)) {
  $orderData[] = $row;
}
while ($row = sqlsrv_fetch_array($stmt_revenue, SQLSRV_FETCH_ASSOC)) {
  $revenueData[] = $row;
}
while ($row = sqlsrv_fetch_array($stmt_segment, SQLSRV_FETCH_ASSOC)) {
  $segmentData[] = $row;
}
while ($row = sqlsrv_fetch_array($stmt_region, SQLSRV_FETCH_ASSOC)) {
  $regionData[] = $row;
}

// Close the database connection
sqlsrv_close($objCon);

// Return the result as JSON
$data = [
  'appointment' => $appointData,
  'costSheets' => $costSheetData,
  'orders' => $orderData,
  'revenue' => $revenueData,
  'segments' => $segmentData,
  'regions' => $regionData
];

header('Content-Type: application/json');
echo json_encode($data); // Where $data is your array or object


