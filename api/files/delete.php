
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            // First get the file URL to delete the physical file
            $query = "SELECT url FROM files WHERE id = :id";
            if (!empty($data->user_id)) {
                $query .= " AND user_id = :user_id";
            }
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $data->id);
            
            if (!empty($data->user_id)) {
                $stmt->bindParam(":user_id", $data->user_id);
            }
            
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $file = $stmt->fetch(PDO::FETCH_ASSOC);
                $file_path = str_replace("https://respizenmedical.com/vilartprod/uploads/", "../../uploads/", $file['url']);
                
                // Delete from database
                $delete_query = "DELETE FROM files WHERE id = :id";
                if (!empty($data->user_id)) {
                    $delete_query .= " AND user_id = :user_id";
                }
                
                $delete_stmt = $db->prepare($delete_query);
                $delete_stmt->bindParam(":id", $data->id);
                
                if (!empty($data->user_id)) {
                    $delete_stmt->bindParam(":user_id", $data->user_id);
                }
                
                if ($delete_stmt->execute()) {
                    // Try to delete the physical file
                    if (file_exists($file_path)) {
                        unlink($file_path);
                    }
                    
                    http_response_code(200);
                    echo json_encode(array("message" => "File deleted successfully."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to delete file from database."));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "File not found."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to delete file. No ID provided."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
