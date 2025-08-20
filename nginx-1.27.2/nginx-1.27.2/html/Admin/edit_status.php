<?php
include_once '../../connectDB/connectDB.php';
$objCon = connectDB();

$timezone = new DateTimeZone('Asia/Bangkok');
$date = new DateTime('now', $timezone);
$record_datetime = $date->format('Y-m-d H:i:s');

$data = $_POST;
$sales = $data['fetch-staff'] ?? '';
$hasChanges = false;

// Fetch user ID for staff
$uidQuery = "SELECT usrid FROM xuser WHERE staff_id LIKE ?";
$uidParams = ["%$sales%"];
$uidStmt = sqlsrv_query($objCon, $uidQuery, $uidParams);
if ($uidStmt === false || !($uidArr = sqlsrv_fetch_array($uidStmt, SQLSRV_FETCH_ASSOC))) {
    die(print_r(sqlsrv_errors(), true));
}
$uid = $uidArr['usrid'];

// Count qt_no entries
$qt_no_count = count(array_filter(array_keys($data), fn($key) => strpos($key, 'qt_no') === 0));

for ($i = 1; $i <= $qt_no_count; $i++) {
    $qt_no = $data["qt_no$i"] ?? null;
    $cs_badge = $data["cs-badge-$i"] ?? null;
    $remark = $data["remark$i"] ?? null;
    $status_badge = $data["status-badge-$i"] ?? null;
    $reason = $data["reason$i"] ?? null;

    if (!$qt_no) continue;

    // Fetch existing data
    $sqlSelect = "SELECT is_prospect, remark, is_tracking, reasoning FROM cost_sheet_head WHERE qt_no = ?";
    $stmtSelect = sqlsrv_query($objCon, $sqlSelect, [$qt_no]);
    if ($stmtSelect === false) die(print_r(sqlsrv_errors(), true));
    $existing = sqlsrv_fetch_array($stmtSelect, SQLSRV_FETCH_ASSOC);

    if (!$existing) continue;

    $dataChanged = (
        ($cs_badge !== null && $cs_badge != $existing['is_prospect']) ||
        ($remark !== null && $remark != $existing['remark']) ||
        ($status_badge !== null && $status_badge != $existing['is_tracking']) ||
        ($reason !== null && $reason != $existing['reasoning'])
    );

    if (!$dataChanged) continue;

    $fields = [];
    $params = [];

    if ($cs_badge !== null) {
        $fields[] = "is_prospect = ?";
        $params[] = $cs_badge;
    }
    if ($remark !== null) {
        $fields[] = "remark = ?";
        $params[] = $remark;
    }
    if ($status_badge !== null) {
        $fields[] = "is_tracking = ?";
        $params[] = $status_badge;
    }
    if ($reason !== null) {
        $fields[] = "reasoning = ?";
        $params[] = $reason;
    }

    $fields[] = "update_date = ?";
    $fields[] = "update_id = ?";
    $params[] = $record_datetime;
    $params[] = $uid;
    $params[] = $qt_no;

    $sql = "UPDATE cost_sheet_head SET " . implode(', ', $fields) . " WHERE qt_no = ?";
    $stmt = sqlsrv_query($objCon, $sql, $params);

    if ($stmt === false) die(print_r(sqlsrv_errors(), true));
    $hasChanges = true;
}

sqlsrv_close($objCon);

$msg = $hasChanges ? "อัพเดทข้อมูลแล้ว" : "ไม่มีข้อมูลที่ถูกอัพเดท";
echo "<script>alert('$msg');window.location='tables-data.html';</script>";
?>
