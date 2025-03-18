<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

session_start();

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => "Database connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['user_id'], $data['email_client'], $data['key'])) {
        http_response_code(400);
        die(json_encode(['success' => false, 'message' => "Missing 'user_id', 'email_client' or 'key' parameter"]));
    }

    $user_id = $conn->real_escape_string($data['user_id']);
    $email_client = $conn->real_escape_string($data['email_client']);
    $key = $conn->real_escape_string($data['key']);
    $saison_allowed = isset($data['saison_allowed']) ? $data['saison_allowed'] : null;

    if (strpos($key, '38457') === 0) {
        $stmt = $conn->prepare("UPDATE client SET user_key = ?, status_client = '1' WHERE id_client = ?");
        $stmt->bind_param("si", $key, $user_id);

        if ($stmt->execute()) {
            if ($saison_allowed && is_array($saison_allowed)) {
                // Insert each saison allowed for the user
                $insertStmt = $conn->prepare("INSERT INTO user_saison_permissions (id_client, id_saison) VALUES (?, ?)");
                foreach ($saison_allowed as $id_saison) {
                    $id_saison = $conn->real_escape_string($id_saison);
                    $insertStmt->bind_param("ii", $user_id, $id_saison);
                    if (!$insertStmt->execute()) {
                        http_response_code(500);
                        die(json_encode(['success' => false, 'message' => "Error adding saison permission: " . $insertStmt->error]));
                    }
                }
                $insertStmt->close();
            }

            $email = $email_client;

            $subject = 'Bienvenue sur notre plateforme';
            $body = '
            <html>
            <head>
                <title>Bienvenue sur notre plateforme</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
                    h1 { color: #3E80AC; }
                    .footer { font-size: 0.8em; text-align: center; margin-top: 20px; }
                </style>
            </head>
            <body>
               <div class="container">
                    <h1>Bienvenue sur notre plateforme</h1>
                    <p>Votre compte a été activé, </p>
                    <p>Nous espérons que vous apprécierez votre formation.</p>
                    <p>Merci pour votre confiance !</p>
                    <div class="footer">
                        <p>Cordialement,<br>Dramine Said</p>
                    </div>
               </div>
            </body>
            </html>';

            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8\r\n";
            $headers .= "From: contact@draminesaid.com\r\n";
            $headers .= "Reply-To: contact@draminesaid.com\r\n";

            if (mail($email, $subject, $body, $headers)) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => "User activated and email sent successfully."]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => "User activated, but email could not be sent."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => "Error activating user: " . $stmt->error]);
        }
        
        $stmt->close();
    } else {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => "Not authorized."]);
    }
}

$conn->close();
?>
