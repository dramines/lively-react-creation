
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get token from GET or POST
    $token = isset($_GET['token']) ? $_GET['token'] : (isset($_POST['token']) ? $_POST['token'] : null);
    
    if (!$token) {
        throw new Exception('Unsubscribe token is required');
    }
    
    // Find subscriber by token
    $findQuery = "SELECT id_subscriber, email_subscriber FROM newsletter_subscribers WHERE token_unsubscribe = :token AND status_subscriber = 'active'";
    $findStmt = $db->prepare($findQuery);
    $findStmt->bindParam(':token', $token);
    $findStmt->execute();
    $subscriber = $findStmt->fetch();
    
    if (!$subscriber) {
        throw new Exception('Invalid or expired unsubscribe token');
    }
    
    // Update subscriber status to unsubscribed
    $updateQuery = "
        UPDATE newsletter_subscribers 
        SET status_subscriber = 'unsubscribed',
            date_unsubscribe = CURRENT_TIMESTAMP
        WHERE id_subscriber = :id
    ";
    
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':id', $subscriber['id_subscriber']);
    
    if ($updateStmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'You have been successfully unsubscribed from our newsletter',
            'email' => $subscriber['email_subscriber']
        ]);
    } else {
        throw new Exception('Failed to unsubscribe');
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error unsubscribing from newsletter: ' . $e->getMessage()
    ]);
}
?>
