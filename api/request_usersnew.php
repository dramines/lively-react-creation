<?php
// Allow cross-origin requests from any origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Display errors for debugging (Remove this in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start a session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

/**
 * Function to delete matched user requests
 * @param int|null $id_user
 */
function deleteMatchedUserRequests($id_user = null) {
    global $conn;

    $sql = "DELETE FROM user_saison_request WHERE EXISTS (
                SELECT 1 FROM user_saison_permissions 
                WHERE user_saison_permissions.id_client = user_saison_request.id_user 
                AND user_saison_permissions.id_saison = user_saison_request.id_saison)";

    if ($id_user !== null) {
        $sql .= " AND id_user = ?";
    }

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Delete prepare failed: " . $conn->error]);
        return false;
    }

    if ($id_user !== null) {
        $stmt->bind_param("i", $id_user);
    }

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["error" => "Delete execution failed: " . $stmt->error]);
        return false;
    }

    $stmt->close();
    return true;
}

/**
 * Function to get all user requests with user information
 */
function getAllUserSaisonRequests() {
    global $conn;

    // Delete matched records before fetching
    if (!deleteMatchedUserRequests()) {
        return;
    }

    // Fetch all requests with user details
$query = "SELECT usr.id, usr.id_user, usr.id_saison, usr.created_at, 
                 c.id_client, c.nom_client, c.prenom_client, c.email_client, c.telephone_client 
          FROM user_saison_request usr 
          JOIN client c ON usr.id_user = c.id_client";

    $result = $conn->query($query);

    if (!$result) {
        http_response_code(500);
        echo json_encode(["error" => "Select query failed: " . $conn->error]);
        return;
    }

    $requests = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["success" => true, "requests" => $requests]);
}

/**
 * Function to get a single user's requests with user information
 * @param int $id_user
 */
function getUserSaisonRequestByIdUser($id_user) {
    global $conn;

    // Delete matched records before fetching
    if (!deleteMatchedUserRequests($id_user)) {
        return;
    }

  // Fetch a single user's request with user details
$stmt = $conn->prepare("SELECT usr.id, usr.id_user, usr.id_saison, usr.created_at, 
                               c.id_client, c.nom_client, c.prenom_client, c.email_client, c.telephone_client 
                        FROM user_saison_request usr 
                        JOIN client c ON usr.id_user = c.id_client 
                        WHERE usr.id_user = ?");

    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Select prepare failed: " . $conn->error]);
        return;
    }

    $stmt->bind_param("i", $id_user);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["error" => "Select execution failed: " . $stmt->error]);
        return;
    }

    $result = $stmt->get_result();

    if (!$result) {
        http_response_code(500);
        echo json_encode(["error" => "Get result failed: " . $stmt->error]);
        return;
    }

    $requests = $result->fetch_all(MYSQLI_ASSOC);

    if (empty($requests)) {
        http_response_code(404);
        echo json_encode(["error" => "No records found for id_user: " . $id_user]);
    } else {
        echo json_encode(["success" => true, "requests" => $requests]);
    }

    $stmt->close();
}

function createUserSaisonRequest($id_user, $id_saison) {
    global $conn;

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

    $stmt = $conn->prepare("INSERT INTO user_saison_request (id_user, id_saison, created_at) VALUES (?, ?, NOW())");
    if ($stmt === false) {
        echo json_encode(["error" => "Failed to prepare the SQL query: " . $conn->error]);
        return;
    }

    $stmt->bind_param("ii", $id_user, $id_saison);
    if ($stmt->execute()) {
        $created_at = $conn->query("SELECT created_at FROM user_saison_request WHERE id = " . $stmt->insert_id)->fetch_assoc()['created_at'];
        echo json_encode(["success" => true, "message" => "Record added successfully", "id" => $stmt->insert_id, "created_at" => $created_at]);
    } else {
        echo json_encode(["error" => "Error adding record: " . $stmt->error]);
    }

    $stmt->close();
}


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
