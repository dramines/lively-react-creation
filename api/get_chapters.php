
<?php

// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8'); // Ensure UTF-8 encoding for JSON response

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

// Handle GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if 'id_saison' is provided in the request
    $id_saison = isset($_GET['id_saison']) ? $conn->real_escape_string($_GET['id_saison']) : null;

    // Construct SQL query with filtering
    $sql = "SELECT * FROM chapters";
    
    if ($id_saison !== null) { 
        $sql .= " WHERE id_saison = '$id_saison'";
    }

    $sql .= " ORDER BY id_chapter ASC";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $chapters = [];
        while ($row = $result->fetch_assoc()) {
            $chapters[] = $row; // Append each row to the chapters array
        }
        // Send the chapters data as JSON with proper encoding
        echo json_encode(['success' => true, 'chapters' => $chapters], JSON_UNESCAPED_UNICODE);
    } else {
        // If no data is found
        echo json_encode(['success' => false, 'message' => "No chapters found."]);
    }
} else {
    // Handle invalid request methods
    echo json_encode(['success' => false, 'message' => "Invalid request method. Only GET is allowed."]);
}

// Close the database connection
$conn->close();

?>
