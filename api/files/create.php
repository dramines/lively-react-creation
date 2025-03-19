
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if file was uploaded without errors
    if (isset($_FILES["file"]) && $_FILES["file"]["error"] == 0) {
        $allowed = array("jpg" => "image/jpg", "jpeg" => "image/jpeg", "gif" => "image/gif", "png" => "image/png", "pdf" => "application/pdf", "doc" => "application/msword", "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        $filename = $_FILES["file"]["name"];
        $filetype = $_FILES["file"]["type"];
        $filesize = $_FILES["file"]["size"];
        
        // Verify file extension
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        if (!array_key_exists($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(array("message" => "Error: Invalid file format."));
            exit;
        }
        
        // Verify file size - 5MB maximum
        $maxsize = 5 * 1024 * 1024;
        if ($filesize > $maxsize) {
            http_response_code(400);
            echo json_encode(array("message" => "Error: File size is larger than the allowed limit (5MB)."));
            exit;
        }
        
        // Verify MIME type of the file
        if (in_array($filetype, $allowed)) {
            // Create uploads directory if it doesn't exist
            $upload_dir = "../../uploads/";
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            // Generate unique filename
            $new_filename = uniqid() . "." . $ext;
            $upload_path = $upload_dir . $new_filename;
            
            // Save the file
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $upload_path)) {
                // Save file info to database
                try {
                    $file_url = "https://respizenmedical.com/vilartprod/uploads/" . $new_filename;
                    $user_id = isset($_POST["user_id"]) ? $_POST["user_id"] : null;
                    
                    $query = "INSERT INTO files (id, name, type, size, url, user_id) 
                              VALUES (UUID(), :name, :type, :size, :url, :user_id)";
                    
                    $stmt = $db->prepare($query);
                    
                    $stmt->bindParam(":name", $filename);
                    $stmt->bindParam(":type", $filetype);
                    $stmt->bindParam(":size", $filesize);
                    $stmt->bindParam(":url", $file_url);
                    $stmt->bindParam(":user_id", $user_id);
                    
                    if ($stmt->execute()) {
                        http_response_code(201);
                        echo json_encode(array(
                            "message" => "File uploaded successfully.",
                            "id" => $db->lastInsertId(),
                            "url" => $file_url
                        ));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "Unable to save file information."));
                    }
                } catch(PDOException $e) {
                    http_response_code(503);
                    echo json_encode(array("message" => "Database error: " . $e->getMessage()));
                }
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Error: There was an error uploading your file."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Error: There was a problem with the file upload. Please try again."));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Error: " . $_FILES["file"]["error"]));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
