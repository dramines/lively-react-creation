<?php
// Allow cross-origin requests from any origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start a session (if necessary)
session_start();

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Function to create a new user_saison_request
function createUserSaisonRequest($id_user, $id_saison) {
    global $conn;

    // Check if the request already exists
    $checkStmt = $conn->prepare("SELECT id FROM user_saison_request WHERE id_user = ? AND id_saison = ?");
    $checkStmt->bind_param("ii", $id_user, $id_saison);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        echo json_encode(["error" => "Request already exists for this user and season"]);
        $checkStmt->close();
        return;
    }
    $checkStmt->close();

    // Insert new request
    $stmt = $conn->prepare("INSERT INTO user_saison_request (id_user, id_saison, created_at) VALUES (?, ?, NOW())");
    if ($stmt === false) {
        echo json_encode(["error" => "Failed to prepare the SQL query: " . $conn->error]);
        return;
    }

    $stmt->bind_param("ii", $id_user, $id_saison);
    if ($stmt->execute()) {
        // Fetch created_at timestamp
        $created_at = $conn->query("SELECT created_at FROM user_saison_request WHERE id = " . $stmt->insert_id)->fetch_assoc()['created_at'];
        echo json_encode(["success" => true, "message" => "Record added successfully", "id" => $stmt->insert_id, "created_at" => $created_at]);
    } else {
        echo json_encode(["error" => "Error adding record: " . $stmt->error]);
    }

    $stmt->close();
}

// Function to get all user_saison_requests and remove matched records
function getAllUserSaisonRequests() {
    global $conn;

    $conn->query("DELETE FROM user_saison_request WHERE EXISTS (SELECT 1 FROM user_saison_permissions WHERE user_saison_permissions.id_client = user_saison_request.id_user AND user_saison_permissions.id_saison = user_saison_request.id_saison)");

    $result = $conn->query("SELECT id, id_user, id_saison, created_at FROM user_saison_request");
    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    echo json_encode($requests);
}

// Function to get a single user_saison_request by id_user and remove matched records
function getUserSaisonRequestByIdUser($id_user) {
    global $conn;

    $stmt = $conn->prepare("DELETE FROM user_saison_request WHERE id_user = ? AND EXISTS (SELECT 1 FROM user_saison_permissions WHERE user_saison_permissions.id_client = user_saison_request.id_user AND user_saison_permissions.id_saison = user_saison_request.id_saison)");
    $stmt->bind_param("i", $id_user);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare("SELECT id, id_user, id_saison, created_at FROM user_saison_request WHERE id_user = ?");
    $stmt->bind_param("i", $id_user);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    
    echo json_encode($requests ? ["success" => true, "requests" => $requests] : ["error" => "No records found for id_user: " . $id_user]);
    $stmt->close();
}

// Function to delete a user_saison_request by id
function deleteUserSaisonRequest($id) {
    global $conn;

    $stmt = $conn->prepare("DELETE FROM user_saison_request WHERE id = ?");
    if ($stmt === false) {
        echo json_encode(["error" => "Failed to prepare the SQL query: " . $conn->error]);
        return;
    }

    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode($stmt->affected_rows > 0 ? ["success" => true, "message" => "Record deleted successfully"] : ["error" => "No record found with id: " . $id]);
    } else {
        echo json_encode(["error" => "Error deleting record: " . $stmt->error]);
    }
    $stmt->close();
}

// Handle incoming requests
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    isset($data['id_user'], $data['id_saison']) ? createUserSaisonRequest($data['id_user'], $data['id_saison']) : print json_encode(["error" => "Missing parameters"]);
} elseif ($method === 'GET') {
    isset($_GET['id_user']) ? getUserSaisonRequestByIdUser((int)$_GET['id_user']) : getAllUserSaisonRequests();
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    isset($data['id']) ? deleteUserSaisonRequest((int)$data['id']) : print json_encode(["error" => "Missing id parameter"]);
} else {
    echo json_encode(["error" => "Invalid request method"]);
}

// Close the database connection
$conn->close();
?>
