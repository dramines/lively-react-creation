
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
    
    // Get current vue status
    $getCurrentQuery = "SELECT vue_par_admin FROM orders WHERE id_order = :order_id";
    $getCurrentStmt = $db->prepare($getCurrentQuery);
    $getCurrentStmt->bindParam(':order_id', $orderId);
    $getCurrentStmt->execute();
    $currentStatus = $getCurrentStmt->fetch();
    
    if (!$currentStatus) {
        throw new Exception('Order not found');
    }
    
    // Toggle the vue status
    $newStatus = $currentStatus['vue_par_admin'] ? 0 : 1;
    $dateVueAdmin = $newStatus ? date('Y-m-d H:i:s') : null;
    
    $updateQuery = "
        UPDATE orders 
        SET vue_par_admin = :vue_status,
            date_vue_admin = :date_vue_admin
        WHERE id_order = :order_id
    ";
    
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':vue_status', $newStatus);
    $updateStmt->bindParam(':date_vue_admin', $dateVueAdmin);
    $updateStmt->bindParam(':order_id', $orderId);
    
    if ($updateStmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Order view status updated successfully',
            'new_status' => $newStatus
        ]);
    } else {
        throw new Exception('Failed to update order view status');
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error updating order view status: ' . $e->getMessage()
    ]);
}
?>
