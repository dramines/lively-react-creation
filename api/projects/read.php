
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT p.*, a.name as artist_name FROM projects p
                  LEFT JOIN artists a ON p.artist_id = a.id";
                  
        // Filter by user_id
        if (isset($_GET['user_id'])) {
            $query .= " WHERE p.user_id = :user_id";
            
            // Additional filter by artist_id if provided
            if (isset($_GET['artist_id'])) {
                $query .= " AND p.artist_id = :artist_id";
            }
        } else if (isset($_GET['artist_id'])) {
            // Only filter by artist_id if provided
            $query .= " WHERE p.artist_id = :artist_id";
        }
        
        $query .= " ORDER BY p.created_at DESC";
        
        $stmt = $db->prepare($query);
        
        // Bind parameters if provided
        if (isset($_GET['user_id'])) {
            $stmt->bindParam(":user_id", $_GET['user_id']);
        }
        
        if (isset($_GET['artist_id'])) {
            $stmt->bindParam(":artist_id", $_GET['artist_id']);
        }
        
        $stmt->execute();
        
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get tasks for each project
        foreach ($projects as &$project) {
            $tasksQuery = "SELECT * FROM project_tasks WHERE project_id = :project_id ORDER BY created_at DESC";
            $tasksStmt = $db->prepare($tasksQuery);
            $tasksStmt->bindParam(":project_id", $project['id']);
            $tasksStmt->execute();
            
            $project['tasks'] = $tasksStmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        http_response_code(200);
        echo json_encode($projects);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
