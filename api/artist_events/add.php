
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->artist_id) && !empty($data->event_id) && !empty($data->user_id)) {
        try {
            // Check if relation already exists
            $checkQuery = "SELECT * FROM artist_events 
                          WHERE artist_id = :artist_id AND event_id = :event_id";
            
            $checkStmt = $db->prepare($checkQuery);
            $checkStmt->bindParam(":artist_id", $data->artist_id);
            $checkStmt->bindParam(":event_id", $data->event_id);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "Artist is already assigned to this event."));
                return;
            }
            
            $query = "INSERT INTO artist_events (artist_id, event_id, user_id) 
                    VALUES (:artist_id, :event_id, :user_id)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":artist_id", $data->artist_id);
            $stmt->bindParam(":event_id", $data->event_id);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                $id = $db->lastInsertId();
                
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Artist added to event successfully.", 
                    "id" => $id,
                    "artist_id" => $data->artist_id,
                    "event_id" => $data->event_id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array(
                    "message" => "Unable to add artist to event.",
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
            "message" => "Unable to add artist to event. Data is incomplete.",
            "data_received" => $data
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
