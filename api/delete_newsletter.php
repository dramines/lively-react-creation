
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id']) || empty($input['id'])) {
        throw new Exception('Subscriber ID is required');
    }
    
    $id = intval($input['id']);
    
    // Check if subscriber exists
    $checkQuery = "SELECT id_subscriber FROM newsletter_subscribers WHERE id_subscriber = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();
    
    if (!$checkStmt->fetch()) {
        throw new Exception('Subscriber not found');
    }
    
    // Delete the subscriber
    $deleteQuery = "DELETE FROM newsletter_subscribers WHERE id_subscriber = :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $id);
    
    if ($deleteStmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Newsletter subscriber deleted successfully'
        ]);
    } else {
        throw new Exception('Failed to delete subscriber');
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting newsletter subscriber: ' . $e->getMessage()
    ]);
}
?>
