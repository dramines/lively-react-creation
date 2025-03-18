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
    // Check if 'id_client' is provided
    $id_client = isset($_GET['id_client']) ? intval($_GET['id_client']) : null;

    // Base SQL query
    $sql = "SELECT * FROM saisons WHERE issub_saison = '0' ";

    // Modify query if id_client is provided
    if ($id_client !== null) {
        $sql = "
            SELECT saisons.* 
            FROM saisons
            JOIN user_saison_permissions ON saisons.id_saison = user_saison_permissions.id_saison
            WHERE user_saison_permissions.id_client = ?
        ";
    }

    // Prepare and execute query
    $stmt = $conn->prepare($sql);
    if ($id_client !== null) {
        $stmt->bind_param("i", $id_client);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch results
    $saisons = [];
    while ($row = $result->fetch_assoc()) {
        $saisons[] = $row;
    }

    // Return results
    echo json_encode([
        'success' => true,
        'saisons' => $saisons
    ], JSON_UNESCAPED_UNICODE);
} else {
    // Handle invalid request methods
    echo json_encode(['success' => false, 'message' => "Invalid request method. Only GET is allowed."]);
}

// Close the database connection
$conn->close();

?>
