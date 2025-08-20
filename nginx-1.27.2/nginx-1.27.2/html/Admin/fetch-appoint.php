<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../../connectDB/connectDB.php';
$objCon = connectDB(); // Connect to the database

if ($objCon === false) {
    die(json_encode(["error" => sqlsrv_errors()]));
}

$currentYear = date("Y");
$currentMonth = date("m");
$Sales = isset($_GET['Sales']) ? $_GET['Sales'] : NULL;
$year_no = isset($_GET['year_no']) ? $_GET['year_no'] : $currentYear;
$month_no = isset($_GET['month_no']) ? $_GET['month_no'] : $currentMonth;
/*$channel = isset($_GET['channel']) ? $_GET['channel'] : NULL;*/

if($year_no <> 0 && $month_no <> 0 && $Sales == 'N'){
    $sqlappoint = "WITH adjusted_data AS (
    SELECT 
     B.is_status,
    FORMAT(A.appoint_date, 'yyyy-MM-dd') AS format_date,
    FORMAT(B.qt_date, 'yyyy-MM-dd') AS format_qtdate,
    A.customer_name,
    A.appoint_no,
    B.qt_no,
        CASE 
            WHEN Sub.has_both_pre_n_and_y = 1 THEN 'N'
            ELSE B.is_pre
        END AS adjusted_is_pre,
       CASE WHEN B.record_date IS NOT NULL THEN DATEDIFF(DAY, B.record_date, GETDATE())
       ELSE 0 END AS pre_date,
       A.remark,
       A.month_no,
       A.year_no,
       A.staff_id
    FROM appoint_head A
    LEFT JOIN cost_sheet_head B ON A.appoint_no = B.appoint_no
    CROSS APPLY (
        SELECT 
            COUNT(DISTINCT is_pre) AS pre_type_count,
            CASE 
                WHEN COUNT(DISTINCT is_pre) = 2 THEN 1
                ELSE 0
            END AS has_both_pre_n_and_y
        FROM cost_sheet_head B2
        WHERE B2.appoint_no = A.appoint_no
        AND B2.is_status <> 'C'
    ) AS Sub
    WHERE 
       year_no = ?
       AND month_no = ?
        AND A.staff_id <> '1119700041155'
)
SELECT DISTINCT(appoint_no),customer_name,
CASE WHEN qt_no IS NULL THEN '-'
else qt_no END AS qt_no,format_date,format_qtdate,
CASE WHEN adjusted_is_pre = 'y' THEN 'pre quotation'
else '-' END AS status,
CASE WHEN pre_date = 0 THEN '-'
else  pre_date END AS update_time,
remark
FROM adjusted_data
WHERE adjusted_is_pre IS NULL OR adjusted_is_pre = 'Y'
AND is_status <> 'C'
ORDER BY adjusted_data.appoint_no DESC";
                   $params = array($year_no, $month_no);
}else{
    $sqlappoint = "WITH adjusted_data AS (
    SELECT 
     B.is_status,
    FORMAT(A.appoint_date, 'yyyy-MM-dd') AS format_date,
    FORMAT(B.qt_date, 'yyyy-MM-dd') AS format_qtdate,
    A.customer_name,
    A.appoint_no,
    B.qt_no,
        CASE 
            WHEN Sub.has_both_pre_n_and_y = 1 THEN 'N'
            ELSE B.is_pre
        END AS adjusted_is_pre,
       CASE WHEN B.record_date IS NOT NULL THEN DATEDIFF(DAY, B.record_date, GETDATE())
       ELSE 0 END AS pre_date,
       A.remark,
       A.month_no,
       A.year_no,
       A.staff_id
    FROM appoint_head A
    LEFT JOIN cost_sheet_head B ON A.appoint_no = B.appoint_no
    CROSS APPLY (
        SELECT 
            COUNT(DISTINCT is_pre) AS pre_type_count,
            CASE 
                WHEN COUNT(DISTINCT is_pre) = 2 THEN 1
                ELSE 0
            END AS has_both_pre_n_and_y
        FROM cost_sheet_head B2
        WHERE B2.appoint_no = A.appoint_no
        AND B2.is_status <> 'C'
    ) AS Sub
    WHERE 
       year_no = ?
       AND month_no = ?
       AND A.staff_id = ?
        AND A.staff_id <> '1119700041155'
)
SELECT DISTINCT(appoint_no),customer_name,
CASE WHEN qt_no IS NULL THEN '-'
else qt_no END AS qt_no,format_date,format_qtdate,
CASE WHEN adjusted_is_pre = 'y' THEN 'pre quotation'
else '-' END AS status,
CASE WHEN pre_date = 0 THEN '-'
else  pre_date END AS update_time,
remark
FROM adjusted_data
WHERE adjusted_is_pre IS NULL OR adjusted_is_pre = 'Y'
AND is_status <> 'C'
ORDER BY adjusted_data.appoint_no DESC";

                   $params = array($year_no, $month_no, $Sales);
}

$stmt = sqlsrv_query($objCon, $sqlappoint, $params);

if ($stmt === false) {
    die(json_encode(["error" => sqlsrv_errors()]));
}

$tableData = [];
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $tableData[] = $row;
}

$data = [
    'tableData' => $tableData
];

sqlsrv_free_stmt($stmt);
sqlsrv_close($objCon);

header('Content-Type: application/json');
echo json_encode($data);
