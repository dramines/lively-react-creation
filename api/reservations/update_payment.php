
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->order_id) && !empty($data->payment_status)) {
        try {
            $query = "UPDATE reservations SET 
                      payment_status = :payment_status";
            
            // Add payment reference if provided
            if (!empty($data->payment_ref)) {
                $query .= ", payment_ref = :payment_ref";
            }
            
            $query .= " WHERE order_id = :order_id";
            
            $stmt = $db->prepare($query);
            
            // Clean and sanitize input data
            $payment_status = htmlspecialchars(strip_tags($data->payment_status));
            $order_id = htmlspecialchars(strip_tags($data->order_id));
            
            // Bind parameters
            $stmt->bindParam(":payment_status", $payment_status);
            $stmt->bindParam(":order_id", $order_id);
            
            if (!empty($data->payment_ref)) {
                $payment_ref = htmlspecialchars(strip_tags($data->payment_ref));
                $stmt->bindParam(":payment_ref", $payment_ref);
            }
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Payment status updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update payment status."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update payment status. Order ID or status not provided."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
