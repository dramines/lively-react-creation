
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Set character set to utf8mb4 for full Unicode support
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Verify key for authentication (simple security measure)
if (isset($_GET['key']) && strpos($_GET['key'], '38457') === 0) {
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $saison = isset($_GET['saison']) ? $_GET['saison'] : '';
    
    if (empty($category) || empty($saison)) {
        echo json_encode(['success' => false, 'message' => 'Category and saison parameters are required.']);
        $conn->close();
        exit;
    }
    
    // Prepare the SQL query to fetch videos by category and season
    $sql = "SELECT * FROM Videos WHERE cat_video = ? AND saison = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $category, $saison);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $videos = [];
        while ($row = $result->fetch_assoc()) {
            $videos[] = $row;
        }
        echo json_encode(['success' => true, 'videos' => $videos], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['success' => false, 'message' => 'No videos found for this category and season.']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Not Authorized.']);
}

$conn->close();
?>
