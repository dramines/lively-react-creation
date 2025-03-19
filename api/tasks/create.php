
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->title)) {
        try {
            $query = "INSERT INTO tasks (title, description, status, due_date, priority, user_id) 
                      VALUES (:title, :description, :status, :due_date, :priority, :user_id)";
            
            $stmt = $db->prepare($query);
            
            // Set default values if not provided
            $description = property_exists($data, 'description') ? $data->description : null;
            $status = property_exists($data, 'status') ? $data->status : 'pending';
            $due_date = property_exists($data, 'due_date') ? $data->due_date : null;
            $priority = property_exists($data, 'priority') ? $data->priority : 'medium';
            $user_id = property_exists($data, 'user_id') ? $data->user_id : null;
            
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $description);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":due_date", $due_date);
            $stmt->bindParam(":priority", $priority);
            $stmt->bindParam(":user_id", $user_id);
            
            if ($stmt->execute()) {
                $task_id = $db->lastInsertId();
                
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Task created successfully.",
                    "id" => $task_id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create task."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create task. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
