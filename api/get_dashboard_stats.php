
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get total revenue (chiffre d'affaires total)
    $totalRevenueQuery = "SELECT COALESCE(SUM(total_order), 0) as total_revenue FROM orders WHERE status_order != 'cancelled'";
    $totalRevenueStmt = $db->prepare($totalRevenueQuery);
    $totalRevenueStmt->execute();
    $totalRevenue = $totalRevenueStmt->fetch()['total_revenue'];
    
    // Get today's revenue (chiffre d'affaires aujourd'hui)
    $todayRevenueQuery = "SELECT COALESCE(SUM(total_order), 0) as today_revenue FROM orders WHERE DATE(date_creation_order) = CURDATE() AND status_order != 'cancelled'";
    $todayRevenueStmt = $db->prepare($todayRevenueQuery);
    $todayRevenueStmt->execute();
    $todayRevenue = $todayRevenueStmt->fetch()['today_revenue'];
    
    // Get total orders count
    $totalOrdersQuery = "SELECT COUNT(*) as total_orders FROM orders";
    $totalOrdersStmt = $db->prepare($totalOrdersQuery);
    $totalOrdersStmt->execute();
    $totalOrders = $totalOrdersStmt->fetch()['total_orders'];
    
    // Get pending orders count
    $pendingOrdersQuery = "SELECT COUNT(*) as pending_orders FROM orders WHERE status_order = 'pending'";
    $pendingOrdersStmt = $db->prepare($pendingOrdersQuery);
    $pendingOrdersStmt->execute();
    $pendingOrders = $pendingOrdersStmt->fetch()['pending_orders'];
    
    // Get total visitors (from visitor tracking)
    $totalVisitorsQuery = "SELECT COUNT(DISTINCT ip_address) as total_visitors FROM visitor_tracking";
    $totalVisitorsStmt = $db->prepare($totalVisitorsQuery);
    $totalVisitorsStmt->execute();
    $totalVisitors = $totalVisitorsStmt->fetch()['total_visitors'];
    
    // Get today's visitors
    $todayVisitorsQuery = "SELECT COUNT(DISTINCT ip_address) as today_visitors FROM visitor_tracking WHERE DATE(visit_date) = CURDATE()";
    $todayVisitorsStmt = $db->prepare($todayVisitorsQuery);
    $todayVisitorsStmt->execute();
    $todayVisitors = $todayVisitorsStmt->fetch()['today_visitors'];
    
    // Get device analytics (basic mobile/desktop detection)
    $deviceAnalyticsQuery = "
        SELECT 
            CASE 
                WHEN LOWER(user_agent) LIKE '%mobile%' OR LOWER(user_agent) LIKE '%android%' OR LOWER(user_agent) LIKE '%iphone%' THEN 'Mobile'
                WHEN LOWER(user_agent) LIKE '%tablet%' OR LOWER(user_agent) LIKE '%ipad%' THEN 'Tablet'
                ELSE 'Desktop'
            END as device_type,
            COUNT(DISTINCT ip_address) as visitors
        FROM visitor_tracking 
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY device_type
    ";
    $deviceAnalyticsStmt = $db->prepare($deviceAnalyticsQuery);
    $deviceAnalyticsStmt->execute();
    $deviceAnalytics = $deviceAnalyticsStmt->fetchAll();
    
    // Get visitor growth data (last 30 days)
    $visitorGrowthQuery = "
        SELECT 
            DATE(visit_date) as date,
            COUNT(DISTINCT ip_address) as visitors
        FROM visitor_tracking 
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(visit_date)
        ORDER BY date ASC
    ";
    $visitorGrowthStmt = $db->prepare($visitorGrowthQuery);
    $visitorGrowthStmt->execute();
    $visitorGrowth = $visitorGrowthStmt->fetchAll();
    
    // Get revenue growth data (last 30 days)
    $revenueGrowthQuery = "
        SELECT 
            DATE(date_creation_order) as date,
            COALESCE(SUM(total_order), 0) as revenue
        FROM orders 
        WHERE date_creation_order >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND status_order != 'cancelled'
        GROUP BY DATE(date_creation_order)
        ORDER BY date ASC
    ";
    $revenueGrowthStmt = $db->prepare($revenueGrowthQuery);
    $revenueGrowthStmt->execute();
    $revenueGrowth = $revenueGrowthStmt->fetchAll();
    
    // Get top countries (visitors)
    $topCountriesQuery = "
        SELECT 
            country,
            COUNT(DISTINCT ip_address) as visitors
        FROM visitor_tracking 
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT 5
    ";
    $topCountriesStmt = $db->prepare($topCountriesQuery);
    $topCountriesStmt->execute();
    $topCountries = $topCountriesStmt->fetchAll();
    
    // Get latest orders (last 5)
    $latestOrdersQuery = "
        SELECT 
            o.id_order,
            o.numero_commande,
            o.total_order,
            o.status_order,
            o.date_creation_order,
            c.nom_customer,
            c.prenom_customer
        FROM orders o
        JOIN customers c ON o.id_customer = c.id_customer
        ORDER BY o.date_creation_order DESC
        LIMIT 5
    ";
    $latestOrdersStmt = $db->prepare($latestOrdersQuery);
    $latestOrdersStmt->execute();
    $latestOrders = $latestOrdersStmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'total_revenue' => floatval($totalRevenue),
            'today_revenue' => floatval($todayRevenue),
            'total_orders' => intval($totalOrders),
            'pending_orders' => intval($pendingOrders),
            'total_visitors' => intval($totalVisitors),
            'today_visitors' => intval($todayVisitors),
            'device_analytics' => $deviceAnalytics,
            'visitor_growth' => $visitorGrowth,
            'revenue_growth' => $revenueGrowth,
            'top_countries' => $topCountries,
            'latest_orders' => $latestOrders
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching dashboard stats: ' . $e->getMessage()
    ]);
}
?>
