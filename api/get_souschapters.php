
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

function getAllSousChaptersByChapter($id_chapter) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM sous_chapter WHERE id_chapter = ? order by id_souschapter DESC");
    $stmt->bind_param("i", $id_chapter);
    $stmt->execute();
    $result = $stmt->get_result();

    $sous_chapters = [];
    while ($row = $result->fetch_assoc()) {
        $sous_chapters[] = $row;
    }

    $stmt->close();
    
    echo json_encode($sous_chapters);
}

// Check if id_chapter is provided
if (isset($_GET['id_chapter']) && is_numeric($_GET['id_chapter'])) {
    getAllSousChaptersByChapter($_GET['id_chapter']);
} else {
    echo json_encode(['error' => 'Invalid or missing id_chapter']);
}

$conn->close();
?>
