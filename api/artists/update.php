
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE artists 
                    SET name = :name, 
                        genre = :genre, 
                        email = :email, 
                        phone = :phone,
                        address = :address,
                        bio = :bio,
                        photo = :photo,
                        social = :social,
                        updated_at = NOW()
                    WHERE id = :id AND user_id = :user_id";
            
            $stmt = $db->prepare($query);
            
            // Get values or use existing ones
            $name = isset($data->name) ? $data->name : "";
            $genre = isset($data->genre) ? $data->genre : "";
            $email = isset($data->email) ? $data->email : "";
            $phone = isset($data->phone) ? $data->phone : "";
            $address = isset($data->address) ? $data->address : "";
            $bio = isset($data->bio) ? $data->bio : "";
            $photo = isset($data->photo) ? $data->photo : "";
            
            // Handle social media as JSON
            $social = isset($data->social) ? json_encode($data->social) : json_encode([
                "instagram" => "",
                "facebook" => "",
                "twitter" => "",
                "youtube" => ""
            ]);
            
            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":genre", $genre);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":phone", $phone);
            $stmt->bindParam(":address", $address);
            $stmt->bindParam(":bio", $bio);
            $stmt->bindParam(":photo", $photo);
            $stmt->bindParam(":social", $social);
            $stmt->bindParam(":id", $data->id);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Artist updated successfully.",
                    "id" => $data->id,
                    "name" => $name,
                    "genre" => $genre,
                    "email" => $email,
                    "phone" => $phone,
                    "address" => $address,
                    "bio" => $bio,
                    "photo" => $photo,
                    "social" => json_decode($social)
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update artist."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update artist. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
