
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->name) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO artists (name, genre, email, phone, address, bio, photo, rehearsal_hours, total_revenue, social, user_id) 
                    VALUES (:name, :genre, :email, :phone, :address, :bio, :photo, :rehearsal_hours, :total_revenue, :social, :user_id)";
            
            $stmt = $db->prepare($query);
            
            // Get values or default to empty strings
            $name = !empty($data->name) ? $data->name : "";
            $genre = !empty($data->genre) ? $data->genre : "";
            $email = !empty($data->email) ? $data->email : "";
            $phone = !empty($data->phone) ? $data->phone : "";
            $address = !empty($data->address) ? $data->address : "";
            $bio = !empty($data->bio) ? $data->bio : "";
            $photo = !empty($data->photo) ? $data->photo : "";
            $rehearsal_hours = !empty($data->rehearsal_hours) ? $data->rehearsal_hours : 0;
            $total_revenue = !empty($data->total_revenue) ? $data->total_revenue : 0;
            
            // Handle social media as JSON
            $social = !empty($data->social) ? json_encode($data->social) : json_encode([
                "instagram" => "",
                "facebook" => "",
                "twitter" => "",
                "youtube" => ""
            ]);
            
            $user_id = !empty($data->user_id) ? $data->user_id : "";
            
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":genre", $genre);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":phone", $phone);
            $stmt->bindParam(":address", $address);
            $stmt->bindParam(":bio", $bio);
            $stmt->bindParam(":photo", $photo);
            $stmt->bindParam(":rehearsal_hours", $rehearsal_hours);
            $stmt->bindParam(":total_revenue", $total_revenue);
            $stmt->bindParam(":social", $social);
            $stmt->bindParam(":user_id", $user_id);
            
            if ($stmt->execute()) {
                $id = $db->lastInsertId();
                
                http_response_code(201);
                echo json_encode(array(
                    "message" => "Artist created successfully.", 
                    "id" => $id,
                    "name" => $name,
                    "genre" => $genre,
                    "email" => $email,
                    "phone" => $phone,
                    "address" => $address,
                    "bio" => $bio,
                    "photo" => $photo,
                    "rehearsal_hours" => $rehearsal_hours,
                    "total_revenue" => $total_revenue,
                    "social" => json_decode($social),
                    "user_id" => $user_id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array(
                    "message" => "Unable to create artist.",
                    "error" => $stmt->errorInfo()
                ));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array(
                "message" => "Database error: " . $e->getMessage(),
                "error" => $e->getMessage()
            ));
        }
    } else {
        http_response_code(400);
        echo json_encode(array(
            "message" => "Unable to create artist. Data is incomplete.",
            "data_received" => $data
        ));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
