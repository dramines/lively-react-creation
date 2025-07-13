
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Only allow POST method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            'success' => false,
            'message' => 'Only POST method allowed'
        ]);
        exit;
    }
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON data'
        ]);
        exit;
    }
    
    // Validate required fields
    $required_fields = ['nom_client', 'email_client', 'telephone_client', 'date_reservation', 'heure_reservation'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            echo json_encode([
                'success' => false,
                'message' => "Field '{$field}' is required"
            ]);
            exit;
        }
    }
    
    // Insert reservation
    $query = "INSERT INTO reservations (nom_client, email_client, telephone_client, date_reservation, heure_reservation, notes_reservation) 
              VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $db->prepare($query);
    $result = $stmt->execute([
        $input['nom_client'],
        $input['email_client'],
        $input['telephone_client'],
        $input['date_reservation'],
        $input['heure_reservation'],
        $input['notes_reservation'] ?? ''
    ]);
    
    if ($result) {
        $reservation_id = $db->lastInsertId();
        
        // Get the created reservation
        $selectQuery = "SELECT * FROM reservations WHERE id_reservation = ?";
        $selectStmt = $db->prepare($selectQuery);
        $selectStmt->execute([$reservation_id]);
        $reservation = $selectStmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Reservation created successfully',
            'data' => $reservation
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create reservation'
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
