
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['order_id']) || !isset($input['status'])) {
        throw new Exception('Order ID and status are required');
    }
    
    $orderId = $input['order_id'];
    $newStatus = $input['status'];
    $notes = isset($input['notes']) ? $input['notes'] : null;
    
    // Validate status
    $validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!in_array($newStatus, $validStatuses)) {
        throw new Exception('Invalid status');
    }
    
    // Start transaction
    $db->beginTransaction();
    
    try {
        // Get current status for tracking
        $getCurrentQuery = "SELECT status_order FROM orders WHERE id_order = :order_id";
        $getCurrentStmt = $db->prepare($getCurrentQuery);
        $getCurrentStmt->bindParam(':order_id', $orderId);
        $getCurrentStmt->execute();
        $currentOrder = $getCurrentStmt->fetch();
        
        if (!$currentOrder) {
            throw new Exception('Order not found');
        }
        
        $previousStatus = $currentOrder['status_order'];
        
        // Update order status
        $updateQuery = "
            UPDATE orders 
            SET status_order = :status,
                date_modification_order = CURRENT_TIMESTAMP";
        
        // Add confirmation date if status is confirmed
        if ($newStatus === 'confirmed') {
            $updateQuery .= ", date_confirmation_order = CURRENT_TIMESTAMP";
        }
        
        // Add delivery date if status is delivered
        if ($newStatus === 'delivered') {
            $updateQuery .= ", date_livraison_order = CURRENT_TIMESTAMP";
        }
        
        $updateQuery .= " WHERE id_order = :order_id";
        
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':status', $newStatus);
        $updateStmt->bindParam(':order_id', $orderId);
        
        if (!$updateStmt->execute()) {
            throw new Exception('Failed to update order status');
        }
        
        // Add tracking entry
        $trackingQuery = "
            INSERT INTO order_tracking (
                id_order,
                status_previous,
                status_new,
                notes_tracking,
                date_tracking
            ) VALUES (
                :order_id,
                :previous_status,
                :new_status,
                :notes,
                CURRENT_TIMESTAMP
            )
        ";
        
        $trackingStmt = $db->prepare($trackingQuery);
        $trackingStmt->bindParam(':order_id', $orderId);
        $trackingStmt->bindParam(':previous_status', $previousStatus);
        $trackingStmt->bindParam(':new_status', $newStatus);
        $trackingStmt->bindParam(':notes', $notes);
        
        if (!$trackingStmt->execute()) {
            throw new Exception('Failed to add tracking entry');
        }
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Order status updated successfully',
            'previous_status' => $previousStatus,
            'new_status' => $newStatus
        ]);
        
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error updating order status: ' . $e->getMessage()
    ]);
}
?>
