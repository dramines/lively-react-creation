
<?php

// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle OPTIONS request (preflight)
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
    // Ensure the chaptersimages directory exists
    if (!file_exists('chaptersimages')) {
        mkdir('chaptersimages', 0755, true);
    }

    // Check if an image file is provided
    if (isset($_FILES['photo_chapter']) && $_FILES['photo_chapter']['error'] === UPLOAD_ERR_OK) {
        $imageTmpPath = $_FILES['photo_chapter']['tmp_name'];
        $imageName = uniqid() . '_' . basename($_FILES['photo_chapter']['name']);
        $imagePath = 'chaptersimages/' . $imageName;

        // Move the uploaded file to the chaptersimages directory
        if (!move_uploaded_file($imageTmpPath, $imagePath)) {
            die(json_encode(['success' => false, 'message' => "Failed to upload image."]));
        }

        $id_saison = $_POST['id_saison'] ?? null;
        $name_chapter = $_POST['name_chapter'] ?? '';

        // Insert into the chapters table
        if ($id_saison && !empty($name_chapter)) {
            $stmt = $conn->prepare("INSERT INTO chapters (id_saison, name_chapter, photo_chapter) VALUES (?, ?, ?)");
            $stmt->bind_param('iss', $id_saison, $name_chapter, $imagePath);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => "Chapter added successfully.", 'image_path' => $imagePath]);
            } else {
                echo json_encode(['success' => false, 'message' => "Failed to add chapter: " . $stmt->error]);
            }

            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => "Invalid id_saison or name_chapter provided."]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => "No valid image file uploaded."]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid request method. Only POST is allowed."]);
}

// Close the database connection
$conn->close();

?>
