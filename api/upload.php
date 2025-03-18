
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Check connection
if ($conn->connect_error) {
    $error_message = 'Connection failed: ' . $conn->connect_error;
    error_log($error_message);
    die(json_encode(['success' => false, 'message' => $error_message]));
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $id_saison = $_POST['id_saison'] ?? null;
    $id_chapter = $_POST['id_chapter'] ?? null;
    $id_souschapter = $_POST['id_souschapter'] ?? null;
    
    error_log("Title: $title, Description: $description, Saison: $id_saison, Chapter: $id_chapter, SousChapter: $id_souschapter");

    // Ensure the directories exist
    if (!file_exists('thumbnails')) {
        mkdir('thumbnails', 0755, true);
        error_log("Created thumbnails directory.");
    }
    if (!file_exists('videos')) {
        mkdir('videos', 0755, true);
        error_log("Created videos directory.");
    }

    // Handle thumbnail upload
    if (isset($_FILES['thumbnail'])) {
        if ($_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
            $thumbnailTmpPath = $_FILES['thumbnail']['tmp_name'];
            $thumbnailName = time() . '_' . $_FILES['thumbnail']['name'];
            $thumbnailPath = 'thumbnails/' . basename($thumbnailName);

            if (!move_uploaded_file($thumbnailTmpPath, $thumbnailPath)) {
                $error_message = 'Thumbnail upload failed.';
                error_log($error_message);
                die(json_encode(['success' => false, 'message' => $error_message]));
            }
            error_log("Thumbnail uploaded successfully: $thumbnailPath");
        } else {
            $error_message = 'Thumbnail upload error: ' . $_FILES['thumbnail']['error'];
            error_log($error_message);
            die(json_encode(['success' => false, 'message' => $error_message]));
        }
    } else {
        $error_message = 'No thumbnail file was uploaded.';
        error_log($error_message);
        die(json_encode(['success' => false, 'message' => $error_message]));
    }

    // Handle video upload
    if (isset($_FILES['video'])) {
        if ($_FILES['video']['error'] === UPLOAD_ERR_OK) {
            $videoTmpPath = $_FILES['video']['tmp_name'];
            $videoName = time() . '_' . $_FILES['video']['name'];
            $videoPath = 'videos/' . basename($videoName);

            if (!move_uploaded_file($videoTmpPath, $videoPath)) {
                $error_message = 'Video upload failed.';
                error_log($error_message);
                die(json_encode(['success' => false, 'message' => $error_message]));
            }
            error_log("Video uploaded successfully: $videoPath");
        } else {
            $error_message = 'Video upload error: ' . $_FILES['video']['error'];
            error_log($error_message);
            die(json_encode(['success' => false, 'message' => $error_message]));
        }
    } else {
        $error_message = 'No video file was uploaded.';
        error_log($error_message);
        die(json_encode(['success' => false, 'message' => $error_message]));
    }

    // Insert video details into the database
    $sql = "INSERT INTO Videos (name_video, descri_video, url_video, url_thumbnail, saison, id_chapter, id_souschapter, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        $error_message = 'Prepare failed: ' . $conn->error;
        error_log($error_message);
        die(json_encode(['success' => false, 'message' => $error_message]));
    }

    $stmt->bind_param("sssssss", $title, $description, $videoPath, $thumbnailPath, $id_saison, $id_chapter, $id_souschapter);

    if ($stmt->execute()) {
        error_log('Video inserted successfully into the database.');
        echo json_encode(['success' => true, 'message' => 'Video uploaded successfully.']);
    } else {
        $error_message = 'Database insertion failed: ' . $stmt->error;
        error_log($error_message);
        echo json_encode(['success' => false, 'message' => $error_message]);
    }

    $stmt->close();
}

// Close the database connection
$conn->close();
?>
