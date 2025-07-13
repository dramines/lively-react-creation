
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $orderId = $_GET['id'] ?? null;
    
    if (!$orderId) {
        throw new Exception('Order ID is required');
    }
    
    // Get order details - check if it's an order ID (numeric) or order number (starts with CMD-)
    $isOrderNumber = strpos($orderId, 'CMD-') === 0;
    
    $query = "
        SELECT 
            o.id_order,
            o.numero_commande,
            o.sous_total_order,
            o.discount_amount_order,
            o.discount_percentage_order,
            o.delivery_cost_order,
            o.total_order,
            o.status_order,
            o.date_livraison_souhaitee,
            o.payment_status,
            o.payment_method,
            o.notes_order,
            o.vue_par_admin,
            o.date_vue_admin,
            o.date_creation_order,
            o.date_confirmation_order,
            o.date_livraison_order,
            
            -- Customer information
            c.nom_customer,
            c.prenom_customer,
            c.email_customer,
            c.telephone_customer,
            c.adresse_customer,
            c.ville_customer,
            c.code_postal_customer,
            c.pays_customer
            
        FROM orders o
        JOIN customers c ON o.id_customer = c.id_customer
        WHERE " . ($isOrderNumber ? "o.numero_commande = :order_id" : "o.id_order = :order_id") . "
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':order_id', $orderId);
    $stmt->execute();
    $order = $stmt->fetch();
    
    if (!$order) {
        throw new Exception('Order not found');
    }
    
    // Get the actual order ID for fetching items and delivery address
    $actualOrderId = $order['id_order'];
    
    // Get order items using the actual order ID
    $itemsQuery = "
        SELECT 
            oi.id_order_item,
            oi.nom_product_snapshot,
            oi.reference_product_snapshot,
            oi.price_product_snapshot,
            oi.size_selected,
            oi.color_selected,
            oi.quantity_ordered,
            oi.subtotal_item,
            oi.discount_item,
            oi.total_item,
            p.img_product
        FROM order_items oi
        LEFT JOIN products p ON oi.id_product = p.id_product
        WHERE oi.id_order = :actual_order_id
    ";
    
    $itemsStmt = $db->prepare($itemsQuery);
    $itemsStmt->bindParam(':actual_order_id', $actualOrderId);
    $itemsStmt->execute();
    $items = $itemsStmt->fetchAll();
    
    // Get delivery address if exists using the actual order ID
    $deliveryQuery = "
        SELECT 
            nom_destinataire,
            prenom_destinataire,
            telephone_destinataire,
            adresse_livraison,
            ville_livraison,
            code_postal_livraison,
            pays_livraison,
            instructions_livraison
        FROM delivery_addresses
        WHERE id_order = :actual_order_id
    ";
    
    $deliveryStmt = $db->prepare($deliveryQuery);
    $deliveryStmt->bindParam(':actual_order_id', $actualOrderId);
    $deliveryStmt->execute();
    $deliveryAddress = $deliveryStmt->fetch();
    
    // Format the response to match the frontend interface
    $response = [
        'id_order' => (int)$order['id_order'],
        'numero_commande' => $order['numero_commande'],
        'date_creation_order' => $order['date_creation_order'],
        'sous_total_order' => (float)$order['sous_total_order'],
        'discount_amount_order' => (float)$order['discount_amount_order'],
        'discount_percentage_order' => (float)$order['discount_percentage_order'],
        'delivery_cost_order' => (float)$order['delivery_cost_order'],
        'total_order' => (float)$order['total_order'],
        'status_order' => $order['status_order'],
        'payment_method' => $order['payment_method'],
        'notes_order' => $order['notes_order'],
        'date_livraison_souhaitee' => $order['date_livraison_souhaitee'],
        'customer' => [
            'nom' => $order['nom_customer'],
            'prenom' => $order['prenom_customer'],
            'email' => $order['email_customer'],
            'telephone' => $order['telephone_customer'],
            'adresse' => $order['adresse_customer'],
            'ville' => $order['ville_customer'],
            'code_postal' => $order['code_postal_customer'],
            'pays' => $order['pays_customer']
        ],
        'items' => $items,
        'delivery_address' => $deliveryAddress ?: null
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $response
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching order details: ' . $e->getMessage()
    ]);
}
?>
