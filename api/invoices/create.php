
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    // Log received data for debugging
    error_log("Received data: " . print_r($data, true));
    
    if (!empty($data->numeroFacture) && !empty($data->clientName) && 
        !empty($data->dateFacture) && !empty($data->dateEcheance)) {
        
        try {
            // Check if invoice number already exists
            $check_query = "SELECT id FROM invoices WHERE invoice_number = :invoice_number";
            $check_stmt = $db->prepare($check_query);
            $check_stmt->bindParam(":invoice_number", $data->numeroFacture);
            $check_stmt->execute();
            
            if ($check_stmt->rowCount() > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "Invoice number already exists."));
                return;
            }
            
            // Map frontend field names to database column names
            $invoice_number = $data->numeroFacture;
            $client_name = $data->clientName;
            $issue_date = $data->dateFacture;
            $due_date = $data->dateEcheance;
            $subtotal = $data->montantHT;
            $tax_amount = $data->montantTVA;
            $total_amount = $data->total;
            $notes = property_exists($data, 'notes') ? $data->notes : '';
            $user_id = property_exists($data, 'user_id') ? $data->user_id : null;
            
            // Ensure items is an array before serializing
            if (!property_exists($data, 'items') || !is_array($data->items)) {
                $items_json = json_encode([]);
                error_log("Warning: Items property is missing or not an array");
            } else {
                $items_json = json_encode($data->items);
            }
            
            $query = "INSERT INTO invoices (id, invoice_number, client_name, issue_date, due_date, 
                                          items, subtotal, tax_amount, total_amount, notes, user_id) 
                      VALUES (UUID(), :invoice_number, :client_name, :issue_date, :due_date, 
                             :items, :subtotal, :tax_amount, :total_amount, :notes, :user_id)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":invoice_number", $invoice_number);
            $stmt->bindParam(":client_name", $client_name);
            $stmt->bindParam(":issue_date", $issue_date);
            $stmt->bindParam(":due_date", $due_date);
            $stmt->bindParam(":items", $items_json);
            $stmt->bindParam(":subtotal", $subtotal);
            $stmt->bindParam(":tax_amount", $tax_amount);
            $stmt->bindParam(":total_amount", $total_amount);
            $stmt->bindParam(":notes", $notes);
            $stmt->bindParam(":user_id", $user_id);
            
            if ($stmt->execute()) {
                $invoice_id = $db->lastInsertId();
                
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Invoice created successfully.",
                    "id" => $invoice_id
                ));
            } else {
                error_log("SQL Error: " . implode(", ", $stmt->errorInfo()));
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create invoice."));
            }
        } catch(PDOException $e) {
            error_log("PDO Exception: " . $e->getMessage());
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        $missing = [];
        if (empty($data->numeroFacture)) $missing[] = "numeroFacture";
        if (empty($data->clientName)) $missing[] = "clientName";
        if (empty($data->dateFacture)) $missing[] = "dateFacture";
        if (empty($data->dateEcheance)) $missing[] = "dateEcheance";
        
        http_response_code(400);
        echo json_encode(array(
            "message" => "Unable to create invoice. Data is incomplete.",
            "missing_fields" => $missing
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
