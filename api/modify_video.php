
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    $error_message = 'Connection failed: ' . $conn->connect_error;
    error_log($error_message);
    die(json_encode(['success' => false, 'message' => $error_message]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $video_id = $_POST['video_id'] ?? '';
    $title = $_POST['title'] ?? null;
    $description = $_POST['description'] ?? null;
    $id_saison = $_POST['id_saison'] ?? null;
    $id_chapter = $_POST['id_chapter'] ?? null;
    $id_souschapter = $_POST['id_souschapter'] ?? null;
    
    if (empty($video_id)) {
        die(json_encode(['success' => false, 'message' => 'Video ID is required.']));
    }
    
    $updates = [];
    $params = [];
    $types = '';
    
    if ($title !== null) {
        $updates[] = 'name_video = ?';
        $params[] = $title;
        $types .= 's';
    }
    if ($description !== null) {
        $updates[] = 'descri_video = ?';
        $params[] = $description;
        $types .= 's';
    }
    if ($id_saison !== null) {
        $updates[] = 'id_saison = ?';
        $params[] = $id_saison;
        $types .= 's';
    }
    if ($id_chapter !== null) {
        $updates[] = 'id_chapter = ?';
        $params[] = $id_chapter;
        $types .= 's';
    }
    if ($id_souschapter !== null) {
        $updates[] = 'id_souschapter = ?';
        $params[] = $id_souschapter;
        $types .= 's';
    }
    
    if (empty($updates)) {
        die(json_encode(['success' => false, 'message' => 'No valid fields provided for update.']));
    }
    
    $sql = "UPDATE Videos SET " . implode(", ", $updates) . " WHERE id = ?";
    $params[] = $video_id;
    $types .= 'i';
    
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        $error_message = 'Prepare failed: ' . $conn->error;
        error_log($error_message);
        die(json_encode(['success' => false, 'message' => $error_message]));
    }
    
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Video updated successfully.']);
    } else {
        $error_message = 'Update failed: ' . $stmt->error;
        error_log($error_message);
        echo json_encode(['success' => false, 'message' => $error_message]);
    }
    
    $stmt->close();
}

$conn->close();
?>
