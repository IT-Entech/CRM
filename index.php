<?php 
include('../header.php');

$name = isset($name) ? htmlspecialchars($name) : '';
$staff = isset($staff) ? htmlspecialchars($staff) : 0;
$level = isset($level) ? htmlspecialchars($level) : 0;
$Role = isset($role) ? htmlspecialchars($role) : '';

if ( $level >= 2) {
	header('Location: ' . $uri . '/CRM/Admin/');
	exit;
} elseif ( $level == 1) {
	header('Location: ' . $uri . '/CRM/User/');
	exit;
} else{
	echo '<script>alert("Cannot enter this site");window.location="/pages-login.html";</script>';
	exit;
}
?>
