
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if ID parameter exists
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $param = "id";
        $value = $_GET['id'];
    } 
    // Check if order_id parameter exists
    else if (isset($_GET['order_id']) && !empty($_GET['order_id'])) {
        $param = "order_id";
        $value = $_GET['order_id'];
    }
    // Check if email parameter exists (for user looking up their reservations)
    else if (isset($_GET['email']) && !empty($_GET['email'])) {
        $param = "email";
        $value = $_GET['email'];
    }
    // No valid parameter found
    else {
        http_response_code(400);
        echo json_encode(array("message" => "Missing ID, order_id, or email parameter."));
        exit;
    }
    
    try {
        $query = "SELECT * FROM reservations WHERE $param = :value";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":value", $value);
        $stmt->execute();
        
        // Check if multiple results could be returned (like for email)
        if ($param === "email") {
            $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (count($reservations) > 0) {
                http_response_code(200);
                echo json_encode($reservations);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No reservations found."));
            }
        } 
        // For unique identifiers like id or order_id
        else {
            if ($stmt->rowCount() > 0) {
                $reservation = $stmt->fetch(PDO::FETCH_ASSOC);
                http_response_code(200);
                echo json_encode($reservation);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Reservation not found."));
            }
        }
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
