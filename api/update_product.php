
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Only allow PUT method
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        echo json_encode([
            'success' => false,
            'message' => 'Only PUT method allowed'
        ]);
        exit;
    }
    
    // Get product ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
        exit;
    }
    
    $productId = (int)$_GET['id'];
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON data'
        ]);
        exit;
    }
    
    // Check if product exists
    $checkQuery = "SELECT id_product FROM products WHERE id_product = ?";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute([$productId]);
    
    if (!$checkStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
        exit;
    }
    
    // Build update query dynamically based on provided fields
    $updateFields = [];
    $params = [];
    
    $allowedFields = [
        'reference_product', 'nom_product', 'img_product', 'img2_product', 
        'img3_product', 'img4_product', 'description_product', 'type_product',
        'category_product', 'itemgroup_product', 'price_product', 'qnty_product',
        '3xl_size', 's_size', 'xs_size', '4xl_size', 'm_size', 'l_size',
        'xl_size', 'xxl_size', 'color_product', 'status_product', 
        'related_products', 'discount_product', '48_size', '50_size',
        '52_size', '54_size', '56_size', '58_size'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "`{$field}` = ?";
            $params[] = $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        echo json_encode([
            'success' => false,
            'message' => 'No valid fields to update'
        ]);
        exit;
    }
    
    // Add product ID to params for WHERE clause
    $params[] = $productId;
    
    $updateQuery = "UPDATE products SET " . implode(', ', $updateFields) . " WHERE id_product = ?";
    $updateStmt = $db->prepare($updateQuery);
    
    if ($updateStmt->execute($params)) {
        // Fetch updated product
        $selectQuery = "SELECT * FROM products WHERE id_product = ?";
        $selectStmt = $db->prepare($selectQuery);
        $selectStmt->execute([$productId]);
        $updatedProduct = $selectStmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $updatedProduct
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update product'
        ]);
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
