<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../../../connectDB/connectDB.php';
$objCon = connectDB();

if ($objCon === false) {
	die(json_encode(["error" => sqlsrv_errors()]));
}

$currentYear = date("Y");
$currentMonth = date("m");
$year_no = $_GET['year_no'] ?? $currentYear;
$month_no = $_GET['month_no'] ?? $currentMonth;

$params = [];
if ($year_no != 0 && $month_no == 0) {
	$whereYear = "YEAR(A.repair_date) = ?";
	$params = [$year_no];
} else {
	$whereYear = "YEAR(A.repair_date) = ? AND MONTH(A.repair_date) = ?";
	$params = [$year_no, $month_no];
}

$sqlbox = "
	WITH MA AS (
		SELECT 
			CASE WHEN container_type_code != '00' THEN COUNT(A.container_type_code) END AS CT,
			CASE WHEN container_type_code != '00' THEN SUM(COALESCE(A.total_before_vat, 0) + COALESCE(brw_summary.stock_amount, 0)) END AS ct_amount,
			CASE WHEN container_type_code = '00' AND vehicle_code IS NOT NULL AND vehicle_code NOT IN ('ญฐ3356','ฆฒ 8571','ฌถ-7644','ณย 9130','ฌถ 9061','บธ 1608','ณค 3475') THEN COUNT(vehicle_code) END AS TP,
			CASE WHEN container_type_code = '00' AND vehicle_code IS NOT NULL AND vehicle_code NOT IN ('ญฐ3356','ฆฒ 8571','ฌถ-7644','ณย 9130','ฌถ 9061','บธ 1608','ณค 3475') THEN SUM(COALESCE(A.total_before_vat, 0) + COALESCE(brw_summary.stock_amount, 0)) END AS tp_amount,
			CASE WHEN container_type_code = '00' AND vehicle_code IS NOT NULL AND vehicle_code IN ('ญฐ3356','ฆฒ 8571','ฌถ-7644','ณย 9130','ฌถ 9061') THEN COUNT(vehicle_code) END AS OC,
			CASE WHEN container_type_code = '00' AND vehicle_code IS NOT NULL AND vehicle_code IN ('ญฐ3356','ฆฒ 8571','ฌถ-7644','ณย 9130','ฌถ 9061') THEN SUM(COALESCE(A.total_before_vat, 0) + COALESCE(brw_summary.stock_amount, 0)) END AS oc_amount,
			CASE WHEN container_type_code = '00' AND vehicle_code IS NOT NULL AND vehicle_code IN ('บธ 1608','ณค 3475') THEN COUNT(vehicle_code) END AS CL,
			CASE WHEN container_type_code = '00' AND vehicle_code IS NOT NULL AND vehicle_code IN ('บธ 1608','ณค 3475') THEN SUM(COALESCE(A.total_before_vat, 0) + COALESCE(brw_summary.stock_amount, 0)) END AS cl_amount
		FROM repair_head A
		LEFT JOIN ms_repair_type msr ON A.repair_type_code = msr.repair_type_code
		LEFT JOIN (
			SELECT A.repair_no, SUM(B.total_amount) AS stock_amount
			FROM brw_head A
			LEFT JOIN brw_detail B ON A.brw_no = B.brw_no
			WHERE A.is_status <> 'C' AND A.stock_code IN ('02', '06')
			GROUP BY A.repair_no
		) brw_summary ON A.repair_no = brw_summary.repair_no
		WHERE A.is_status <> 'C' AND $whereYear
		GROUP BY A.vehicle_code, container_type_code, container_code
	)
	SELECT 
		SUM(CT) AS CT,
		SUM(ct_amount) AS ct_amount,
		SUM(TP) AS TP,
		SUM(tp_amount) AS tp_amount,
		SUM(OC) AS OC,
		SUM(oc_amount) AS oc_amount,
		SUM(CL) AS CL,
		SUM(cl_amount) AS cl_amount
	FROM MA
";

