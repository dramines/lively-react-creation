<?php

header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Specify allowed methods
header('Access-Control-Allow-Headers: Content-Type'); // Specify allowed headers
header('Content-Type: application/json');

session_start();

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve input data
    $data = json_decode(file_get_contents('php://input'), true);
    $id_client = $data['id_client'] ?? null; // The client's ID
    $nom_client = $data['nom_client'] ?? null; // The new first name
    $prenom_client = $data['prenom_client'] ?? null; // The new last name
    $email_client = $data['email_client'] ?? null; // The new email
    $telephone_client = $data['telephone_client'] ?? null; // The new phone number
    $password_client = $data['password_client'] ?? null; // The new password

    // Validate the input data
    if (is_null($id_client)) {
        echo json_encode(['success' => false, 'message' => 'Client ID is required.']);
        exit;
    }

    // Prepare the SQL query
    $updates = [];
    if ($nom_client) $updates[] = "nom_client = '" . $conn->real_escape_string($nom_client) . "'";
    if ($prenom_client) $updates[] = "prenom_client = '" . $conn->real_escape_string($prenom_client) . "'";
    if ($email_client) $updates[] = "email_client = '" . $conn->real_escape_string($email_client) . "'";
    if ($telephone_client) $updates[] = "telephone_client = '" . $conn->real_escape_string($telephone_client) . "'";
    if ($password_client) {
        // Hash the password before storing it
        $hashed_password = password_hash($password_client, PASSWORD_BCRYPT);
        $updates[] = "password_client = '" . $conn->real_escape_string($hashed_password) . "'";
    }

    if (count($updates) > 0) {
        $sql = "UPDATE client SET " . implode(", ", $updates) . " WHERE id_client = " . (int)$id_client;

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'User information updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating user: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No data provided to update.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}

$conn->close();
?>
