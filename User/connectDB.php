<?php
function connectDB()
{
    $serverName = "En_Technology_Win2016,55449";
    $userName = "sa";
    $userPassword = "System2560";
    $dbName = "EntechDB";
    
    $connectionInfo = array("Database"=>$dbName, "UID"=>$userName, "PWD"=>$userPassword, "ReturnDatesAsStrings"=>true, "MultipleActiveResultSets"=>true, "CharacterSet"  => 'UTF-8');
    $conn = sqlsrv_connect( $serverName, $connectionInfo);

    return $conn;
}

function date_th($date)
{
    if ($date == '0000-00-00')
        return '-';

    $date_array = explode('-', $date);
    $th_date = $date_array[2] .
        '/' . $date_array[1] . '/' .
        ($date_array[0] + 543);

    return $th_date;
}

function date_en($date)
{
    $date_array = explode('/', $date);
    $en_date = ($date_array[2] - 543) . '-' .
        $date_array[1] . '-' . $date_array[0];
    return $en_date;
}

function randomString($length = 5)
{
    $str = "";
    $characters = array_merge(range('0', '9'));
    $max = count($characters) - 1;
    for ($i = 0; $i < $length; $i++) {
        $rand = mt_rand(0, $max);
        $str .= $characters[$rand];
    }
    return $str;
}
