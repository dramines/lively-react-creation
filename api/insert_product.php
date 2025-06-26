
<?php
require_once 'config.php';

// Set proper headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Handle image uploads
    $uploadDir = '../uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $imageFields = ['img_product', 'img2_product', 'img3_product', 'img4_product'];
    $uploadedImages = [];
    
    // Process image uploads
    for ($i = 1; $i <= 4; $i++) {
        $fileKey = "image$i";
        if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
            $originalName = $_FILES[$fileKey]['name'];
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            $fileName = uniqid() . '_' . time() . '.' . $extension;
            $filePath = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES[$fileKey]['tmp_name'], $filePath)) {
                $uploadedImages[$imageFields[$i-1]] = 'uploads/' . $fileName;
            }
        }
    }
    
    // Prepare all variables first to avoid bindParam reference issues
    $reference_product = $_POST['reference_product'] ?? '';
    $nom_product = $_POST['nom_product'] ?? '';
    $description_product = $_POST['description_product'] ?? '';
    $type_product = $_POST['type_product'] ?? '';
    $category_product = $_POST['category_product'] ?? '';
    $itemgroup_product = $_POST['itemgroup_product'] ?? '';
    $price_product = $_POST['price_product'] ?? 0;
    $qnty_product = $_POST['qnty_product'] ?? 0;
    
    // Size variables (only standard and formal sizes, no shoe sizes)
    $s_size = $_POST['s_size'] ?? 0;
    $m_size = $_POST['m_size'] ?? 0;
    $l_size = $_POST['l_size'] ?? 0;
    $xl_size = $_POST['xl_size'] ?? 0;
    $xxl_size = $_POST['xxl_size'] ?? 0;
    $size_3xl = $_POST['3xl_size'] ?? 0;
    $size_4xl = $_POST['4xl_size'] ?? 0;
    $xs_size = $_POST['xs_size'] ?? 0;
    
    // Number sizes (formal sizes)
    $size_48 = $_POST['48_size'] ?? 0;
    $size_50 = $_POST['50_size'] ?? 0;
    $size_52 = $_POST['52_size'] ?? 0;
    $size_54 = $_POST['54_size'] ?? 0;
    $size_56 = $_POST['56_size'] ?? 0;
    $size_58 = $_POST['58_size'] ?? 0;
    
    $color_product = $_POST['color_product'] ?? '';
    $status_product = $_POST['status_product'] ?? 'active';
    $discount_product = $_POST['discount_product'] ?? 0;
    
    // Image variables
    $img_product = $uploadedImages['img_product'] ?? null;
    $img2_product = $uploadedImages['img2_product'] ?? null;
    $img3_product = $uploadedImages['img3_product'] ?? null;
    $img4_product = $uploadedImages['img4_product'] ?? null;
    
    // Prepare SQL query - Removed shoe size columns that don't exist
    $query = "INSERT INTO products (
        reference_product, nom_product, description_product, type_product, 
        category_product, itemgroup_product, price_product, qnty_product,
        s_size, m_size, l_size, xl_size, xxl_size, `3xl_size`, `4xl_size`, xs_size,
        `48_size`, `50_size`, `52_size`, `54_size`, `56_size`, `58_size`,
        color_product, status_product, discount_product,
        img_product, img2_product, img3_product, img4_product
    ) VALUES (
        :reference_product, :nom_product, :description_product, :type_product,
        :category_product, :itemgroup_product, :price_product, :qnty_product,
        :s_size, :m_size, :l_size, :xl_size, :xxl_size, :size_3xl, :size_4xl, :xs_size,
        :size_48, :size_50, :size_52, :size_54, :size_56, :size_58,
        :color_product, :status_product, :discount_product,
        :img_product, :img2_product, :img3_product, :img4_product
    )";
    
    $stmt = $db->prepare($query);
    
    // Bind basic parameters using variables
    $stmt->bindParam(':reference_product', $reference_product);
    $stmt->bindParam(':nom_product', $nom_product);
    $stmt->bindParam(':description_product', $description_product);
    $stmt->bindParam(':type_product', $type_product);
    $stmt->bindParam(':category_product', $category_product);
    $stmt->bindParam(':itemgroup_product', $itemgroup_product);
    $stmt->bindParam(':price_product', $price_product);
    $stmt->bindParam(':qnty_product', $qnty_product);
    
    // Bind size parameters using variables
    $stmt->bindParam(':s_size', $s_size);
    $stmt->bindParam(':m_size', $m_size);
    $stmt->bindParam(':l_size', $l_size);
    $stmt->bindParam(':xl_size', $xl_size);
    $stmt->bindParam(':xxl_size', $xxl_size);
    $stmt->bindParam(':size_3xl', $size_3xl);
    $stmt->bindParam(':size_4xl', $size_4xl);
    $stmt->bindParam(':xs_size', $xs_size);
    
    // Number sizes
    $stmt->bindParam(':size_48', $size_48);
    $stmt->bindParam(':size_50', $size_50);
    $stmt->bindParam(':size_52', $size_52);
    $stmt->bindParam(':size_54', $size_54);
    $stmt->bindParam(':size_56', $size_56);
    $stmt->bindParam(':size_58', $size_58);
    
    $stmt->bindParam(':color_product', $color_product);
    $stmt->bindParam(':status_product', $status_product);
    $stmt->bindParam(':discount_product', $discount_product);
    
    // Image parameters
    $stmt->bindParam(':img_product', $img_product);
    $stmt->bindParam(':img2_product', $img2_product);
    $stmt->bindParam(':img3_product', $img3_product);
    $stmt->bindParam(':img4_product', $img4_product);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Product added successfully',
            'product_id' => $db->lastInsertId()
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        throw new Exception('Failed to insert product: ' . $errorInfo[2]);
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
} catch(Error $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Fatal Error: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?>
