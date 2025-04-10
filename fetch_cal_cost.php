<?php
include_once '../connectDB/connectDB.php';
$objCon = connectDB();

if ($objCon === false) {
    error_log("Database connection failed: " . print_r(sqlsrv_errors(), true)); 
    die(json_encode(['error' => 'Database connection failed.']));
}

// Get the wastename from the POST request
$wastename = isset($_POST['waste_name']) ? $_POST['waste_name'] : '';
$search = "%" . $wastename . "%";

// Define the query with a single CTE
$sql = "WITH Datadisposal AS (
            SELECT 
                A.qt_no,
                B.qt_date,
                A.customer_code,
                B.customer_name,
                A.waste_code,
                A.waste_name,
                A.cost_rate,
                A.eliminate_code,
                A.supplier_code,
                A.supplier_account_no,
                ROW_NUMBER() OVER (PARTITION BY A.waste_code, A.supplier_code ORDER BY B.qt_date DESC, A.supplier_code ASC) AS RowNum
            FROM cost_sheet_detail A
            LEFT JOIN cost_sheet_head B ON A.qt_no = B.qt_no
            LEFT JOIN customer_type_2025 C ON A.customer_code = C.customer_code
            WHERE A.cost_code = '51100'
                AND YEAR(B.qt_date) >= 2024
                AND A.unit_code = '01'
                AND A.waste_code NOT IN ('000000-S', '', '000002-S')
                AND A.waste_code LIKE '%-S%'
                AND YEAR(C.shipment_date) >= 2025
                AND EXISTS (SELECT 1 FROM so_detail S WHERE S.qt_no = A.qt_no)
        )
SELECT A.waste_code, MAX(B.waste_name) AS waste_name
FROM Datadisposal A
LEFT JOIN ms_waste B ON A.waste_code = B.waste_code
WHERE RowNum = 1 
AND A.waste_name LIKE ?
GROUP BY A.waste_code
ORDER BY A.waste_code ASC;";


$params = array($search);
$stmt = sqlsrv_query($objCon, $sql, $params);

if ($stmt === false) {
    error_log("SQL query failed: " . print_r(sqlsrv_errors(), true));
    die(json_encode(['error' => 'SQL query failed.']));
}



$result = [];

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $result[] = [
        'waste_code' => $row['waste_code'],
        'waste_name' => $row['waste_name']
    ];
}

// Return JSON response
echo json_encode([
    'waste_codes' => $result
]);

// Cleanup
sqlsrv_free_stmt($stmt);
sqlsrv_close($objCon);

