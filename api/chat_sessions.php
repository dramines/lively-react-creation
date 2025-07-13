<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Create chat_sessions table if it doesn't exist
    $sessionsSQL = "CREATE TABLE IF NOT EXISTS chat_sessions (
        id_session VARCHAR(255) PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50) DEFAULT NULL,
        status ENUM('active', 'closed', 'archived') DEFAULT 'active',
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message_count INT DEFAULT 0,
        unread_count INT DEFAULT 0,
        INDEX idx_client_email (client_email),
        INDEX idx_status_activity (status, last_activity),
        INDEX idx_date_created (date_created)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($sessionsSQL);

    function getChatSessions($db) {
        try {
            $stmt = $db->prepare("
                SELECT 
                    cs.*,
                    COUNT(cm.id_message) as message_count,
                    SUM(CASE WHEN cm.sender_type = 'client' AND cm.is_read = 0 THEN 1 ELSE 0 END) as unread_count
                FROM chat_sessions cs
                LEFT JOIN chat_messages cm ON cs.id_session = cm.id_session
                WHERE cs.status = 'active'
                GROUP BY cs.id_session
                ORDER BY cs.last_activity DESC
            ");
            
            $stmt->execute();
            $sessions = $stmt->fetchAll();
            
            return [
                'success' => true,
                'sessions' => $sessions
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching sessions: ' . $e->getMessage()
            ];
        }
    }

    function createOrUpdateSession($db, $data) {
        try {
            $sessionId = $data['session_id'] ?? uniqid('session_', true);
            
            $stmt = $db->prepare("
                INSERT INTO chat_sessions (id_session, client_name, client_email, client_phone, last_activity)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE
                client_name = VALUES(client_name),
                client_email = VALUES(client_email),
                client_phone = VALUES(client_phone),
                last_activity = CURRENT_TIMESTAMP
            ");
            
            $stmt->execute([
                $sessionId,
                $data['client_name'],
                $data['client_email'],
                $data['client_phone'] ?? null
            ]);
            
            return [
                'success' => true,
                'session_id' => $sessionId,
                'message' => 'Session created/updated successfully'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error creating/updating session: ' . $e->getMessage()
            ];
        }
    }

    // Handle requests
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            echo json_encode(getChatSessions($db));
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if ($input) {
                echo json_encode(createOrUpdateSession($db, $input));
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid input data']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>