$sqlvehicle = "
	SELECT 
		FORMAT(A.repair_date, 'yyyy-MM') AS format_date, 
		COUNT(A.total_before_vat) AS vehicle_code, 
		SUM(COALESCE(pr_summary.pr_amount, 0)) AS pr_amount, 
		SUM(COALESCE(brw_summary.stock_amount, 0)) AS stock_amount,
		SUM(COALESCE(pr_summary.pr_amount, 0) + COALESCE(brw_summary.stock_amount, 0)) AS total_amount
	FROM repair_head A
	LEFT JOIN (
		SELECT repair_no, SUM(B.total_amount) AS pr_amount
		FROM pr_head A
		LEFT JOIN pr_detail B ON A.pr_no = B.pr_no
		WHERE A.is_status <> 'C'
		GROUP BY A.repair_no
	) pr_summary ON A.repair_no = pr_summary.repair_no
	LEFT JOIN (
		SELECT A.repair_no, SUM(B.total_amount) AS stock_amount
		FROM brw_head A
		LEFT JOIN brw_detail B ON A.brw_no = B.brw_no
		WHERE A.is_status <> 'C' AND A.stock_code IN ('02', '06')
		GROUP BY A.repair_no
	) brw_summary ON A.repair_no = brw_summary.repair_no
	WHERE A.is_status <> 'C' AND $whereYear AND vehicle_code IS NOT NULL
	GROUP BY FORMAT(A.repair_date, 'yyyy-MM')
";

$sqlgraphpie = "
	WITH MA AS (
		SELECT 
			CASE WHEN A.repair_type_code = '000' THEN 'Container'
				 ELSE msr.repair_type_name END AS repair_name,
			SUM(COALESCE(A.total_before_vat, 0) + COALESCE(brw_summary.stock_amount, 0)) AS total_amount
		FROM repair_head A
		LEFT JOIN ms_repair_type msr ON A.repair_type_code = msr.repair_type_code
		LEFT JOIN (
			SELECT A.repair_no, SUM(B.total_amount) AS stock_amount
			FROM brw_head A
			LEFT JOIN brw_detail B ON A.brw_no = B.brw_no
			WHERE A.is_status <> 'C' AND A.stock_code IN ('02', '06')
			GROUP BY A.repair_no
		) brw_summary ON A.repair_no = brw_summary.repair_no
		WHERE A.is_status <> 'C' AND $whereYear
		GROUP BY A.repair_type_code, msr.repair_type_name
	)
	SELECT * FROM MA
	ORDER BY total_amount DESC
";

$sqlgraph = "
	SELECT 
		FORMAT(A.repair_date, 'MMM') AS format_date, 
		MONTH(A.repair_date) AS month_number,
		SUM(CASE 
			WHEN A.repair_type_code NOT IN ('001', '002') AND A.vehicle_code IS NOT NULL 
			THEN COALESCE(A.total_before_vat, 0) + COALESCE(brw_summary.stock_amount, 0)
			ELSE 0 
		END) AS total_amount1,
		SUM(COALESCE(A.total_before_vat, 0) + COALESCE(brw_summary.stock_amount, 0)) AS total_amount,
		'160000.0000' AS target_ma
	FROM repair_head A
	LEFT JOIN (
		SELECT A.repair_no, SUM(B.total_amount) AS stock_amount
		FROM brw_head A
		LEFT JOIN brw_detail B ON A.brw_no = B.brw_no
		WHERE A.is_status <> 'C' AND A.stock_code IN ('02', '06')
		GROUP BY A.repair_no
	) brw_summary ON A.repair_no = brw_summary.repair_no
	WHERE A.is_status <> 'C' AND YEAR(A.repair_date) = 2025
	GROUP BY FORMAT(A.repair_date, 'MMM'), MONTH(A.repair_date)
	ORDER BY month_number
";

// Helper function to execute query and fetch all results
function fetchAll($conn, $sql, $params = []) {
	$stmt = sqlsrv_query($conn, $sql, $params);
	if ($stmt === false) {
		error_log(print_r(sqlsrv_errors(), true));
		http_response_code(500);
		echo json_encode(["error" => "Failed to execute query"]);
		exit;
	}
	$data = [];
	while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
		$data[] = $row;
	}
	sqlsrv_free_stmt($stmt);
	return $data;
}

$boxData = fetchAll($objCon, $sqlbox, $params);
$vehicleData = fetchAll($objCon, $sqlvehicle, $params);
$graphData = fetchAll($objCon, $sqlgraph);
$graphpieData = fetchAll($objCon, $sqlgraphpie, $params);

sqlsrv_close($objCon);

header('Content-Type: application/json');
echo json_encode([
	'boxData' => $boxData,
	'vehicleData' => $vehicleData,
	'graphData' => $graphData,
	'graphpieData' => $graphpieData
]);
?>
