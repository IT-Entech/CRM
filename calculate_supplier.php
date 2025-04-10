<?php
include_once '../connectDB/connectDB.php';
$objCon = connectDB();

if ($objCon === false) {
    error_log("Database connection failed: " . print_r(sqlsrv_errors(), true)); 
    die(json_encode(['error' => 'Database connection failed.']));
}

// Get the wastename from the POST request
$wastecode = isset($_POST['waste_code']) ? $_POST['waste_code'] : '';

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
SELECT  A.waste_code, MAX(B.waste_name) AS waste_name,
eliminate_code,
cost_rate,
A.supplier_code,
A.supplier_account_no,
CASE 
    WHEN A.supplier_account_no = 0 THEN (SELECT supplier_name FROM ms_supplier Z WHERE A.supplier_code = Z.supplier_code)
    ELSE (SELECT supplier_name FROM ms_supplier_account Z WHERE A.supplier_code = Z.supplier_code AND A.supplier_account_no = Z.seq)
    END AS supplier_name ,
latitude,
longitude
FROM Datadisposal A
LEFT JOIN ms_waste B ON A.waste_code = B.waste_code
LEFT JOIN supplier_coordinate C ON A.supplier_code = C.supplier_code AND A.supplier_account_no = C.supplier_account_no
WHERE RowNum = 1 
AND A.waste_code = ?
GROUP BY A.waste_code, eliminate_code,cost_rate,
A.supplier_code,
A.supplier_account_no,
latitude,
longitude
ORDER BY cost_rate ASC;";

$params = array($wastecode);
$stmt = sqlsrv_query($objCon, $sql, $params);

if ($stmt === false) {
    error_log("SQL query failed: " . print_r(sqlsrv_errors(), true));
    die(json_encode(['error' => 'SQL query failed.']));
}



$result = [];

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $result[] = [
        'waste_code' => $row['waste_code'],
        'waste_name' => $row['waste_name'],
        'eliminate_code' => $row['eliminate_code'],
        'cost_rate' => $row['cost_rate'],
        'supplier_code' => $row['supplier_code'],
        'supplier_account_no' => $row['supplier_account_no'],
        'supplier_name' => $row['supplier_name'],
        'latitude' => $row['latitude'],
        'longitude' => $row['longitude']
    ];
}

// Return JSON response
echo json_encode([
    'details' => $result
]);

// Cleanup
sqlsrv_free_stmt($stmt);
sqlsrv_close($objCon);

