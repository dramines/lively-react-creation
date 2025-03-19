
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    if (isset($_GET['order_id']) && !empty($_GET['order_id'])) {
        try {
            $query = "SELECT * FROM reservations WHERE order_id = :order_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":order_id", $_GET['order_id']);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $reservation = $stmt->fetch(PDO::FETCH_ASSOC);
                http_response_code(200);
                echo json_encode($reservation);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Reservation not found."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Missing order_id parameter."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
