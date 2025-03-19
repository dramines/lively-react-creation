
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE projects 
                    SET name = :name, 
                        description = :description, 
                        artist_id = :artist_id,
                        status = :status,
                        start_date = :start_date,
                        end_date = :end_date,
                        budget = :budget,
                        updated_at = NOW()
                    WHERE id = :id";
            
            if (isset($data->user_id)) {
                $query .= " AND user_id = :user_id";
            }
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":name", $data->name);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":artist_id", $data->artist_id);
            $stmt->bindParam(":status", $data->status);
            $stmt->bindParam(":start_date", $data->start_date);
            $stmt->bindParam(":end_date", $data->end_date);
            $stmt->bindParam(":budget", $data->budget);
            $stmt->bindParam(":id", $data->id);
            
            if (isset($data->user_id)) {
                $stmt->bindParam(":user_id", $data->user_id);
            }
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Project updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update project."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update project. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
