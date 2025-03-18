<?php
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Specify allowed methods
header('Access-Control-Allow-Headers: Content-Type'); // Specify allowed headers
header('Content-Type: application/json; charset=UTF-8'); // Specify UTF-8 encoding for JSON response

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Set character set to utf8mb4 for full Unicode support
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if (isset($_GET['key'])) {
    $key = $_GET['key'];
    $cat_video = isset($_GET['cat_video']) ? $_GET['cat_video'] : '';

    if (strpos($key, '38457') === 0) {
        // Check if cat_video is provided and not empty
        if (!empty($cat_video)) {
            $sql = "SELECT * FROM Videos WHERE cat_video = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $cat_video);
        } else {
            $sql = "SELECT * FROM Videos LIMIT 10";
            $stmt = $conn->prepare($sql);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $videos = [];
            while ($row = $result->fetch_assoc()) {
                $videos[] = $row;
            }
            echo json_encode(['success' => true, 'data' => $videos], JSON_UNESCAPED_UNICODE); // Use JSON_UNESCAPED_UNICODE to return raw Unicode
        } else {
            echo json_encode(['success' => false, 'message' => 'No videos found.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Not Authorized.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Key parameter is required.']);
}

$conn->close();
?>
