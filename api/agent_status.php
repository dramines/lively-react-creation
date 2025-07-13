<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Create agent_status table if it doesn't exist
    $createTableSQL = "CREATE TABLE IF NOT EXISTS agent_status (
        id INT PRIMARY KEY DEFAULT 1,
        is_online BOOLEAN DEFAULT FALSE,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        agent_name VARCHAR(255) DEFAULT 'Luxury Assistant'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($createTableSQL);
    
    // Insert default record if not exists
    $db->exec("INSERT IGNORE INTO agent_status (id, is_online, agent_name) VALUES (1, FALSE, 'Luxury Assistant')");

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $stmt = $db->prepare("SELECT * FROM agent_status WHERE id = 1");
            $stmt->execute();
            $status = $stmt->fetch();
            
            echo json_encode([
                'success' => true,
                'status' => $status ?: ['id' => 1, 'is_online' => false, 'agent_name' => 'Luxury Assistant']
            ]);
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['is_online'])) {
                echo json_encode(['success' => false, 'message' => 'is_online field required']);
                exit;
            }
            
            $isOnline = $input['is_online'] ? 1 : 0;
            
            $stmt = $db->prepare("UPDATE agent_status SET is_online = ?, last_updated = CURRENT_TIMESTAMP WHERE id = 1");
            $stmt->execute([$isOnline]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Agent status updated successfully',
                'is_online' => (bool)$isOnline
            ]);
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