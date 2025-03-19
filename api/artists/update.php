
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE artists 
                    SET name = :name, 
                        genre = :genre, 
                        email = :email, 
                        phone = :phone,
                        updated_at = NOW()
                    WHERE id = :id AND user_id = :user_id";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":name", $data->name);
            $stmt->bindParam(":genre", $data->genre);
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":phone", $data->phone);
            $stmt->bindParam(":id", $data->id);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Artist updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update artist."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update artist. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
