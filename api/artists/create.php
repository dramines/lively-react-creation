
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->name) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO artists (name, genre, email, phone, user_id) 
                    VALUES (:name, :genre, :email, :phone, :user_id)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":name", $data->name);
            $stmt->bindParam(":genre", $data->genre);
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":phone", $data->phone);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Artist created successfully.", "id" => $db->lastInsertId()));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create artist."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create artist. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
