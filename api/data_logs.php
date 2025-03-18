<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');


session_start();

// Define a custom log file
$logFile = __DIR__ . '/error_log.txt';

// Function to log errors to the custom log file
function logError($message) {
    global $logFile;
    error_log(date('[Y-m-d H:i:s] ') . $message . PHP_EOL, 3, $logFile);
}

// Database connection
$conn = new mysqli('localhost', 'dramines_drapp', '123123123', 'dramines_drapp');
if ($conn->connect_error) {
    logError("Database Connection Error: " . $conn->connect_error);
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle POST request to insert log
    $data = json_decode(file_get_contents('php://input'), true);

    $id_log = $data['id_log'];
    $text_log = $data['text_log'];
    $date_log = $data['date_log'];
    $user_log = $data['user_log'];
    $type_log = $data['type_log'];

    $stmt = $conn->prepare("INSERT INTO logs (id_log, text_log, date_log, user_log, type_log) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        logError("Statement Preparation Failed: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Internal server error"]);
        exit;
    }
    
    $stmt->bind_param("issss", $id_log, $text_log, $date_log, $user_log, $type_log);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Log inserted successfully"]);
    } else {
        logError("Statement Execution Error: " . $stmt->error);
        echo json_encode(["success" => false, "message" => "Error inserting log"]);
    }
    $stmt->close();

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle GET request to fetch logs with pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;

    $result = $conn->query("SELECT * FROM logs LIMIT $limit OFFSET $offset");

    if ($result) {
        if ($result->num_rows > 0) {
            $logs = [];
            while ($row = $result->fetch_assoc()) {
                $logs[] = $row;
            }
            echo json_encode(["success" => true, "data" => $logs]);
        } else {
            echo json_encode(["success" => false, "message" => "No logs found"]);
        }
    } else {
        logError("Query Error: " . $conn->error);
        echo json_encode(["success" => false, "message" => "Error fetching logs"]);
    }
}

// Close the database connection
$conn->close();
?>
