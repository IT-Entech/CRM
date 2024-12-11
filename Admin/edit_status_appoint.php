<?php
include_once '../../connectDB/connectDB.php';
$objCon = connectDB();

$timezone = new DateTimeZone('Asia/Bangkok'); // Setting the timezone
$date = new DateTime('now', $timezone);
$record_datetime = $date->format('Y-m-d H:i:s'); // Current date and time

$data = $_POST;
$sales = $data['staff'];
print_r($data);
// Fetch the user ID associated with the staff
$uidQuery = "SELECT usrid FROM xuser WHERE staff_id LIKE ?";
$uidParams = ["%$sales%"];
$uidStmt = sqlsrv_query($objCon, $uidQuery, $uidParams);
if ($uidStmt === false || !($uid = sqlsrv_fetch_array($uidStmt, SQLSRV_FETCH_ASSOC))) {
    die(print_r(sqlsrv_errors(), true));
}
$uid = $uid['usrid'];
$appoint_no_count = count(array_filter(array_keys($data), function($key) {
    return strpos($key, 'appoint_no') === 0;
}));
// Loop over the qt_no entries
for ($i = 1; $i <= $appoint_no_count; $i++) {
    $appoint_no = $data["appoint_no$i"] ?? null;
    $status = $data["status$i"] ?? null;
    $remark = $data["remark$i"] ?? null;
echo $appoint_no;
    if ($appoint_no) {
        // Fetch existing data for comparison
        $sqlSelect = "SELECT is_status, remark FROM appoint_head WHERE appoint_no = ?";
        $stmtSelect = sqlsrv_query($objCon, $sqlSelect, [$appoint_no]);

        if ($stmtSelect === false) {
            die(print_r(sqlsrv_errors(), true));
        }

        $existingData = sqlsrv_fetch_array($stmtSelect, SQLSRV_FETCH_ASSOC);
        $dataChanged = false;

        if ($existingData) {
            $dataChanged = (
                ($status !== null && $status != $existingData['is_status']) ||
                ($remark !== null && $remark != $existingData['remark'])
            );
        }

        // Only perform update if data has changed
        
        if ($dataChanged) {
            $sql = "UPDATE appoint_head SET ";
            $params = [];

            if ($status !== null) {
                $sql .= "is_status = ?, ";
                $params[] = $status;
            }

            if ($remark !== null) {
                $sql .= "remark = ?, ";
                $params[] = $remark;
            }

            // Always update the date and user ID
            $sql .= "update_date = ?, update_id = ? WHERE appoint_no = ?";
            $params[] = $record_datetime;
            $params[] = $uid;
            $params[] = $appoint_no;

            // Execute the query
            $stmt = sqlsrv_query($objCon, $sql, $params);

            if ($stmt === false) {
                die(print_r(sqlsrv_errors(), true));
            } else {
                echo '<script>alert("อัพเดทข้อมูลแล้ว");window.location="tables-appoint.php";</script>';
            }
        }
    }
}

sqlsrv_close($objCon);

