<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

    $truckConfig = [
        'truckSmall' => [
            'fuelRate' => 35,
            'divisor' => 10,
            'maintanance' => 1,     
        ],
        'truck' => [
            'fuelRate' => 35,
            'divisor' => 2.7,
            'maintanance' => 3.74,   
            ],
            'truckB' => [
            'fuelRate' => 35,
            'divisor' => 2.6,
            'maintanance' => 3.74,   
            ],
                        ];
                            // ส่งข้อมูลเป็น JSON
    header('Content-Type: application/json');
    echo json_encode($truckConfig);
    ?>



