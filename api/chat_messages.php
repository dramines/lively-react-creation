<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

function optimizeResponse($success, $data = null, $error = null) {
    $response = ['success' => $success];
    if ($data) $response = array_merge($response, $data);
    if ($error) $response['error'] = $error;
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Create table with image support if it doesn't exist
    $createTableSQL = "CREATE TABLE IF NOT EXISTS chat_messages (
        id_message INT AUTO_INCREMENT PRIMARY KEY,
        id_session VARCHAR(255) NOT NULL,
        sender_type ENUM('client', 'agent') NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        message_content TEXT,
        message_type ENUM('text', 'file', 'system', 'image') DEFAULT 'text',
        is_read BOOLEAN DEFAULT FALSE,
        date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        image_url VARCHAR(512) NULL,
        image_name VARCHAR(255) NULL,
        image_size INT NULL,
        INDEX idx_session_date (id_session, date_sent),
        INDEX idx_sender_read (sender_type, is_read),
        INDEX idx_message_type (message_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($createTableSQL);

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $sessionId = $_GET['session_id'] ?? '';
            $lastMessageId = $_GET['last_message_id'] ?? null;
            
            if (!$sessionId) {
                optimizeResponse(false, null, 'Session ID required');
            }
            
            // Optimized query with pagination and caching headers
            $sql = "SELECT id_message, id_session, sender_type, sender_name, message_content, 
                           message_type, is_read, date_sent, image_url, image_name, image_size
                    FROM chat_messages 
                    WHERE id_session = :session_id";
            
            $params = ['session_id' => $sessionId];
            
            if ($lastMessageId) {
                $sql .= " AND id_message > :last_id";
                $params['last_id'] = $lastMessageId;
            }
            
            $sql .= " ORDER BY date_sent ASC LIMIT 50";
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $messages = $stmt->fetchAll();
            
            // Add caching headers to reduce server load
            header('Cache-Control: private, max-age=30');
            header('ETag: ' . md5(json_encode($messages)));
            
            optimizeResponse(true, ['messages' => $messages]);
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $sessionId = $input['session_id'] ?? '';
            $senderType = $input['sender_type'] ?? '';
            $senderName = $input['sender_name'] ?? '';
            $messageContent = $input['message_content'] ?? '';
            $messageType = $input['message_type'] ?? 'text';
            $imageUrl = $input['image_url'] ?? null;
            $imageName = $input['image_name'] ?? null;
            $imageSize = $input['image_size'] ?? null;
            
            if (!$sessionId || !$senderType || !$senderName) {
                optimizeResponse(false, null, 'Required fields missing');
            }
            
            if ($messageType === 'image' && !$imageUrl) {
                optimizeResponse(false, null, 'Image URL required for image messages');
            }
            
            // Insert optimized with prepared statement
            $sql = "INSERT INTO chat_messages 
                    (id_session, sender_type, sender_name, message_content, message_type, 
                     image_url, image_name, image_size, date_sent) 
                    VALUES (:session_id, :sender_type, :sender_name, :message_content, 
                           :message_type, :image_url, :image_name, :image_size, NOW())";
            
            $stmt = $db->prepare($sql);
            $stmt->execute([
                'session_id' => $sessionId,
                'sender_type' => $senderType,
                'sender_name' => $senderName,
                'message_content' => $messageContent,
                'message_type' => $messageType,
                'image_url' => $imageUrl,
                'image_name' => $imageName,
                'image_size' => $imageSize
            ]);
            
            // Return the created message
            $messageId = $db->lastInsertId();
            $stmt = $db->prepare("SELECT * FROM chat_messages WHERE id_message = :id");
            $stmt->execute(['id' => $messageId]);
            $message = $stmt->fetch();
            
            // Update session activity
            $updateSession = $db->prepare("UPDATE chat_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id_session = ?");
            $updateSession->execute([$sessionId]);
            
            optimizeResponse(true, ['message' => $message]);
            break;

        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            $sessionId = $input['session_id'] ?? '';
            $senderType = $input['sender_type'] ?? '';
            
            if (!$sessionId || !$senderType) {
                optimizeResponse(false, null, 'Session ID and sender type required');
            }
            
            // Optimized bulk update
            $stmt = $db->prepare("UPDATE chat_messages 
                                   SET is_read = 1 
                                   WHERE id_session = :session_id AND sender_type = :sender_type");
            $stmt->execute([
                'session_id' => $sessionId,
                'sender_type' => $senderType
            ]);
            
            optimizeResponse(true, ['updated' => $stmt->rowCount()]);
            break;
    }

} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    optimizeResponse(false, null, 'Database connection error');
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    optimizeResponse(false, null, 'Server error');
}
?>