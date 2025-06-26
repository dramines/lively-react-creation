
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get all newsletter subscribers
    $query = "
        SELECT 
            id_subscriber,
            email_subscriber,
            nom_subscriber,
            prenom_subscriber,
            status_subscriber,
            source_subscriber,
            date_inscription,
            date_unsubscribe,
            ip_inscription,
            preferences_subscriber
        FROM newsletter_subscribers
        ORDER BY date_inscription DESC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $subscribers = $stmt->fetchAll();
    
    // Get statistics
    $statsQuery = "
        SELECT 
            COUNT(*) as total_subscribers,
            SUM(CASE WHEN status_subscriber = 'active' THEN 1 ELSE 0 END) as active_subscribers,
            SUM(CASE WHEN status_subscriber = 'unsubscribed' THEN 1 ELSE 0 END) as unsubscribed_count,
            SUM(CASE WHEN DATE(date_inscription) = CURDATE() THEN 1 ELSE 0 END) as today_subscribers,
            SUM(CASE WHEN MONTH(date_inscription) = MONTH(CURDATE()) AND YEAR(date_inscription) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as this_month_subscribers
        FROM newsletter_subscribers
    ";
    
    $statsStmt = $db->prepare($statsQuery);
    $statsStmt->execute();
    $stats = $statsStmt->fetch();
    
    echo json_encode([
        'success' => true,
        'data' => $subscribers,
        'stats' => $stats,
        'total' => count($subscribers)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching newsletter subscribers: ' . $e->getMessage()
    ]);
}
?>
