<?php
header('Content-Type: application/json; charset=utf-8');
include_once '../connectDB/connectDB.php';
$objCon = connectDB();

if ($objCon === false) {
    error_log("Database connection failed: " . print_r(sqlsrv_errors(), true)); 
    die(json_encode(['error' => 'Database connection failed.']));
}

// Get the wastename from the POST request
$segment = isset($_POST['segment']) ? $_POST['segment'] : '';
$wastecode = isset($_POST['waste_code']) ? $_POST['waste_code'] : '';
if (empty($wastecode)) {
    echo json_encode(['error' => 'Missing required parameter: waste_code']);
    exit;
}

if (empty($segment)) {
    echo json_encode(['error' => 'Missing required parameter: segment']);
    exit;
}

// Define the query with a single CTE
$sql = "WITH disposal_cost AS(
SELECT 
    waste_other.waste_code,
    waste_other.waste_name,
    waste_other.supplier_code,
    waste_other.supplier_account_no,
    ROUND(AVG(waste_other.cost_rate), 0) AS avg_disposal_cost,
    waste_other.customer_segment_code,
    waste_other.eliminate_code
FROM (
      SELECT 
        B.cost_rate,
        B.waste_code,
        B.waste_name,
        D.supplier_code,
        D.supplier_account_no,
        D.eliminate_code,
        C.customer_segment_code
    FROM grqt_detail A 
    LEFT JOIN grqt_detail_product B ON A.gr_no = B.gr_no
    LEFT JOIN order_head C ON B.order_no = C.order_no
    LEFT JOIN order_detail D ON D.order_no = C.order_no
    WHERE YEAR(C.shipment_date) = 2025 
    AND MONTH(C.shipment_date) <= 4
      AND B.waste_code LIKE '%-S%'
      AND B.waste_code <> '000000-S'
      AND D.eliminate_code IS NOT NULL
       AND D.eliminate_code <> ''
) AS waste_other
GROUP BY 
    waste_other.waste_code,
    waste_other.waste_name,
    waste_other.supplier_code,
    waste_other.supplier_account_no,
    waste_other.customer_segment_code,
    waste_other.eliminate_code


UNION ALL

SELECT 
    waste_gp.waste_code,
    waste_gp.waste_name,
    waste_gp.supplier_code,
    waste_gp.supplier_account_no,
    ROUND(AVG(waste_gp.cost_rate_cost), 0) AS avg_disposal_cost,
    waste_gp.customer_segment_code,
    waste_gp.eliminate_code
FROM (
    SELECT
        B.cost_rate_cost,
        A.waste_code,
        A.waste_name,
        B.supplier_code,
        B.supplier_account_no,
        C.customer_segment_code,
        B.eliminate_code
    FROM View_waste_weight_sortout_gp A 
    INNER JOIN order_detail B ON B.order_no = A.order_no
    INNER JOIN order_head C ON B.order_no = C.order_no
    WHERE YEAR([วันที่ขน]) = 2025
     AND MONTH([วันที่ขน]) <= 4
      AND B.cost_rate_cost <> 0
      AND A.waste_code <> '000000-S'
) AS waste_gp
GROUP BY 
    waste_gp.waste_code,
    waste_gp.waste_name,
    waste_gp.supplier_code,
    waste_gp.supplier_account_no,
    waste_gp.customer_segment_code,
    waste_gp.eliminate_code


UNION ALL

SELECT 
    waste_fc.waste_code,
    waste_fc.waste_name,
    waste_fc.supplier_code,
    waste_fc.supplier_account_no,
    ROUND(AVG(waste_fc.cost_rate_cost), 0) AS avg_disposal_cost,
    waste_fc.customer_segment_code,
    waste_fc.eliminate_code
FROM (
 SELECT
B.cost_rate_cost,
A.waste_code,
A.waste_name,
B.supplier_code,
B.supplier_account_no,
D.customer_segment_code,
B.eliminate_code
FROM fc_send_despose_detail A
INNER JOIN order_detail B ON B.order_no = A.order_no
LEFT JOIN fc_send_despose_head C ON A.fsd_no = C.fsd_no
INNER JOIN order_head D ON B.order_no = D.order_no
WHERE YEAR(A.shipment_date) = 2025
 AND MONTH(A.shipment_date) <= 4
AND C.is_status = 'A'
AND A.is_pono ='Y'
AND A.waste_code <> '000000-S'
AND B.cost_rate_cost <> 0
) AS waste_fc
GROUP BY 
    waste_fc.waste_code,
    waste_fc.waste_name,
    waste_fc.supplier_code,
    waste_fc.supplier_account_no,
    waste_fc.customer_segment_code,
    waste_fc.eliminate_code
)
SELECT
A.waste_code,
A.eliminate_code,
A.customer_segment_code,
CASE 
    WHEN ROUND(AVG(A.avg_disposal_cost), 0) % 10 < 5 
        THEN ROUND(AVG(A.avg_disposal_cost) - (AVG(A.avg_disposal_cost) % 10), 0)
    ELSE ROUND(AVG(A.avg_disposal_cost), 0)
END AS cost_rate,
A.supplier_code,
A.supplier_account_no,
    CASE 
        WHEN A.supplier_account_no = 0 THEN B.supplier_name
        ELSE B.supplier_name
    END AS supplier_name,
D.latitude,
D.longitude,
ROW_NUMBER() OVER (PARTITION BY A.waste_code, A.eliminate_code,A.supplier_code ORDER BY A.supplier_code ASC) AS RowNum
FROM disposal_cost A
LEFT JOIN ms_supplier B 
    ON A.supplier_code = B.supplier_code
LEFT JOIN ms_supplier_account C 
    ON A.supplier_code = C.supplier_code 
    AND A.supplier_account_no = C.seq
LEFT JOIN supplier_coordinate D ON A.supplier_code = D.supplier_code AND A.supplier_account_no = D.supplier_account_no
WHERE waste_code = ?
AND customer_segment_code = ?
GROUP BY A.waste_code, 
A.customer_segment_code,
eliminate_code,
A.supplier_code,
A.supplier_account_no,
D.latitude,
D.longitude,
B.supplier_name
ORDER BY cost_rate ASC;";

$params = array($wastecode,$segment);
$stmt = sqlsrv_query($objCon, $sql, $params);

if ($stmt === false) {
    error_log("SQL query failed: " . print_r(sqlsrv_errors(), true));
    http_response_code(500);
    echo json_encode(['error' => 'SQL query execution failed.']);
    exit;
}



$result = [];

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $result[] = [
        'waste_code' => $row['waste_code'],
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

