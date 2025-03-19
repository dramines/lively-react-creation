
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->title) && !empty($data->date) && !empty($data->location) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO events (title, description, date, location, user_id) 
                    VALUES (:title, :description, :date, :location, :user_id)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":date", $data->date);
            $stmt->bindParam(":location", $data->location);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Event created successfully.", "id" => $db->lastInsertId()));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create event."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create event. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
