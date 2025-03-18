
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
    // Validate required parameters
    if (!isset($_POST['id_saison']) || !isset($_POST['name_saison'])) {
        die(json_encode(['success' => false, 'message' => "Missing required parameters."]));
    }

    $id_saison = $_POST['id_saison'];
    $name_saison = $_POST['name_saison'];
    $havechapters_saisons = $_POST['havechapters_saisons'] ?? null;
    $about_link = $_POST['about_link'] ?? null;

    // Start building SQL query
    $sql = "UPDATE saisons SET name_saison = ?";
    $types = "s";
    $params = [$name_saison];

    // Check if havechapters_saisons is set
    if ($havechapters_saisons !== null) {
        $sql .= ", havechapters_saisons = ?";
        $types .= "s";
        $params[] = $havechapters_saisons;
    }

    // Check if about_link is set
    if ($about_link !== null) {
        $sql .= ", about_link = ?";
        $types .= "s";
        $params[] = $about_link;
    }

    // Update photo if new one is provided
    $newPhotoPath = null;
    if (isset($_FILES['photo_saison']) && $_FILES['photo_saison']['error'] === UPLOAD_ERR_OK) {
        // Ensure the saisonsimages directory exists
        if (!file_exists('saisonsimages')) {
            mkdir('saisonsimages', 0755, true);
        }

        // Get current photo path
        $currentPhotoStmt = $conn->prepare("SELECT photo_saison FROM saisons WHERE id_saison = ?");
        $currentPhotoStmt->bind_param("s", $id_saison);
        $currentPhotoStmt->execute();
        $currentPhotoResult = $currentPhotoStmt->get_result();
        $currentPhotoPath = '';
        
        if ($currentPhotoResult->num_rows > 0) {
            $row = $currentPhotoResult->fetch_assoc();
            $currentPhotoPath = $row['photo_saison'];
        }
        $currentPhotoStmt->close();

        // Process the new photo
        $imageTmpPath = $_FILES['photo_saison']['tmp_name'];
        $imageName = uniqid() . '_' . basename($_FILES['photo_saison']['name']);
        $newPhotoPath = 'saisonsimages/' . $imageName;

        // Move the uploaded file
        if (!move_uploaded_file($imageTmpPath, $newPhotoPath)) {
            die(json_encode(['success' => false, 'message' => "Failed to upload image."]));
        }

        // Update the SQL query
        $sql .= ", photo_saison = ?";
        $types .= "s";
        $params[] = $newPhotoPath;

        // Delete the old photo if it exists
        if (!empty($currentPhotoPath) && file_exists($currentPhotoPath) && $currentPhotoPath !== $newPhotoPath) {
            unlink($currentPhotoPath);
        }
    }

    // Complete the SQL query
    $sql .= " WHERE id_saison = ?";
    $types .= "s";
    $params[] = $id_saison;

    // Execute the update
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        $response = [
            'success' => true,
            'message' => 'Saison updated successfully'
        ];
        
        if ($newPhotoPath) {
            $response['photo_path'] = $newPhotoPath;
        }
        
        echo json_encode($response);
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to update saison: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => "Invalid request method. Only POST is allowed."]);
}

// Close the database connection
$conn->close();

?>
