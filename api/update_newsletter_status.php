
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
    
    if (!isset($input['status']) || empty($input['status'])) {
        throw new Exception('Status is required');
    }
    
    $id = intval($input['id']);
    $status = $input['status'];
    
    // Validate status
    $validStatuses = ['active', 'unsubscribed', 'bounced', 'pending'];
    if (!in_array($status, $validStatuses)) {
        throw new Exception('Invalid status. Must be one of: ' . implode(', ', $validStatuses));
    }
    
    // Check if subscriber exists
    $checkQuery = "SELECT id_subscriber FROM newsletter_subscribers WHERE id_subscriber = :id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':id', $id);
    $checkStmt->execute();
    
    if (!$checkStmt->fetch()) {
        throw new Exception('Subscriber not found');
    }
    
    // Update the subscriber status
    $updateQuery = "
        UPDATE newsletter_subscribers 
        SET status_subscriber = :status,
            date_unsubscribe = CASE WHEN :status = 'unsubscribed' THEN CURRENT_TIMESTAMP ELSE NULL END
        WHERE id_subscriber = :id
    ";
    
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':status', $status);
    $updateStmt->bindParam(':id', $id);
    
    if ($updateStmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Newsletter subscriber status updated successfully'
        ]);
    } else {
        throw new Exception('Failed to update subscriber status');
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error updating newsletter subscriber status: ' . $e->getMessage()
    ]);
}
?>
