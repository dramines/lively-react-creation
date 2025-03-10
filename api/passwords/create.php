
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->site_name) && !empty($data->username) && !empty($data->password) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO password_vault (site_name, site_url, username, password, notes, user_id) 
                    VALUES (:site_name, :site_url, :username, :password, :notes, :user_id)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":site_name", $data->site_name);
            $stmt->bindParam(":site_url", $data->site_url);
            $stmt->bindParam(":username", $data->username);
            $stmt->bindParam(":password", $data->password); // In production, encrypt this!
            $stmt->bindParam(":notes", $data->notes);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Password entry created successfully.", "id" => $db->lastInsertId()));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create password entry."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create password entry. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
