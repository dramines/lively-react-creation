
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
    if (!isset($_POST['id_chapter']) || !isset($_POST['name_chapter'])) {
        die(json_encode(['success' => false, 'message' => "Missing required parameters."]));
    }

    $id_chapter = $_POST['id_chapter'];
    $name_chapter = $_POST['name_chapter'];

    // Start building SQL query
    $sql = "UPDATE chapters SET name_chapter = ?";
    $types = "s";
    $params = [$name_chapter];

    // Update photo if new one is provided
    $newPhotoPath = null;
    if (isset($_FILES['photo_chapter']) && $_FILES['photo_chapter']['error'] === UPLOAD_ERR_OK) {
        // Ensure the chaptersimages directory exists
        if (!file_exists('chaptersimages')) {
            mkdir('chaptersimages', 0755, true);
        }

        // Get current photo path
        $currentPhotoStmt = $conn->prepare("SELECT photo_chapter FROM chapters WHERE id_chapter = ?");
        $currentPhotoStmt->bind_param("s", $id_chapter);
        $currentPhotoStmt->execute();
        $currentPhotoResult = $currentPhotoStmt->get_result();
        $currentPhotoPath = '';
        
        if ($currentPhotoResult->num_rows > 0) {
            $row = $currentPhotoResult->fetch_assoc();
            $currentPhotoPath = $row['photo_chapter'];
        }
        $currentPhotoStmt->close();

        // Process the new photo
        $imageTmpPath = $_FILES['photo_chapter']['tmp_name'];
        $imageName = uniqid() . '_' . basename($_FILES['photo_chapter']['name']);
        $newPhotoPath = 'chaptersimages/' . $imageName;

        // Move the uploaded file
        if (!move_uploaded_file($imageTmpPath, $newPhotoPath)) {
            die(json_encode(['success' => false, 'message' => "Failed to upload image."]));
        }

        // Update the SQL query
        $sql .= ", photo_chapter = ?";
        $types .= "s";
        $params[] = $newPhotoPath;

        // Delete the old photo if it exists
        if (!empty($currentPhotoPath) && file_exists($currentPhotoPath) && $currentPhotoPath !== $newPhotoPath) {
            unlink($currentPhotoPath);
        }
    }

    // Complete the SQL query
    $sql .= " WHERE id_chapter = ?";
    $types .= "s";
    $params[] = $id_chapter;

    // Execute the update
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        $response = [
            'success' => true,
            'message' => 'Chapter updated successfully'
        ];
        
        if ($newPhotoPath) {
            $response['photo_path'] = $newPhotoPath;
        }
        
        echo json_encode($response);
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to update chapter: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => "Invalid request method. Only POST is allowed."]);
}

// Close the database connection
$conn->close();

?>
