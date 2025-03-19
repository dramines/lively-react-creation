
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE password_vault 
                    SET site_name = :site_name, 
                        site_url = :site_url, 
                        username = :username, 
                        password = :password, 
                        notes = :notes,
                        updated_at = NOW()
                    WHERE id = :id AND user_id = :user_id";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":site_name", $data->site_name);
            $stmt->bindParam(":site_url", $data->site_url);
            $stmt->bindParam(":username", $data->username);
            $stmt->bindParam(":password", $data->password);
            $stmt->bindParam(":notes", $data->notes);
            $stmt->bindParam(":id", $data->id);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Password entry updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update password entry."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update password entry. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
