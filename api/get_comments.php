
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Prevent any PHP notices or warnings from breaking JSON output
error_reporting(E_ERROR);
ini_set('display_errors', 0);

// Database connection
try {
    $conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Set charset for proper handling of Arabic characters
    $conn->set_charset('utf8mb4');

    // Get comments for specific saison
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $id_saison = isset($_GET['id_saison']) ? intval($_GET['id_saison']) : -1;
        
        // Changed validation to allow 0 as a valid saison ID
        if ($id_saison < 0) {
            echo json_encode(["success" => false, "message" => "Invalid saison ID."]);
            exit;
        }
        
        try {
            // Calculate average rating for this saison
            $avgRatingSql = "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
                              FROM comments 
                              WHERE id_saison = ?";
            $avgRatingStmt = $conn->prepare($avgRatingSql);
            $avgRatingStmt->bind_param("i", $id_saison);
            $avgRatingStmt->execute();
            $avgRatingResult = $avgRatingStmt->get_result();
            $ratingData = $avgRatingResult->fetch_assoc();
            
            // Modified query to only use the comments table without JOIN
            $sql = "SELECT c.id_comment, c.id_saison, c.id_client, c.user_name, c.comment_text, c.rating, c.created_at 
                    FROM comments c
                    WHERE c.id_saison = ? 
                    ORDER BY c.created_at DESC";
            
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id_saison);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $comments = [];
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    // Add id_user field for backward compatibility with the frontend
                    $row['id_user'] = $row['id_client'];
                    // Add date_created field for backward compatibility with the frontend
                    $row['date_created'] = $row['created_at'];
                    $comments[] = $row;
                }
                
                // Get saison info separately - using name_saison instead of title_saison
                $saisonSql = "SELECT name_saison, photo_saison FROM saisons WHERE id_saison = ?";
                $saisonStmt = $conn->prepare($saisonSql);
                $saisonStmt->bind_param("i", $id_saison);
                $saisonStmt->execute();
                $saisonResult = $saisonStmt->get_result();
                
                if ($saisonResult->num_rows > 0) {
                    $saisonInfo = $saisonResult->fetch_assoc();
                    echo json_encode([
                        "success" => true, 
                        "comments" => $comments, 
                        "saison_info" => [
                            "title" => $saisonInfo['name_saison'],
                            "photo" => $saisonInfo['photo_saison']
                        ],
                        "rating_info" => [
                            "average" => round($ratingData['avg_rating'], 1),
                            "total" => $ratingData['total_reviews']
                        ]
                    ]);
                } else {
                    echo json_encode([
                        "success" => true, 
                        "comments" => $comments,
                        "saison_info" => [
                            "title" => "غير معروف",
                            "photo" => ""
                        ],
                        "rating_info" => [
                            "average" => round($ratingData['avg_rating'], 1),
                            "total" => $ratingData['total_reviews']
                        ]
                    ]);
                }
            } else {
                // If no comments, still get the saison info - using name_saison instead of title_saison
                $saisonSql = "SELECT name_saison, photo_saison FROM saisons WHERE id_saison = ?";
                $saisonStmt = $conn->prepare($saisonSql);
                $saisonStmt->bind_param("i", $id_saison);
                $saisonStmt->execute();
                $saisonResult = $saisonStmt->get_result();
                
                if ($saisonResult->num_rows > 0) {
                    $saisonInfo = $saisonResult->fetch_assoc();
                    echo json_encode([
                        "success" => true, 
                        "comments" => [], 
                        "saison_info" => [
                            "title" => $saisonInfo['name_saison'],
                            "photo" => $saisonInfo['photo_saison']
                        ],
                        "rating_info" => [
                            "average" => 0,
                            "total" => 0
                        ]
                    ]);
                } else {
                    echo json_encode(["success" => false, "message" => "Saison not found."]);
                }
            }
        } catch (Exception $e) {
            // Log the error to a file for debugging
            error_log('Error in get_comments.php: ' . $e->getMessage());
            // Return error JSON
            echo json_encode(["success" => false, "message" => "Server error occurred: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid request method."]);
    }
} catch (Exception $e) {
    // Log the error to a file for debugging
    error_log('Error in get_comments.php: ' . $e->getMessage());
    // Return error JSON
    echo json_encode(["success" => false, "message" => "Server error occurred: " . $e->getMessage()]);
} finally {
    // Close connection if it was opened
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>