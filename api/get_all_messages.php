
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get query parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $vue_filter = isset($_GET['vue_filter']) ? $_GET['vue_filter'] : 'all';
    
    $offset = ($page - 1) * $limit;
    
    // Build WHERE clause
    $where_conditions = [];
    $params = [];
    
    if (!empty($search)) {
        $where_conditions[] = "(nom_client LIKE :search OR email_client LIKE :search OR message_client LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }
    
    if ($vue_filter === 'vue') {
        $where_conditions[] = "vue_par_admin = 1";
    } elseif ($vue_filter === 'not_vue') {
        $where_conditions[] = "vue_par_admin = 0";
    }
    
    $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM messages $where_clause";
    $count_stmt = $db->prepare($count_sql);
    foreach ($params as $key => $value) {
        $count_stmt->bindValue($key, $value);
    }
    $count_stmt->execute();
    $total_records = $count_stmt->fetch()['total'];
    
    // Get messages with pagination
    $sql = "SELECT 
                id_message,
                nom_client,
                email_client,
                telephone_client,
                message_client,
                vue_par_admin,
                date_vue_admin,
                date_creation
            FROM messages 
            $where_clause
            ORDER BY date_creation DESC 
            LIMIT :limit OFFSET :offset";
    
    $stmt = $db->prepare($sql);
    
    // Bind search and filter parameters
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    // Bind pagination parameters
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $messages = $stmt->fetchAll();
    
    // Calculate pagination info
    $total_pages = ceil($total_records / $limit);
    
    echo json_encode([
        'success' => true,
        'data' => $messages,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $total_pages,
            'total_records' => $total_records,
            'per_page' => $limit,
            'has_next' => $page < $total_pages,
            'has_prev' => $page > 1
        ]
    ]);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
