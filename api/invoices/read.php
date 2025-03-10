
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT * FROM invoices";
        if (isset($_GET['user_id'])) {
            $query .= " WHERE user_id = :user_id";
        }
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $db->prepare($query);
        
        if (isset($_GET['user_id'])) {
            $stmt->bindParam(":user_id", $_GET['user_id']);
        }
        
        $stmt->execute();
        
        $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Parse JSON items string into arrays
        foreach ($invoices as &$invoice) {
            $invoice['items'] = json_decode($invoice['items'], true);
        }
        
        http_response_code(200);
        echo json_encode($invoices);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
