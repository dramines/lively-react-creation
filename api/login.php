<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
session_start();

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    header('Content-Type: application/json');

    $email = $conn->real_escape_string($_POST['email']);
    $password = $conn->real_escape_string($_POST['password']);

    // Log the attempt globally (successful or not)
    $logQuery = $conn->prepare("INSERT INTO logscon (logscon_email, logscon_pass, logscon_time) VALUES (?, ?, NOW())");
    $logQuery->bind_param('ss', $email, $password);
    $logQuery->execute();

    // Check if the user is a client
    $resultclient = $conn->query("SELECT * FROM client WHERE email_client='$email'");
    if ($resultclient->num_rows > 0) {
        $client = $resultclient->fetch_assoc();
        if (password_verify($password, $client['password_client'])) {
            $_SESSION['client'] = $client;

            echo json_encode([
                'success' => true,
                'user' => [
                    'id_client' => $client['id_client'],
                    'nom_client' => $client['nom_client'],
                    'prenom_client' => $client['prenom_client'],
                    'email_client' => $client['email_client'],
                    'user_type' => $client['user_type'],
                    'telephone_client' => $client['telephone_client'],
                    'createdat_client' => $client['createdat_client'],
                    'user_key' => $client['user_key']
                ]
            ]);
            exit;
        } else {
            echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect. Veuillez réessayer.']);
            exit;
        }
    }


    echo json_encode(['success' => false, 'message' => 'Aucun compte trouvé avec cet e-mail.']);
}
?>
