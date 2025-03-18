

<?php
header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Specify allowed methods
header('Access-Control-Allow-Headers: Content-Type'); // Specify allowed headers
header('Content-Type: application/json');

session_start();

$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Get pagination parameters
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = ($page - 1) * $limit;
    $search = isset($_GET['search']) ? $_GET['search'] : '';

    // Build the search condition if a search term is provided
    $searchCondition = '';
    if (!empty($search)) {
        $search = $conn->real_escape_string($search);
        $searchCondition = " WHERE nom_client LIKE '%$search%' OR prenom_client LIKE '%$search%' OR email_client LIKE '%$search%' OR telephone_client LIKE '%$search%'";
    }

    // Get total count of users for pagination
    $count_sql = "SELECT COUNT(*) as total FROM client" . $searchCondition;
    $count_result = $conn->query($count_sql);
    $total_users = $count_result->fetch_assoc()['total'];
    $total_pages = ceil($total_users / $limit);

    // Select users with pagination and search
    $sql = "SELECT * FROM client" . $searchCondition . " ORDER BY id_client DESC LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $users = [];
        while ($row = $result->fetch_assoc()) {
            // Get user_saison_permissions for each user
            $user_id = $row['id_client'];
            $saison_permissions_sql = "SELECT * FROM user_saison_permissions WHERE id_client = $user_id";
            $saison_permissions_result = $conn->query($saison_permissions_sql);

            // Fetch all the user_saison_permissions
            $saison_permissions = [];
            while ($saison_row = $saison_permissions_result->fetch_assoc()) {
                $saison_permissions[] = $saison_row;
            }

            // For each permission, get related saison objects
            $saison_objects = [];
            foreach ($saison_permissions as $permission) {
                $saison_id = $permission['id_saison'];
                $saison_sql = "SELECT * FROM saisons WHERE id_saison = $saison_id";
                $saison_result = $conn->query($saison_sql);
                if ($saison_result->num_rows > 0) {
                    while ($saison_row = $saison_result->fetch_assoc()) {
                        $saison_objects[] = $saison_row;
                    }
                }
            }

            // Add user data with user_saison_permissions and related saison objects
            $users[] = [
                'user' => $row,
                'user_saison_permissions' => $saison_permissions,
                'saison_objects' => $saison_objects
            ];
        }

        echo json_encode([
            'success' => true, 
            'users' => $users,
            'pagination' => [
                'total' => $total_users,
                'total_pages' => $total_pages,
                'current_page' => $page,
                'limit' => $limit
            ]
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'users' => [],
            'pagination' => [
                'total' => $total_users,
                'total_pages' => $total_pages,
                'current_page' => $page,
                'limit' => $limit
            ]
        ]);
    }
}
?>
