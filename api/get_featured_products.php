
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 6;
    
    // Get featured products (products with discount or newest products)
    $query = "SELECT * FROM products 
              WHERE status_product = 'active' 
              ORDER BY 
                CASE WHEN discount_product > 0 THEN 0 ELSE 1 END,
                createdate_product DESC 
              LIMIT ?";
    
    $stmt = $db->prepare($query);
    $stmt->execute([$limit]);
    $products = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $products,
        'count' => count($products)
    ]);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
