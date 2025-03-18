<?php
// Allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Start a session
session_start();

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);
$id_client = isset($input["id_client"]) ? intval($input["id_client"]) : null;

if ($id_client) {
    // Fetch seasons for the given user ID
    $stmt = $conn->prepare("SELECT id, id_client, id_saison FROM user_saison_permissions WHERE id_client = ?");
    $stmt->bind_param("i", $id_client);
} else {
    // Fetch all seasons if no user ID is provided
    $stmt = $conn->prepare("SELECT id, id_client, id_saison FROM user_saison_permissions");
}

$stmt->execute();
$result = $stmt->get_result();
$seasons = [];

while ($row = $result->fetch_assoc()) {
    $seasons[] = $row;
}

$stmt->close();
$conn->close();

// Return JSON response
echo json_encode(["success" => true, "seasons" => $seasons]);
?>
