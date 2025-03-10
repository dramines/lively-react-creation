
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id) && isset($data->rehearsal_hours)) {
        try {
            $query = "UPDATE artists 
                    SET rehearsal_hours = :rehearsal_hours,
                        updated_at = NOW()
                    WHERE id = :id AND user_id = :user_id";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":rehearsal_hours", $data->rehearsal_hours);
            $stmt->bindParam(":id", $data->id);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Rehearsal hours updated successfully.",
                    "id" => $data->id,
                    "rehearsal_hours" => $data->rehearsal_hours
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update rehearsal hours."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update rehearsal hours. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
