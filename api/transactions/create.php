
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->date) && !empty($data->description) && isset($data->montant) && !empty($data->type)) {
        try {
            $query = "INSERT INTO transactions (id, date, description, amount, category, status, type, artist_supplier, user_id) 
                      VALUES (UUID(), :date, :description, :amount, :category, :status, :type, :artist_supplier, :user_id)";
            
            $stmt = $db->prepare($query);
            
            // Map French field names to English database columns
            $amount = $data->montant;
            $category = property_exists($data, 'categorie') ? $data->categorie : 'autre';
            $status = property_exists($data, 'statut') ? $data->statut : 'en_attente';
            $artist_supplier = property_exists($data, 'artiste') ? $data->artiste : null;
            $user_id = property_exists($data, 'user_id') ? $data->user_id : null;
            
            $stmt->bindParam(":date", $data->date);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":amount", $amount);
            $stmt->bindParam(":category", $category);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":type", $data->type);
            $stmt->bindParam(":artist_supplier", $artist_supplier);
            $stmt->bindParam(":user_id", $user_id);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Transaction created successfully.",
                    "id" => $db->lastInsertId()
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create transaction."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create transaction. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
