
<?php

// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start a session
session_start();

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Check for connection errors
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Database connection failed: " . $conn->connect_error]));
}

// Handle DELETE requests for chapters
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Parse the raw input
    parse_str(file_get_contents("php://input"), $data);

    $chapter_id_chapter = $data['id_chapter'] ?? null;

    if ($chapter_id_chapter) {
        // Get the photo path before deletion
        $stmt = $conn->prepare("SELECT photo_chapter FROM chapters WHERE id_chapter = ?");
        $stmt->bind_param('i', $chapter_id_chapter);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $photoPath = $row['photo_chapter'];

            // Delete the chapter
            $deleteStmt = $conn->prepare("DELETE FROM chapters WHERE id_chapter = ?");
            $deleteStmt->bind_param('i', $chapter_id_chapter);

            if ($deleteStmt->execute()) {
                // Remove the image file
                if (file_exists($photoPath)) {
                    unlink($photoPath);
                }
                echo json_encode(['success' => true, 'message' => "Chapter deleted successfully."]);
            } else {
                echo json_encode(['success' => false, 'message' => "Failed to delete chapter: " . $deleteStmt->error]);
            }

            $deleteStmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => "Chapter not found."]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => "Invalid_chapter or missing chapter id_chapter."]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid_chapter request method. Only DELETE is allowed."]);
}

// Close the database connection
$conn->close();

?>
