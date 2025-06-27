
<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

require_once 'config.php';

// Start output buffering to catch any unexpected output
ob_start();

try {
    // Log the start of the script
    error_log("Admin stats API called at: " . date('Y-m-d H:i:s'));
    
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Database connection failed");
    }
    
    // Test database connection
    $test = $db->prepare("SELECT 1");
    $test->execute();
    error_log("Database connection successful");
    
    // Get today's date
    $today = date('Y-m-d');
    $startOfToday = $today . ' 00:00:00';
    $endOfToday = $today . ' 23:59:59';
    
    error_log("Processing stats for date: " . $today);
    
    // Initialize response data with defaults
    $responseData = [
        'totalProducts' => 0,
        'lowStockProducts' => 0,
        'ordersToday' => 0,
        'ordersTotal' => 0,
        'pendingOrders' => 0,
        'revenueToday' => 0.0,
        'revenueWeek' => 0.0,
        'revenueMonth' => 0.0,
        'revenueTotal' => 0.0,
        'visitorsToday' => 0,
        'visitorsTotal' => 0,
        'newsletterSubscribers' => 0,
        'deviceStats' => [],
        'countryStats' => [],
        'recentOrders' => [],
        'chartData' => [],
        'bestSellingProducts' => []
    ];
    
    // Products statistics
    try {
        $totalProducts = $db->prepare("SELECT COUNT(*) as count FROM products");
        $totalProducts->execute();
        $result = $totalProducts->fetch();
        $responseData['totalProducts'] = (int)($result['count'] ?? 0);
        error_log("Total products: " . $responseData['totalProducts']);
    } catch (Exception $e) {
        error_log("Error getting total products: " . $e->getMessage());
    }
    
    // Low stock products (simplified query)
    try {
        $lowStockQuery = "
            SELECT COUNT(*) as count FROM products p WHERE (
                (p.itemgroup_product IN ('accessoires', 'cravate', 'pochette', 'maroquinerie', 'ceinture', 'autre') AND p.qnty_product <= 2)
                OR (p.itemgroup_product NOT IN ('accessoires', 'cravate', 'pochette', 'maroquinerie', 'ceinture', 'autre') AND (
                    (p.s_size IS NOT NULL AND p.s_size <= 2 AND p.s_size > 0) OR
                    (p.m_size IS NOT NULL AND p.m_size <= 2 AND p.m_size > 0) OR
                    (p.l_size IS NOT NULL AND p.l_size <= 2 AND p.l_size > 0) OR
                    (p.xl_size IS NOT NULL AND p.xl_size <= 2 AND p.xl_size > 0) OR
                    (p.xxl_size IS NOT NULL AND p.xxl_size <= 2 AND p.xxl_size > 0)
                ))
            )
        ";
        $lowStock = $db->prepare($lowStockQuery);
        $lowStock->execute();
        $result = $lowStock->fetch();
        $responseData['lowStockProducts'] = (int)($result['count'] ?? 0);
        error_log("Low stock products: " . $responseData['lowStockProducts']);
    } catch (Exception $e) {
        error_log("Error getting low stock products: " . $e->getMessage());
    }
    
    // Orders statistics
    try {
        // Check if orders table exists
        $tableCheck = $db->prepare("SHOW TABLES LIKE 'orders'");
        $tableCheck->execute();
        if ($tableCheck->rowCount() > 0) {
            $ordersToday = $db->prepare("SELECT COUNT(*) as count FROM orders WHERE DATE(date_creation_order) = :today");
            $ordersToday->bindParam(':today', $today);
            $ordersToday->execute();
            $result = $ordersToday->fetch();
            $responseData['ordersToday'] = (int)($result['count'] ?? 0);
            
            $ordersTotal = $db->prepare("SELECT COUNT(*) as count FROM orders");
            $ordersTotal->execute();
            $result = $ordersTotal->fetch();
            $responseData['ordersTotal'] = (int)($result['count'] ?? 0);
            
            $pendingOrders = $db->prepare("SELECT COUNT(*) as count FROM orders WHERE status_order = 'pending'");
            $pendingOrders->execute();
            $result = $pendingOrders->fetch();
            $responseData['pendingOrders'] = (int)($result['count'] ?? 0);
            
            error_log("Orders - Today: " . $responseData['ordersToday'] . ", Total: " . $responseData['ordersTotal'] . ", Pending: " . $responseData['pendingOrders']);
        } else {
            error_log("Orders table does not exist");
        }
    } catch (Exception $e) {
        error_log("Error getting orders stats: " . $e->getMessage());
    }
    
    // Revenue statistics
    try {
        $revenueToday = $db->prepare("
            SELECT COALESCE(SUM(total_order), 0) as total 
            FROM orders 
            WHERE DATE(date_creation_order) = :today 
            AND payment_status = 'paid'
        ");
        $revenueToday->bindParam(':today', $today);
        $revenueToday->execute();
        $result = $revenueToday->fetch();
        $responseData['revenueToday'] = (float)($result['total'] ?? 0);
        
        $revenueTotal = $db->prepare("
            SELECT COALESCE(SUM(total_order), 0) as total 
            FROM orders 
            WHERE payment_status = 'paid'
        ");
        $revenueTotal->execute();
        $result = $revenueTotal->fetch();
        $responseData['revenueTotal'] = (float)($result['total'] ?? 0);
        
        // This week revenue
        $weekStart = date('Y-m-d', strtotime('monday this week'));
        $revenueWeek = $db->prepare("
            SELECT COALESCE(SUM(total_order), 0) as total 
            FROM orders 
            WHERE date_creation_order >= :week_start
            AND payment_status = 'paid'
        ");
        $revenueWeek->bindParam(':week_start', $weekStart);
        $revenueWeek->execute();
        $result = $revenueWeek->fetch();
        $responseData['revenueWeek'] = (float)($result['total'] ?? 0);
        
        // This month revenue
        $monthStart = date('Y-m-01');
        $revenueMonth = $db->prepare("
            SELECT COALESCE(SUM(total_order), 0) as total 
            FROM orders 
            WHERE date_creation_order >= :month_start
            AND payment_status = 'paid'
        ");
        $revenueMonth->bindParam(':month_start', $monthStart);
        $revenueMonth->execute();
        $result = $revenueMonth->fetch();
        $responseData['revenueMonth'] = (float)($result['total'] ?? 0);
        
        error_log("Revenue - Today: " . $responseData['revenueToday'] . ", Week: " . $responseData['revenueWeek'] . ", Month: " . $responseData['revenueMonth'] . ", Total: " . $responseData['revenueTotal']);
    } catch (Exception $e) {
        error_log("Error getting revenue stats: " . $e->getMessage());
    }
    
    // Visitors statistics (check if table exists)
    try {
        $tableCheck = $db->prepare("SHOW TABLES LIKE 'visitor_tracking'");
        $tableCheck->execute();
        if ($tableCheck->rowCount() > 0) {
            $visitorsToday = $db->prepare("
                SELECT COUNT(DISTINCT ip_address) as count 
                FROM visitor_tracking 
                WHERE DATE(visit_date) = :today
            ");
            $visitorsToday->bindParam(':today', $today);
            $visitorsToday->execute();
            $result = $visitorsToday->fetch();
            $responseData['visitorsToday'] = (int)($result['count'] ?? 0);
            
            $visitorsTotal = $db->prepare("SELECT COUNT(DISTINCT ip_address) as count FROM visitor_tracking");
            $visitorsTotal->execute();
            $result = $visitorsTotal->fetch();
            $responseData['visitorsTotal'] = (int)($result['count'] ?? 0);
            
            error_log("Visitors - Today: " . $responseData['visitorsToday'] . ", Total: " . $responseData['visitorsTotal']);
        } else {
            error_log("Visitor_tracking table does not exist");
        }
    } catch (Exception $e) {
        error_log("Error getting visitor stats: " . $e->getMessage());
    }
    
    // Newsletter subscribers (check if table exists)
    try {
        $tableCheck = $db->prepare("SHOW TABLES LIKE 'newsletter_subscribers'");
        $tableCheck->execute();
        if ($tableCheck->rowCount() > 0) {
            $newsletterSubscribers = $db->prepare("
                SELECT COUNT(*) as count 
                FROM newsletter_subscribers 
                WHERE status_subscriber = 'active'
            ");
            $newsletterSubscribers->execute();
            $result = $newsletterSubscribers->fetch();
            $responseData['newsletterSubscribers'] = (int)($result['count'] ?? 0);
            error_log("Newsletter subscribers: " . $responseData['newsletterSubscribers']);
        } else {
            error_log("Newsletter_subscribers table does not exist");
        }
    } catch (Exception $e) {
        error_log("Error getting newsletter stats: " . $e->getMessage());
    }
    
    // Recent orders (simplified)
    try {
        $recentOrders = $db->prepare("
            SELECT o.id_order, o.numero_commande, o.total_order, o.status_order, o.payment_status,
                   'Customer' as customer_name, o.date_creation_order
            FROM orders o
            WHERE DATE(o.date_creation_order) = :today
            ORDER BY o.date_creation_order DESC
            LIMIT 5
        ");
        $recentOrders->bindParam(':today', $today);
        $recentOrders->execute();
        $responseData['recentOrders'] = $recentOrders->fetchAll() ?: [];
        error_log("Recent orders count: " . count($responseData['recentOrders']));
    } catch (Exception $e) {
        error_log("Error getting recent orders: " . $e->getMessage());
    }
    
    // Monthly chart data (simplified)
    try {
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = date('Y-m-01', strtotime("-$i months"));
            $monthEnd = date('Y-m-t', strtotime("-$i months"));
            $monthName = date('M Y', strtotime("-$i months"));
            
            $monthOrders = $db->prepare("
                SELECT 
                    COUNT(*) as orders, 
                    COALESCE(SUM(total_order), 0) as revenue
                FROM orders o
                WHERE o.date_creation_order BETWEEN :start AND :end
                AND o.payment_status = 'paid'
            ");
            $monthOrders->bindParam(':start', $monthStart);
            $monthOrders->bindParam(':end', $monthEnd . ' 23:59:59');
            $monthOrders->execute();
            $monthData = $monthOrders->fetch();
            
            $responseData['chartData'][] = [
                'name' => $monthName,
                'orders' => (int)($monthData['orders'] ?? 0),
                'revenue' => (float)($monthData['revenue'] ?? 0),
                'visitors' => 0
            ];
        }
        error_log("Chart data points: " . count($responseData['chartData']));
    } catch (Exception $e) {
        error_log("Error getting chart data: " . $e->getMessage());
    }
    
    // Clean any output buffer content
    ob_clean();
    
    // Send successful response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $responseData,
        'debug' => [
            'timestamp' => date('Y-m-d H:i:s'),
            'today' => $today,
            'database_connected' => true
        ]
    ], JSON_PRETTY_PRINT);
    
    error_log("Admin stats API completed successfully");

} catch (Exception $e) {
    // Clean any output buffer content
    ob_clean();
    
    $errorMessage = 'Error retrieving statistics: ' . $e->getMessage();
    error_log("Admin stats API error: " . $errorMessage);
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $errorMessage,
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ], JSON_PRETTY_PRINT);
} finally {
    // End output buffering
    ob_end_flush();
}
?>
