
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Only allow DELETE method
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        echo json_encode([
            'success' => false,
            'message' => 'Only DELETE method allowed'
        ]);
        exit;
    }
    
    // Get reservation ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Reservation ID is required'
        ]);
        exit;
    }
    
    $reservationId = (int)$_GET['id'];
    
    // Check if reservation exists
    $checkQuery = "SELECT id_reservation FROM reservations WHERE id_reservation = ?";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([$reservationId]);
    
    if (!$checkStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Reservation not found'
        ]);
        exit;
    }
    
    // Delete the reservation
    $deleteQuery = "DELETE FROM reservations WHERE id_reservation = ?";
    $deleteStmt = $db->prepare($deleteQuery);
    
    if ($deleteStmt->execute([$reservationId])) {
        echo json_encode([
            'success' => true,
            'message' => 'Reservation deleted successfully',
            'deleted_id' => $reservationId
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete reservation'
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
