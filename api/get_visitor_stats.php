
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get today's date
    $today = date('Y-m-d');
    
    // Visitors today
    $visitorsToday = $db->prepare("
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM visitor_tracking 
        WHERE DATE(visit_date) = :today
    ");
    $visitorsToday->bindParam(':today', $today);
    $visitorsToday->execute();
    $visitorsTodayCount = $visitorsToday->fetch()['count'];
    
    // Total page views today
    $pageviewsToday = $db->prepare("
        SELECT COUNT(*) as count 
        FROM visitor_tracking 
        WHERE DATE(visit_date) = :today
    ");
    $pageviewsToday->bindParam(':today', $today);
    $pageviewsToday->execute();
    $pageviewsTodayCount = $pageviewsToday->fetch()['count'];
    
    // Average time on site (mock for now as we need session tracking)
    $avgTimeOnSite = '3m 24s';
    
    // Bounce rate calculation (visitors with only 1 page view)
    $bounceRate = $db->prepare("
        SELECT 
            (SELECT COUNT(DISTINCT ip_address) FROM visitor_tracking WHERE DATE(visit_date) = :today AND ip_address IN (
                SELECT ip_address FROM visitor_tracking WHERE DATE(visit_date) = :today2 GROUP BY ip_address HAVING COUNT(*) = 1
            )) * 100.0 / NULLIF(COUNT(DISTINCT ip_address), 0) as bounce_rate
        FROM visitor_tracking 
        WHERE DATE(visit_date) = :today3
    ");
    $bounceRate->bindParam(':today', $today);
    $bounceRate->bindParam(':today2', $today);
    $bounceRate->bindParam(':today3', $today);
    $bounceRate->execute();
    $bounceRateValue = $bounceRate->fetch()['bounce_rate'] ?? 32;
    
    // Daily visitors for last 7 days
    $dailyVisitors = [];
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $dateFormatted = date('d/m', strtotime("-$i days"));
        
        $dayStats = $db->prepare("
            SELECT 
                COUNT(DISTINCT ip_address) as visitors,
                COUNT(*) as pageviews
            FROM visitor_tracking 
            WHERE DATE(visit_date) = :date
        ");
        $dayStats->bindParam(':date', $date);
        $dayStats->execute();
        $dayData = $dayStats->fetch();
        
        $dailyVisitors[] = [
            'date' => $dateFormatted,
            'visitors' => (int)$dayData['visitors'],
            'pageviews' => (int)$dayData['pageviews'],
            'bounceRate' => rand(30, 50) // Mock bounce rate per day
        ];
    }
    
    // Top pages
    $topPages = $db->prepare("
        SELECT 
            page_visited as page,
            COUNT(DISTINCT ip_address) as visitors,
            COUNT(*) as total_visits
        FROM visitor_tracking 
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY page_visited 
        ORDER BY visitors DESC 
        LIMIT 6
    ");
    $topPages->execute();
    $topPagesList = $topPages->fetchAll();
    
    // Calculate percentages for top pages
    $totalVisitors = array_sum(array_column($topPagesList, 'visitors'));
    foreach ($topPagesList as &$page) {
        $page['percentage'] = $totalVisitors > 0 ? round(($page['visitors'] / $totalVisitors) * 100) : 0;
    }
    
    // Traffic sources
    $trafficSources = $db->prepare("
        SELECT 
            referrer as source,
            COUNT(DISTINCT ip_address) as visitors
        FROM visitor_tracking 
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND referrer IS NOT NULL
        AND referrer != ''
        GROUP BY referrer 
        ORDER BY visitors DESC 
        LIMIT 5
    ");
    $trafficSources->execute();
    $trafficSourcesList = $trafficSources->fetchAll();
    
    // Add colors to traffic sources
    $colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    foreach ($trafficSourcesList as $index => &$source) {
        $source['color'] = $colors[$index % count($colors)];
    }
    
    // Countries
    $countries = $db->prepare("
        SELECT 
            country,
            COUNT(DISTINCT ip_address) as visitors
        FROM visitor_tracking 
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND country IS NOT NULL
        AND country != ''
        GROUP BY country 
        ORDER BY visitors DESC 
        LIMIT 5
    ");
    $countries->execute();
    $countriesList = $countries->fetchAll();
    
    // Add flags to countries
    $countryFlags = [
        'France' => '🇫🇷',
        'Tunisia' => '🇹🇳',
        'United States' => '🇺🇸',
        'Belgium' => '🇧🇪',
        'Switzerland' => '🇨🇭',
        'Canada' => '🇨🇦',
        'Luxembourg' => '🇱🇺',
        'Spain' => '🇪🇸',
        'Germany' => '🇩🇪',
        'Italy' => '🇮🇹'
    ];
    
    foreach ($countriesList as &$country) {
        $country['flag'] = $countryFlags[$country['country']] ?? '🌍';
    }
    
    // Device data (mock for now)
    $deviceData = [
        ['name' => 'Desktop', 'value' => 45, 'color' => '#1f2937'],
        ['name' => 'Mobile', 'value' => 35, 'color' => '#374151'],
        ['name' => 'Tablette', 'value' => 20, 'color' => '#6b7280']
    ];
    
    // Raw visitor data - recent visits with details (increased limit and better query)
    $rawVisitorData = $db->prepare("
        SELECT 
            ip_address,
            page_visited,
            referrer,
            country,
            city,
            visit_date
        FROM visitor_tracking 
        ORDER BY visit_date DESC 
        LIMIT 100
    ");
    $rawVisitorData->execute();
    $rawVisitorsList = $rawVisitorData->fetchAll(PDO::FETCH_ASSOC);
    
    // Ensure we always return an array, even if empty
    if (!$rawVisitorsList) {
        $rawVisitorsList = [];
    }
    
    // Debug: Log the raw visitors count
    error_log("Raw visitors count: " . count($rawVisitorsList));
    
    echo json_encode([
        'success' => true,
        'data' => [
            'visitorsToday' => (int)$visitorsTodayCount,
            'pageviewsToday' => (int)$pageviewsTodayCount,
            'avgTimeOnSite' => $avgTimeOnSite,
            'bounceRate' => round($bounceRateValue),
            'dailyVisitors' => $dailyVisitors,
            'topPages' => $topPagesList,
            'trafficSources' => $trafficSourcesList,
            'countries' => $countriesList,
            'deviceData' => $deviceData,
            'rawVisitors' => $rawVisitorsList
        ]
    ]);

} catch (Exception $e) {
    error_log("Error in get_visitor_stats.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error retrieving visitor statistics: ' . $e->getMessage()
    ]);
}
?>
