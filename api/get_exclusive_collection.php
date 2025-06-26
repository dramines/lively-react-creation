
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get all distinct itemgroups
    $itemgroupQuery = "SELECT DISTINCT itemgroup_product FROM products WHERE status_product = 'active' AND itemgroup_product IS NOT NULL AND itemgroup_product != ''";
    $itemgroupStmt = $db->prepare($itemgroupQuery);
    $itemgroupStmt->execute();
    $itemgroups = $itemgroupStmt->fetchAll(PDO::FETCH_COLUMN);
    
    $exclusiveProducts = [];
    
    // For each itemgroup, get 2 products
    foreach ($itemgroups as $itemgroup) {
        $productQuery = "SELECT * FROM products 
                        WHERE status_product = 'active' 
                        AND itemgroup_product = :itemgroup 
                        ORDER BY RAND() 
                        LIMIT 2";
        
        $productStmt = $db->prepare($productQuery);
        $productStmt->bindParam(':itemgroup', $itemgroup);
        $productStmt->execute();
        
        $products = $productStmt->fetchAll();
        $exclusiveProducts = array_merge($exclusiveProducts, $products);
    }
    
    // Shuffle the final array to mix itemgroups
    shuffle($exclusiveProducts);
    
    // Limit to maximum 16 products for display
    $exclusiveProducts = array_slice($exclusiveProducts, 0, 16);
    
    echo json_encode([
        'success' => true,
        'data' => $exclusiveProducts,
        'count' => count($exclusiveProducts)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
