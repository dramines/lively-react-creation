
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['email']) || empty($input['email'])) {
        throw new Exception('Email is required');
    }
    
    $email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        throw new Exception('Invalid email format');
    }
    
    $nom = isset($input['nom']) ? $input['nom'] : null;
    $prenom = isset($input['prenom']) ? $input['prenom'] : null;
    $age = isset($input['age']) ? intval($input['age']) : null;
    $source = isset($input['source']) ? $input['source'] : 'manual';
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : null;
    
    // Check if email already exists
    $checkQuery = "SELECT id_subscriber, status_subscriber FROM newsletter_subscribers WHERE email_subscriber = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    $existingSubscriber = $checkStmt->fetch();
    
    if ($existingSubscriber) {
        if ($existingSubscriber['status_subscriber'] === 'active') {
            throw new Exception('Email already subscribed');
        } else {
            // Reactivate the subscription
            $updateQuery = "
                UPDATE newsletter_subscribers 
                SET status_subscriber = 'active',
                    date_inscription = CURRENT_TIMESTAMP,
                    date_unsubscribe = NULL,
                    nom_subscriber = :nom,
                    prenom_subscriber = :prenom,
                    age_subscriber = :age,
                    source_subscriber = :source,
                    ip_inscription = :ip
                WHERE id_subscriber = :id
            ";
            
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':nom', $nom);
            $updateStmt->bindParam(':prenom', $prenom);
            $updateStmt->bindParam(':age', $age);
            $updateStmt->bindParam(':source', $source);
            $updateStmt->bindParam(':ip', $ip);
            $updateStmt->bindParam(':id', $existingSubscriber['id_subscriber']);
            
            if ($updateStmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Email subscription reactivated successfully',
                    'id' => $existingSubscriber['id_subscriber']
                ]);
            } else {
                throw new Exception('Failed to reactivate subscription');
            }
        }
    } else {
        // Generate unsubscribe token
        $token = bin2hex(random_bytes(32));
        
        // Insert new subscriber
        $insertQuery = "
            INSERT INTO newsletter_subscribers (
                email_subscriber,
                nom_subscriber,
                prenom_subscriber,
                age_subscriber,
                status_subscriber,
                source_subscriber,
                date_inscription,
                ip_inscription,
                token_unsubscribe
            ) VALUES (
                :email,
                :nom,
                :prenom,
                :age,
                'active',
                :source,
                CURRENT_TIMESTAMP,
                :ip,
                :token
            )
        ";
        
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':email', $email);
        $insertStmt->bindParam(':nom', $nom);
        $insertStmt->bindParam(':prenom', $prenom);
        $insertStmt->bindParam(':age', $age);
        $insertStmt->bindParam(':source', $source);
        $insertStmt->bindParam(':ip', $ip);
        $insertStmt->bindParam(':token', $token);
        
        if ($insertStmt->execute()) {
            $subscriberId = $db->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'Email subscribed successfully',
                'id' => $subscriberId
            ]);
        } else {
            throw new Exception('Failed to subscribe email');
        }
    }

} catch (Exception $e) {
    $errorMessage = $e->getMessage();
    
    // Map specific error messages for frontend translation
    if ($errorMessage === 'Email already subscribed') {
        echo json_encode([
            'success' => false,
            'message' => 'EMAIL_ALREADY_SUBSCRIBED'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error subscribing to newsletter: ' . $errorMessage
        ]);
    }
}
?>
