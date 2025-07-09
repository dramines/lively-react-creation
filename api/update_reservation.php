
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
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON data'
        ]);
        exit;
    }
    
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
    
    // Build update query dynamically based on provided fields
    $updateFields = [];
    $params = [];
    
    $allowedFields = [
        'nom_client', 'email_client', 'telephone_client', 'date_reservation',
        'heure_reservation', 'statut_reservation', 'notes_reservation'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "`{$field}` = ?";
            $params[] = $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        echo json_encode([
            'success' => false,
            'message' => 'No valid fields to update'
        ]);
        exit;
    }
    
    // Add reservation ID to params for WHERE clause
    $params[] = $reservationId;
    
    $updateQuery = "UPDATE reservations SET " . implode(', ', $updateFields) . " WHERE id_reservation = ?";
    $updateStmt = $db->prepare($updateQuery);
    
    if ($updateStmt->execute($params)) {
        // Fetch updated reservation
        $selectQuery = "SELECT * FROM reservations WHERE id_reservation = ?";
        $selectStmt = $db->prepare($selectQuery);
        $selectStmt->execute([$reservationId]);
        $updatedReservation = $selectStmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Reservation updated successfully',
            'data' => $updatedReservation
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update reservation'
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
