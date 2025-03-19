
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->name) && !empty($data->artist_id) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO projects 
                    (id, name, description, artist_id, status, start_date, end_date, budget, user_id) 
                    VALUES 
                    (UUID(), :name, :description, :artist_id, :status, :start_date, :end_date, :budget, :user_id)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":name", $data->name);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":artist_id", $data->artist_id);
            $stmt->bindParam(":status", $data->status);
            $stmt->bindParam(":start_date", $data->start_date);
            $stmt->bindParam(":end_date", $data->end_date);
            $stmt->bindParam(":budget", $data->budget);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Project created successfully.", "id" => $db->lastInsertId()));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create project."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create project. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
