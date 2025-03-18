<?php

header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Specify allowed methods
header('Access-Control-Allow-Headers: Content-Type'); // Specify allowed headers
header('Content-Type: application/json');

session_start();

$conn = new mysqli('localhost', 'dramines_drapp', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    header('Content-Type: application/json');

    $sql = "SELECT * FROM userlogs";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $userlogs = [];
        while ($row = $result->fetch_assoc()) {
            $userlogs[] = $row;
        }
        echo json_encode(['success' => true, 'userlogs' => $userlogs]);
    } else {
        echo json_encode(['success' => false, 'message' => "No users found."]);
    }
}
?>
