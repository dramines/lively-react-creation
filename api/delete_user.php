<?php
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Specify allowed methods
header('Access-Control-Allow-Headers: Content-Type'); // Specify allowed headers
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['key']) && isset($input['id_client'])) {
        $key = $input['key'];
        $id_client = $input['id_client'];

        if (strpos($key, '38457') === 0) {
            // Prepare the SQL statement to prevent SQL injection
            $stmt = $conn->prepare("DELETE FROM client WHERE id_client = ?");
            $stmt->bind_param("i", $id_client); // 'i' indicates the variable is an integer

            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(['success' => true, 'message' => 'Video deleted successfully.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'No video found with the given ID.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Error executing query.']);
            }

            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Not Authorized.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Key and video ID are required.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Only POST method is allowed.']);
}

$conn->close();
?>
