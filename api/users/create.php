
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->email) && !empty($data->full_name) && !empty($data->password)) {
        try {
            // Check if email already exists
            $check_query = "SELECT id FROM users WHERE email = :email";
            $check_stmt = $db->prepare($check_query);
            $check_stmt->bindParam(":email", $data->email);
            $check_stmt->execute();
            
            if ($check_stmt->rowCount() > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "Email already exists."));
                return;
            }
            
            // Hash the password
            $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);
            
            $query = "INSERT INTO users (email, full_name, password, role) 
                    VALUES (:email, :full_name, :password, :role)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":full_name", $data->full_name);
            $stmt->bindParam(":password", $hashed_password);
            
            // Default role is 'user' unless specified
            $role = !empty($data->role) ? $data->role : 'user';
            $stmt->bindParam(":role", $role);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "User created successfully.",
                    "id" => $db->lastInsertId()
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create user."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
