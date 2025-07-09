
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get pagination parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    
    // Build query with optional status filter
    $whereClause = "";
    $params = [];
    
    if (!empty($status)) {
        $whereClause = "WHERE statut_reservation = ?";
        $params = [$status];
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM reservations " . $whereClause;
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Get reservations with pagination - fix the parameter binding
    $query = "SELECT * FROM reservations " . $whereClause . " ORDER BY date_creation DESC LIMIT " . $limit . " OFFSET " . $offset;
    $stmt = $db->prepare($query);
    
    // Execute with only the status params (not limit/offset since they're already in the query)
    $stmt->execute($params);
    $reservations = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $reservations,
        'total' => (int)$total,
        'limit' => $limit,
        'offset' => $offset
    ]);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
