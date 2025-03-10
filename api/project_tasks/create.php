
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->title) && !empty($data->project_id) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO project_tasks (title, description, status, assigned_to, deadline, project_id, user_id) 
                    VALUES (:title, :description, :status, :assigned_to, :deadline, :project_id, :user_id)";
            
            $stmt = $db->prepare($query);
            
            // Get values or default
            $title = $data->title;
            $description = !empty($data->description) ? $data->description : "";
            $status = !empty($data->status) ? $data->status : "à_faire";
            $assigned_to = !empty($data->assigned_to) ? $data->assigned_to : null;
            $deadline = !empty($data->deadline) ? $data->deadline : null;
            $project_id = $data->project_id;
            $user_id = $data->user_id;
            
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":assigned_to", $assigned_to);
            $stmt->bindParam(":deadline", $deadline);
            $stmt->bindParam(":project_id", $project_id);
            $stmt->bindParam(":user_id", $user_id);
            
            if ($stmt->execute()) {
                $id = $db->lastInsertId();
                
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Task created successfully.", 
                    "id" => $id,
                    "title" => $title,
                    "description" => $description,
                    "status" => $status,
                    "assigned_to" => $assigned_to,
                    "deadline" => $deadline,
                    "project_id" => $project_id,
                    "user_id" => $user_id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array(
                    "message" => "Unable to create task.",
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
            "message" => "Unable to create task. Data is incomplete.",
            "data_received" => $data
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
