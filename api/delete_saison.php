
<?php

// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
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

// Set MySQL connection character set to UTF-8
$conn->set_charset('utf8mb4');

// Handle DELETE requests for saisons
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Parse the raw input
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    // If JSON parsing fails, try to parse as form data
    if (!$data) {
        parse_str($input, $data);
    }

    $saison_id = $data['id_saison'] ?? null;

    if (!$saison_id && isset($data['data']) && isset($data['data']['id_saison'])) {
        $saison_id = $data['data']['id_saison'];
    }

    if ($saison_id) {
        // First, delete all chapters related to this saison
        // Get all chapters for this saison
        $chaptersStmt = $conn->prepare("SELECT id_chapter, photo_chapter FROM chapters WHERE id_saison = ?");
        $chaptersStmt->bind_param('s', $saison_id);
        $chaptersStmt->execute();
        $chaptersResult = $chaptersStmt->get_result();
        
        while ($chapter = $chaptersResult->fetch_assoc()) {
            // Delete all sous-chapters for this chapter
            $sousChaptersStmt = $conn->prepare("SELECT id_souschapter, image_url FROM souschapters WHERE id_chapter = ?");
            $sousChaptersStmt->bind_param('s', $chapter['id_chapter']);
            $sousChaptersStmt->execute();
            $sousChaptersResult = $sousChaptersStmt->get_result();
            
            while ($sousChapter = $sousChaptersResult->fetch_assoc()) {
                // Delete the sous-chapter image if it exists
                if (!empty($sousChapter['image_url']) && file_exists($sousChapter['image_url'])) {
                    unlink($sousChapter['image_url']);
                }
                
                // Delete the sous-chapter record
                $deleteSousChapterStmt = $conn->prepare("DELETE FROM souschapters WHERE id_souschapter = ?");
                $deleteSousChapterStmt->bind_param('s', $sousChapter['id_souschapter']);
                $deleteSousChapterStmt->execute();
                $deleteSousChapterStmt->close();
            }
            $sousChaptersStmt->close();
            
            // Delete the chapter image if it exists
            if (!empty($chapter['photo_chapter']) && file_exists($chapter['photo_chapter'])) {
                unlink($chapter['photo_chapter']);
            }
            
            // Delete the chapter record
            $deleteChapterStmt = $conn->prepare("DELETE FROM chapters WHERE id_chapter = ?");
            $deleteChapterStmt->bind_param('s', $chapter['id_chapter']);
            $deleteChapterStmt->execute();
            $deleteChapterStmt->close();
        }
        $chaptersStmt->close();
        
        // Get the photo path before deletion
        $stmt = $conn->prepare("SELECT photo_saison FROM saisons WHERE id_saison = ?");
        $stmt->bind_param('s', $saison_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $photoPath = $row['photo_saison'];

            // Delete the saison
            $deleteStmt = $conn->prepare("DELETE FROM saisons WHERE id_saison = ?");
            $deleteStmt->bind_param('s', $saison_id);

            if ($deleteStmt->execute()) {
                // Remove the image file if it exists
                if (!empty($photoPath) && file_exists($photoPath)) {
                    unlink($photoPath);
                }
                
                // Also delete all user permissions related to this saison
                $deletePermissionsStmt = $conn->prepare("DELETE FROM user_saison_permissions WHERE id_saison = ?");
                $deletePermissionsStmt->bind_param('s', $saison_id);
                $deletePermissionsStmt->execute();
                $deletePermissionsStmt->close();
                
                echo json_encode(['success' => true, 'message' => "Saison deleted successfully."]);
            } else {
                echo json_encode(['success' => false, 'message' => "Failed to delete saison: " . $deleteStmt->error]);
            }

            $deleteStmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => "Saison not found."]);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => "Invalid or missing saison ID."]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid request method. Only DELETE is allowed."]);
}

// Close the database connection
$conn->close();

?>
