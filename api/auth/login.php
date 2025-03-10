
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->email) && !empty($data->password)) {
        try {
            $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(":email", $data->email);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (password_verify($data->password, $row['password'])) {
                    // Login successful
                    http_response_code(200);
                    echo json_encode(array(
                        "id" => $row['id'],
                        "email" => $row['email'],
                        "full_name" => $row['full_name'],
                        "role" => $row['role']
                    ));
                } else {
                    // Password incorrect
                    http_response_code(401);
                    echo json_encode(array("message" => "Invalid credentials."));
                }
            } else {
                // Email not found
                http_response_code(401);
                echo json_encode(array("message" => "Invalid credentials."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to login. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
