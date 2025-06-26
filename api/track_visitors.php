
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['page_visitors'])) {
        throw new Exception('Page name is required');
    }
    
    $page_visited = $input['page_visitors'];
    $referrer = $input['referrer'] ?? 'Direct';
    $user_location = $input['user_location'] ?? [];
    
    // Enhanced visitor info extraction
    $ip_address = $user_location['ip'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $city = $user_location['city'] ?? 'Unknown';
    $country = $user_location['country'] ?? 'Unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $session_id = session_id() ?: uniqid('sess_', true);
    
    // Data validation and cleaning
    $city = trim($city);
    $country = trim($country);
    $referrer = trim($referrer);
    
    // Ensure we have valid country data
    if (empty($country) || $country === 'Unknown') {
        $country = 'Tunisia'; // Default fallback
    }
    
    // Ensure we have valid city data
    if (empty($city) || $city === 'Unknown') {
        $city = 'Tunis'; // Default city for Tunisia
    }
    
    // Skip admin pages
    if (strpos(strtolower($page_visited), 'admin') !== false) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Admin page - tracking skipped'
        ]);
        exit;
    }
    
    // Log the data being inserted for debugging
    error_log("Tracking visitor: IP={$ip_address}, Country={$country}, City={$city}, Page={$page_visited}, Referrer={$referrer}");
    
    $insertQuery = "
        INSERT INTO visitor_tracking 
        (ip_address, page_visited, referrer, user_agent, city, country, session_id) 
        VALUES (:ip_address, :page_visited, :referrer, :user_agent, :city, :country, :session_id)
    ";
    
    $stmt = $db->prepare($insertQuery);
    $stmt->bindParam(':ip_address', $ip_address);
    $stmt->bindParam(':page_visited', $page_visited);
    $stmt->bindParam(':referrer', $referrer);
    $stmt->bindParam(':user_agent', $user_agent);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':country', $country);
    $stmt->bindParam(':session_id', $session_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Visit tracked successfully',
            'data' => [
                'ip' => $ip_address,
                'city' => $city,
                'country' => $country,
                'page' => $page_visited,
                'referrer' => $referrer,
                'date' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        throw new Exception('Failed to insert visitor data into database');
    }

} catch (Exception $e) {
    error_log("Error in track_visitors.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Error tracking visit: ' . $e->getMessage()
    ]);
}
?>
