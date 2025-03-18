
<?php

// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start a session
session_start();

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Check for connection errors
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Database connection failed: " . $conn->connect_error]));
}

// Set MySQL connection character set to UTF-8
$conn->set_charset('utf8mb4');

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ensure the saisonsimages directory exists
    if (!file_exists('saisonsimages')) {
        mkdir('saisonsimages', 0755, true);
    }

    $name_saison = $_POST['name_saison'] ?? '';
    $havechapters_saisons = $_POST['havechapters_saisons'] ?? '0';
    $about_link = $_POST['about_link'] ?? null;
    
    // Check if input is valid
    if (empty($name_saison)) {
        die(json_encode(['success' => false, 'message' => "Invalid name_saison provided."]));
    }

    // Process photo if provided
    $imagePath = '';
    if (isset($_FILES['photo_saison']) && $_FILES['photo_saison']['error'] === UPLOAD_ERR_OK) {
        $imageTmpPath = $_FILES['photo_saison']['tmp_name'];
        $imageName = uniqid() . '_' . basename($_FILES['photo_saison']['name']);
        $imagePath = 'saisonsimages/' . $imageName;

        // Move the uploaded file to the saisonsimages directory
        if (!move_uploaded_file($imageTmpPath, $imagePath)) {
            die(json_encode(['success' => false, 'message' => "Failed to upload image."]));
        }
    } else {
        die(json_encode(['success' => false, 'message' => "No valid image file uploaded."]));
    }

    // Prepare SQL statement based on provided fields
    $sql = "INSERT INTO saisons (name_saison, photo_saison, havechapters_saisons";
    $values = "?, ?, ?";
    $types = "sss";
    $params = [$name_saison, $imagePath, $havechapters_saisons];

    // Add about_link if provided
    if (!empty($about_link)) {
        $sql .= ", about_link";
        $values .= ", ?";
        $types .= "s";
        $params[] = $about_link;
    }

    // Complete the SQL statement
    $sql .= ") VALUES (" . $values . ")";

    // Insert into the saisons table
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        $saison_id = $conn->insert_id;
        echo json_encode([
            'success' => true, 
            'message' => "Saison added successfully.", 
            'image_path' => $imagePath,
            'saison_id' => $saison_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to add saison: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => "Invalid request method. Only POST is allowed."]);
}

// Close the database connection
$conn->close();

?>
