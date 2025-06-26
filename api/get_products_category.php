
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!isset($_GET['category']) || empty($_GET['category'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Category is required'
        ]);
        exit;
    }
    
    $category = $_GET['category'];
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Get total count for category
    $countQuery = "SELECT COUNT(*) as total FROM products WHERE category_product = ? AND status_product = 'active'";
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute([$category]);
    $total = $countStmt->fetch()['total'];
    
    // Get products by category
    $query = "SELECT * FROM products 
              WHERE category_product = ? AND status_product = 'active' 
              ORDER BY createdate_product DESC 
              LIMIT ? OFFSET ?";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$category, $limit, $offset]);
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $products,
        'total' => (int)$total,
        'category' => $category,
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
