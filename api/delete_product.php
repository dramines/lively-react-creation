
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
        exit;
    }
    
    $productId = (int)$_GET['id'];
    
    // Get product images before deletion to remove files
    $query = "SELECT img_product, img2_product, img3_product, img4_product FROM products WHERE id_product = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    if (!$product) {
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
        exit;
    }
    
    // Delete the product
    $deleteQuery = "DELETE FROM products WHERE id_product = ?";
    $deleteStmt = $db->prepare($deleteQuery);
    
    if ($deleteStmt->execute([$productId])) {
        // Remove image files
        $uploadDir = '../uploads/';
        $imageFields = ['img_product', 'img2_product', 'img3_product', 'img4_product'];
        
        foreach ($imageFields as $field) {
            if (!empty($product[$field])) {
                $filePath = '../' . $product[$field];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    } else {
        throw new Exception('Failed to delete product');
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
