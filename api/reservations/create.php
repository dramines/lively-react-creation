
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (
        !empty($data->first_name) &&
        !empty($data->last_name) &&
        !empty($data->email) &&
        !empty($data->phone) &&
        !empty($data->event_name) &&
        !empty($data->places) &&
        !empty($data->total_price) &&
        !empty($data->order_id)
    ) {
        try {
            $query = "INSERT INTO reservations 
                    (first_name, last_name, email, phone, event_name, event_id, places, unit_price, total_price, order_id, payment_ref, payment_status) 
                    VALUES 
                    (:first_name, :last_name, :email, :phone, :event_name, :event_id, :places, :unit_price, :total_price, :order_id, :payment_ref, :payment_status)";
            
            $stmt = $db->prepare($query);
            
            // Clean and sanitize input data
            $first_name = htmlspecialchars(strip_tags($data->first_name));
            $last_name = htmlspecialchars(strip_tags($data->last_name));
            $email = htmlspecialchars(strip_tags($data->email));
            $phone = htmlspecialchars(strip_tags($data->phone));
            $event_name = htmlspecialchars(strip_tags($data->event_name));
            $event_id = !empty($data->event_id) ? htmlspecialchars(strip_tags($data->event_id)) : null;
            $places = htmlspecialchars(strip_tags($data->places));
            $unit_price = htmlspecialchars(strip_tags($data->unit_price));
            $total_price = htmlspecialchars(strip_tags($data->total_price));
            $order_id = htmlspecialchars(strip_tags($data->order_id));
            $payment_ref = !empty($data->payment_ref) ? htmlspecialchars(strip_tags($data->payment_ref)) : null;
            $payment_status = !empty($data->payment_status) ? htmlspecialchars(strip_tags($data->payment_status)) : 'pending';
            
            // Bind parameters
            $stmt->bindParam(":first_name", $first_name);
            $stmt->bindParam(":last_name", $last_name);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":phone", $phone);
            $stmt->bindParam(":event_name", $event_name);
            $stmt->bindParam(":event_id", $event_id);
            $stmt->bindParam(":places", $places);
            $stmt->bindParam(":unit_price", $unit_price);
            $stmt->bindParam(":total_price", $total_price);
            $stmt->bindParam(":order_id", $order_id);
            $stmt->bindParam(":payment_ref", $payment_ref);
            $stmt->bindParam(":payment_status", $payment_status);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Reservation created successfully",
                    "id" => $db->lastInsertId()
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create reservation."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create reservation. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
