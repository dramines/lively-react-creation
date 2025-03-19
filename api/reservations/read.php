
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT * FROM reservations";
        
        // Add filters if provided
        $where_conditions = [];
        $params = [];
        
        // Email filter
        if (isset($_GET['email']) && !empty($_GET['email'])) {
            $where_conditions[] = "email = :email";
            $params[':email'] = $_GET['email'];
        }
        
        // Order ID filter
        if (isset($_GET['order_id']) && !empty($_GET['order_id'])) {
            $where_conditions[] = "order_id = :order_id";
            $params[':order_id'] = $_GET['order_id'];
        }
        
        // Payment status filter
        if (isset($_GET['payment_status']) && !empty($_GET['payment_status'])) {
            $where_conditions[] = "payment_status = :payment_status";
            $params[':payment_status'] = $_GET['payment_status'];
        }
        
        // Event ID filter
        if (isset($_GET['event_id']) && !empty($_GET['event_id'])) {
            $where_conditions[] = "event_id = :event_id";
            $params[':event_id'] = $_GET['event_id'];
        }
        
        // Event name filter
        if (isset($_GET['event_name']) && !empty($_GET['event_name'])) {
            $where_conditions[] = "event_name LIKE :event_name";
            $params[':event_name'] = '%' . $_GET['event_name'] . '%';
        }
        
        // Name filter (searches in both first_name and last_name)
        if (isset($_GET['name']) && !empty($_GET['name'])) {
            $where_conditions[] = "(first_name LIKE :name OR last_name LIKE :name)";
            $params[':name'] = '%' . $_GET['name'] . '%';
        }
        
        // Date range filter (from)
        if (isset($_GET['date_from']) && !empty($_GET['date_from'])) {
            $where_conditions[] = "created_at >= :date_from";
            $params[':date_from'] = $_GET['date_from'] . ' 00:00:00';
        }
        
        // Date range filter (to)
        if (isset($_GET['date_to']) && !empty($_GET['date_to'])) {
            $where_conditions[] = "created_at <= :date_to";
            $params[':date_to'] = $_GET['date_to'] . ' 23:59:59';
        }
        
        // Add WHERE clause if conditions exist
        if (!empty($where_conditions)) {
            $query .= " WHERE " . implode(' AND ', $where_conditions);
        }
        
        // Add sorting
        $sort_column = isset($_GET['sort']) && in_array($_GET['sort'], ['created_at', 'event_name', 'total_price', 'places']) 
            ? $_GET['sort'] 
            : 'created_at';
            
        $sort_dir = isset($_GET['dir']) && strtoupper($_GET['dir']) === 'ASC' ? 'ASC' : 'DESC';
        $query .= " ORDER BY $sort_column $sort_dir";
        
        // Add pagination
        if (isset($_GET['limit']) && is_numeric($_GET['limit'])) {
            $limit = (int)$_GET['limit'];
            $offset = isset($_GET['offset']) && is_numeric($_GET['offset']) ? (int)$_GET['offset'] : 0;
            $query .= " LIMIT $limit OFFSET $offset";
        }
        
        $stmt = $db->prepare($query);
        
        // Bind parameters if they exist
        foreach ($params as $param => $value) {
            $stmt->bindValue($param, $value);
        }
        
        $stmt->execute();
        
        $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get total count for pagination
        $countQuery = "SELECT COUNT(*) as total FROM reservations";
        if (!empty($where_conditions)) {
            $countQuery .= " WHERE " . implode(' AND ', $where_conditions);
        }
        
        $countStmt = $db->prepare($countQuery);
        
        // Bind parameters for count query
        foreach ($params as $param => $value) {
            $countStmt->bindValue($param, $value);
        }
        
        $countStmt->execute();
        $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Return data with metadata
        $response = [
            'total' => (int)$totalCount,
            'offset' => $offset ?? 0,
            'limit' => $limit ?? null,
            'data' => $reservations
        ];
        
        http_response_code(200);
        echo json_encode($response);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
