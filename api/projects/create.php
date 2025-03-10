
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->name) && !empty($data->artist_id) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO projects (name, description, artist_id, status, start_date, end_date, budget, user_id) 
                    VALUES (:name, :description, :artist_id, :status, :start_date, :end_date, :budget, :user_id)";
            
            $stmt = $db->prepare($query);
            
            // Get values or default
            $name = $data->name;
            $description = !empty($data->description) ? $data->description : "";
            $artist_id = $data->artist_id;
            $status = !empty($data->status) ? $data->status : "planifié";
            $start_date = !empty($data->start_date) ? $data->start_date : date('Y-m-d');
            $end_date = !empty($data->end_date) ? $data->end_date : null;
            $budget = !empty($data->budget) ? $data->budget : 0;
            $user_id = $data->user_id;
            
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":artist_id", $artist_id);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":start_date", $start_date);
            $stmt->bindParam(":end_date", $end_date);
            $stmt->bindParam(":budget", $budget);
            $stmt->bindParam(":user_id", $user_id);
            
            if ($stmt->execute()) {
                $id = $db->lastInsertId();
                
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Project created successfully.", 
                    "id" => $id,
                    "name" => $name,
                    "description" => $description,
                    "artist_id" => $artist_id,
                    "status" => $status,
                    "start_date" => $start_date,
                    "end_date" => $end_date,
                    "budget" => $budget,
                    "user_id" => $user_id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array(
                    "message" => "Unable to create project.",
                    "error" => $stmt->errorInfo()
                ));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array(
                "message" => "Database error: " . $e->getMessage(),
                "error" => $e->getMessage()
            ));
        }
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "Unable to create project. Data is incomplete.",
            "data_received" => $data
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
