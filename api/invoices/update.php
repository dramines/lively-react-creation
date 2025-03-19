
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            // Check if invoice number exists and is not this invoice's original number
            if (!empty($data->invoice_number)) {
                $check_query = "SELECT id FROM invoices WHERE invoice_number = :invoice_number AND id != :id";
                $check_stmt = $db->prepare($check_query);
                $check_stmt->bindParam(":invoice_number", $data->invoice_number);
                $check_stmt->bindParam(":id", $data->id);
                $check_stmt->execute();
                
                if ($check_stmt->rowCount() > 0) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Invoice number already exists."));
                    return;
                }
            }
            
            // Serialize items array to JSON string if provided
            $items_json = isset($data->items) ? json_encode($data->items) : null;
            
            // Build update query
            $query = "UPDATE invoices SET ";
            $params = array();
            
            if (!empty($data->invoice_number)) {
                $params[] = "invoice_number = :invoice_number";
            }
            
            if (!empty($data->client_name)) {
                $params[] = "client_name = :client_name";
            }
            
            if (!empty($data->issue_date)) {
                $params[] = "issue_date = :issue_date";
            }
            
            if (!empty($data->due_date)) {
                $params[] = "due_date = :due_date";
            }
            
            if (isset($data->items)) {
                $params[] = "items = :items";
            }
            
            if (isset($data->subtotal)) {
                $params[] = "subtotal = :subtotal";
            }
            
            if (isset($data->tax_amount)) {
                $params[] = "tax_amount = :tax_amount";
            }
            
            if (isset($data->total_amount)) {
                $params[] = "total_amount = :total_amount";
            }
            
            if (isset($data->notes)) {
                $params[] = "notes = :notes";
            }
            
            $query .= implode(", ", $params);
            $query .= " WHERE id = :id";
            
            if (!empty($data->user_id)) {
                $query .= " AND user_id = :user_id";
            }
            
            $stmt = $db->prepare($query);
            
            // Bind parameters
            if (!empty($data->invoice_number)) {
                $stmt->bindParam(":invoice_number", $data->invoice_number);
            }
            
            if (!empty($data->client_name)) {
                $stmt->bindParam(":client_name", $data->client_name);
            }
            
            if (!empty($data->issue_date)) {
                $stmt->bindParam(":issue_date", $data->issue_date);
            }
            
            if (!empty($data->due_date)) {
                $stmt->bindParam(":due_date", $data->due_date);
            }
            
            if (isset($data->items)) {
                $stmt->bindParam(":items", $items_json);
            }
            
            if (isset($data->subtotal)) {
                $stmt->bindParam(":subtotal", $data->subtotal);
            }
            
            if (isset($data->tax_amount)) {
                $stmt->bindParam(":tax_amount", $data->tax_amount);
            }
            
            if (isset($data->total_amount)) {
                $stmt->bindParam(":total_amount", $data->total_amount);
            }
            
            if (isset($data->notes)) {
                $stmt->bindParam(":notes", $data->notes);
            }
            
            $stmt->bindParam(":id", $data->id);
            
            if (!empty($data->user_id)) {
                $stmt->bindParam(":user_id", $data->user_id);
            }
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Invoice updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update invoice."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update invoice. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
