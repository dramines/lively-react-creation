
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE transactions SET 
                      date = :date,
                      description = :description,
                      amount = :amount,
                      category = :category,
                      status = :status,
                      type = :type,
                      artist_supplier = :artist_supplier
                      WHERE id = :id";
            
            if (!empty($data->user_id)) {
                $query .= " AND user_id = :user_id";
            }
            
            $stmt = $db->prepare($query);
            
            // Map French field names to English database columns
            $amount = $data->montant;
            $category = $data->categorie;
            $status = $data->statut;
            $artist_supplier = $data->artiste;
            
            $stmt->bindParam(":date", $data->date);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":amount", $amount);
            $stmt->bindParam(":category", $category);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":type", $data->type);
            $stmt->bindParam(":artist_supplier", $artist_supplier);
            $stmt->bindParam(":id", $data->id);
            
            if (!empty($data->user_id)) {
                $stmt->bindParam(":user_id", $data->user_id);
            }
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Transaction updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update transaction."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update transaction. No ID provided."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
