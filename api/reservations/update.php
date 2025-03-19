
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            // Start building the update query
            $query = "UPDATE reservations SET ";
            $sets = [];
            $params = [];
            
            // Add fields to update only if they are provided
            if (isset($data->first_name)) {
                $sets[] = "first_name = :first_name";
                $params[':first_name'] = htmlspecialchars(strip_tags($data->first_name));
            }
            
            if (isset($data->last_name)) {
                $sets[] = "last_name = :last_name";
                $params[':last_name'] = htmlspecialchars(strip_tags($data->last_name));
            }
            
            if (isset($data->email)) {
                $sets[] = "email = :email";
                $params[':email'] = htmlspecialchars(strip_tags($data->email));
            }
            
            if (isset($data->phone)) {
                $sets[] = "phone = :phone";
                $params[':phone'] = htmlspecialchars(strip_tags($data->phone));
            }
            
            if (isset($data->event_name)) {
                $sets[] = "event_name = :event_name";
                $params[':event_name'] = htmlspecialchars(strip_tags($data->event_name));
            }
            
            if (isset($data->event_id)) {
                $sets[] = "event_id = :event_id";
                $params[':event_id'] = htmlspecialchars(strip_tags($data->event_id));
            }
            
            if (isset($data->places)) {
                $sets[] = "places = :places";
                $params[':places'] = htmlspecialchars(strip_tags($data->places));
            }
            
            if (isset($data->unit_price)) {
                $sets[] = "unit_price = :unit_price";
                $params[':unit_price'] = htmlspecialchars(strip_tags($data->unit_price));
            }
            
            if (isset($data->total_price)) {
                $sets[] = "total_price = :total_price";
                $params[':total_price'] = htmlspecialchars(strip_tags($data->total_price));
            }
            
            if (isset($data->payment_ref)) {
                $sets[] = "payment_ref = :payment_ref";
                $params[':payment_ref'] = htmlspecialchars(strip_tags($data->payment_ref));
            }
            
            if (isset($data->payment_status)) {
                $sets[] = "payment_status = :payment_status";
                $params[':payment_status'] = htmlspecialchars(strip_tags($data->payment_status));
            }
            
            // If there are no fields to update, return an error
            if (empty($sets)) {
                http_response_code(400);
                echo json_encode(array("message" => "No fields to update."));
                exit;
            }
            
            // Complete the query
            $query .= implode(", ", $sets);
            $query .= " WHERE id = :id";
            $params[':id'] = $data->id;
            
            $stmt = $db->prepare($query);
            
            // Bind parameters
            foreach ($params as $param => $value) {
                $stmt->bindValue($param, $value);
            }
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Reservation updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update reservation."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update reservation. No ID provided."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
