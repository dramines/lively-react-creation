
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Only allow PUT method
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        echo json_encode([
            'success' => false,
            'message' => 'Only PUT method allowed'
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
    $checkQuery = "SELECT id_reservation, statut_reservation FROM reservations WHERE id_reservation = ?";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([$reservationId]);
    $reservation = $checkStmt->fetch();
    
    if (!$reservation) {
        echo json_encode([
            'success' => false,
            'message' => 'Reservation not found'
        ]);
        exit;
    }
    
    // Update reservation status to confirmed
    $updateQuery = "UPDATE reservations SET statut_reservation = 'confirmed', date_confirmation = CURRENT_TIMESTAMP WHERE id_reservation = ?";
    $updateStmt = $db->prepare($updateQuery);
    
    if ($updateStmt->execute([$reservationId])) {
        // Get updated reservation
        $selectQuery = "SELECT * FROM reservations WHERE id_reservation = ?";
        $selectStmt = $db->prepare($selectQuery);
        $selectStmt->execute([$reservationId]);
        $updatedReservation = $selectStmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Reservation confirmed successfully',
            'data' => $updatedReservation
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to confirm reservation'
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
