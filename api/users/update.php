
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            // Start building the query
            $query = "UPDATE users SET ";
            $params = array();
            
            // Only include fields that are provided
            if (!empty($data->email)) {
                $params[] = "email = :email";
            }
            
            if (!empty($data->full_name)) {
                $params[] = "full_name = :full_name";
            }
            
            if (!empty($data->password)) {
                $params[] = "password = :password";
            }
            
            if (!empty($data->role)) {
                $params[] = "role = :role";
            }
            
            // Add updated_at timestamp
            $params[] = "updated_at = NOW()";
            
            // Combine params into query string
            $query .= implode(", ", $params);
            $query .= " WHERE id = :id";
            
            $stmt = $db->prepare($query);
            
            // Bind parameters that were included
            if (!empty($data->email)) {
                $stmt->bindParam(":email", $data->email);
            }
            
            if (!empty($data->full_name)) {
                $stmt->bindParam(":full_name", $data->full_name);
            }
            
            if (!empty($data->password)) {
                $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
                $stmt->bindParam(":password", $hashed_password);
            }
            
            if (!empty($data->role)) {
                $stmt->bindParam(":role", $data->role);
            }
            
            $stmt->bindParam(":id", $data->id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "User updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update user."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update user. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
