
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get pagination parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    // Build query with optional search
    $whereClause = "";
    $params = [];
    
    if (!empty($search)) {
        $whereClause = "WHERE nom_product LIKE ? OR reference_product LIKE ? OR description_product LIKE ?";
        $searchTerm = "%{$search}%";
        $params = [$searchTerm, $searchTerm, $searchTerm];
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM products " . $whereClause;
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Get products with pagination - use placeholders correctly
    $query = "SELECT * FROM products " . $whereClause . " ORDER BY createdate_product DESC LIMIT {$limit} OFFSET {$offset}";
    $stmt = $db->prepare($query);
    
    // Execute with only the search parameters (limit and offset are now in the query string)
    $stmt->execute($params);
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $products,
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
