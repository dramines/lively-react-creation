
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get parameters
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    $subcategory = isset($_GET['subcategory']) ? trim($_GET['subcategory']) : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Validate limit and offset to prevent SQL injection
    $limit = max(1, min(100, $limit)); // Between 1 and 100
    $offset = max(0, $offset); // At least 0
    
    // Build the WHERE clause based on parameters
    $whereConditions = ["status_product = 'active'"];
    $params = [];
    
    if (!empty($subcategory)) {
        // If subcategory is provided, filter by itemgroup_product
        $whereConditions[] = "itemgroup_product = ?";
        $params[] = $subcategory;
    } else if (!empty($category)) {
        // If only category is provided, handle main categories
        if ($category === 'surMesure') {
            // For "surMesure", get products where category_product is 'homme' or 'femme'
            $whereConditions[] = "(category_product = 'homme' OR category_product = 'femme')";
        } else if ($category === 'pretAPorter') {
            // For "pretAPorter", get products where itemgroup_product is in prêt à porter items
            $pretAPorterItems = ['chemise', 'tshirt', 'polo', 'chaussure', 'ceinture', 'maroquinerie'];
            $placeholders = str_repeat('?,', count($pretAPorterItems) - 1) . '?';
            $whereConditions[] = "itemgroup_product IN ($placeholders)";
            $params = array_merge($params, $pretAPorterItems);
        } else if ($category === 'accessoires') {
            // For "accessoires", get products where itemgroup_product is in accessoires items
            $accessoiresItems = ['cravate', 'pochette', 'maroquinerie', 'autre'];
            $placeholders = str_repeat('?,', count($accessoiresItems) - 1) . '?';
            $whereConditions[] = "itemgroup_product IN ($placeholders)";
            $params = array_merge($params, $accessoiresItems);
        }
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM products WHERE " . $whereClause;
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];
    
    // Get products with pagination
    $query = "SELECT * FROM products 
              WHERE " . $whereClause . " 
              ORDER BY createdate_product DESC 
              LIMIT " . $limit . " OFFSET " . $offset;
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
    
    // Log the query for debugging
    error_log("Category API Query: category=$category, subcategory=$subcategory, total=$total, limit=$limit, offset=$offset");
    
    echo json_encode([
        'success' => true,
        'data' => $products,
        'total' => (int)$total,
        'category' => $category,
        'subcategory' => $subcategory,
        'limit' => $limit,
        'offset' => $offset,
        'query_info' => [
            'where_clause' => $whereClause,
            'params' => $params,
            'final_query' => $query
        ]
    ]);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'category' => $category ?? '',
        'subcategory' => $subcategory ?? '',
        'debug_info' => [
            'limit' => $limit ?? 0,
            'offset' => $offset ?? 0
        ]
    ]);
}
?>
