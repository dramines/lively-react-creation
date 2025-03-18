<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header('Content-Type: application/json'); // Set response content type to JSON

    // Read JSON input
    $data = json_decode(file_get_contents('php://input'), true);

    // Extract data from JSON
    $name = $data['name'];
    $email = $data['email'];
    $subject = $data['subject'];
    $message = $data['message'];

    // Recipient email address
    $to = "contact@respizenmedical.com";
    $headers = "From: " . $email . "\r\n" .
               "Reply-To: " . $email . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    $full_message = "Nom: $name\nEmail: $email\n\n$message";

    // Send the email
    if (mail($to, $subject, $full_message, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Email sent successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error sending email.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
