
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['order_id'])) {
        throw new Exception('Order ID is required');
    }
    
    $orderId = $input['order_id'];
    
    // Start transaction
    $db->beginTransaction();
    
    try {
        // Delete delivery addresses first (if any)
        $deleteDeliveryQuery = "DELETE FROM delivery_addresses WHERE id_order = :order_id";
        $deleteDeliveryStmt = $db->prepare($deleteDeliveryQuery);
        $deleteDeliveryStmt->bindParam(':order_id', $orderId);
        $deleteDeliveryStmt->execute();
        
        // Delete order tracking (if any)
        $deleteTrackingQuery = "DELETE FROM order_tracking WHERE id_order = :order_id";
        $deleteTrackingStmt = $db->prepare($deleteTrackingQuery);
        $deleteTrackingStmt->bindParam(':order_id', $orderId);
        $deleteTrackingStmt->execute();
        
        // Delete order items
        $deleteItemsQuery = "DELETE FROM order_items WHERE id_order = :order_id";
        $deleteItemsStmt = $db->prepare($deleteItemsQuery);
        $deleteItemsStmt->bindParam(':order_id', $orderId);
        $deleteItemsStmt->execute();
        
        // Finally delete the order
        $deleteOrderQuery = "DELETE FROM orders WHERE id_order = :order_id";
        $deleteOrderStmt = $db->prepare($deleteOrderQuery);
        $deleteOrderStmt->bindParam(':order_id', $orderId);
        
        if ($deleteOrderStmt->execute()) {
            $db->commit();
            echo json_encode([
                'success' => true,
                'message' => 'Order deleted successfully'
            ]);
        } else {
            throw new Exception('Failed to delete order');
        }
        
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting order: ' . $e->getMessage()
    ]);
}
?>
