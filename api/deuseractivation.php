<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

session_start();

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Database connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['user_id']) || !isset($data['key'])) {
        die(json_encode(['success' => false, 'message' => "Missing 'user_id' or 'key' parameter"]));
    }

    $user_id = $conn->real_escape_string($data['user_id']);
    $key = $conn->real_escape_string($data['key']);

    if (strpos($key, '38457') === 0) {
        $stmt = $conn->prepare("UPDATE client SET user_key = ?, status_client = '0' WHERE id_client = ?");
        $stmt->bind_param("si", $key, $user_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => "User activated successfully."]);
        } else {
            echo json_encode(['success' => false, 'message' => "Error activating user: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => "Not authorized."]);
    }
}

$conn->close();
?>
