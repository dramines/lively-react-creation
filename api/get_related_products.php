
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get parameters
    $id_product = isset($_GET['id_product']) ? $_GET['id_product'] : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    
    // Validate limit (max 50 products)
    if ($limit > 50) {
        $limit = 50;
    }
    
    // Query to get random products excluding the current product
    $query = "SELECT 
                id_product,
                reference_product,
                nom_product,
                img_product,
                img2_product,
                img3_product,
                img4_product,
                description_product,
                type_product,
                category_product,
                itemgroup_product,
                price_product,
                qnty_product,
                color_product,
                status_product,
                discount_product,
                createdate_product
              FROM products 
              WHERE status_product = 'active'";
    
    $params = [];
    
    // Exclude current product if provided
    if (!empty($id_product)) {
        $query .= " AND id_product != ?";
        $params[] = $id_product;
    }
    
    // Order randomly and add limit directly to query (not as parameter)
    $query .= " ORDER BY RAND() LIMIT " . $limit;
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'data' => $products,
        'total' => count($products),
        'limit' => $limit,
        'excluded_product' => $id_product
    ]);
    
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching related products: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>
