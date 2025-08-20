<?php
include_once '../../../connectDB/connectDB.php';
$objCon = connectDB();

$timezone = new DateTimeZone('Asia/Bangkok');
$date = new DateTime('now', $timezone);
$record_datetime = $date->format('Y-m-d H:i:s');

$data = $_POST;

// Count how many 'id' fields are present
$id_no_count = count(array_filter(array_keys($data), fn($key) => strpos($key, 'id') === 0));

for ($i = 1; $i <= $id_no_count; $i++) {
    $id    = $data["id$i"] ?? null;
    $active = $data["active$i"] ?? null;
    $level  = $data["level$i"] ?? null;
    $role   = $data["Role$i"] ?? null;

    if ($id === null) {
        continue;
    }

    $sql = "UPDATE a_user SET level = ?, Role = ?, active = ? WHERE id = ?";
    $params = [$level, $role, $active, $id];
    $stmt = sqlsrv_query($objCon, $sql, $params);

    if ($stmt === false) {
        die(print_r(sqlsrv_errors(), true));
    }
}

echo '<script>alert("แก้ไขสิทธิ์แล้ว");window.location="index.html";</script>';
sqlsrv_close($objCon);
