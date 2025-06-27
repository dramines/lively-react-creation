
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get all customers with their order statistics
    $query = "
        SELECT 
            c.id_customer,
            c.nom_customer,
            c.prenom_customer,
            c.email_customer,
            c.telephone_customer,
            c.adresse_customer,
            c.ville_customer,
            c.code_postal_customer,
            c.pays_customer,
            c.date_creation_customer,
            c.date_modification_customer,
            
            -- Order statistics
            COUNT(o.id_order) as total_orders,
            COALESCE(SUM(o.total_order), 0) as total_spent,
            MAX(o.date_creation_order) as last_order_date
            
        FROM customers c
        LEFT JOIN orders o ON c.id_customer = o.id_customer
        GROUP BY c.id_customer
        ORDER BY c.date_creation_customer DESC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $customers = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $customers,
        'total' => count($customers)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching customers: ' . $e->getMessage()
    ]);
}
?>
