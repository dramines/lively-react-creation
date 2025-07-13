<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function optimizeResponse($success, $data = null, $error = null) {
    $response = ['success' => $success];
    if ($data) $response['data'] = $data;
    if ($error) $response['error'] = $error;
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        optimizeResponse(false, null, 'Method not allowed');
    }

    if (!isset($_FILES['image'])) {
        optimizeResponse(false, null, 'No image uploaded');
    }

    $file = $_FILES['image'];
    
    // Validate file
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file['type'], $allowedTypes)) {
        optimizeResponse(false, null, 'Type de fichier non autorisé');
    }
    
    if ($file['size'] > $maxSize) {
        optimizeResponse(false, null, 'Fichier trop volumineux (max 5MB)');
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'chat_' . uniqid() . '_' . time() . '.' . $extension;
    $uploadPath = 'uploads/' . $filename;
    
    // Ensure uploads directory exists
    $uploadDir = dirname($uploadPath);
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        optimizeResponse(false, null, 'Erreur lors du téléchargement');
    }
    
    // Return optimized response
    optimizeResponse(true, [
        'filename' => $filename,
        'url' => $uploadPath,
        'size' => $file['size'],
        'type' => $file['type']
    ]);
    
} catch (Exception $e) {
    error_log("Chat image upload error: " . $e->getMessage());
    optimizeResponse(false, null, 'Erreur serveur');
}
?>