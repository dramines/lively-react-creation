<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

require_once 'config.php';

// Function to save order to fallback text file
function saveToFallbackFile($orderData, $isSuccess = true, $errorMessage = '') {
    $fallbackFile = 'fallbackorders.txt';
    
    $timestamp = date('Y-m-d H:i:s');
    $status = $isSuccess ? 'SUCCESS' : 'FAILED';
    
    $logEntry = "\n=== ORDER LOG ===\n";
    $logEntry .= "Timestamp: {$timestamp}\n";
    $logEntry .= "Status: {$status}\n";
    
    if (!$isSuccess && $errorMessage) {
        $logEntry .= "Error: {$errorMessage}\n";
    }
    
    $logEntry .= "Customer Data:\n";
    if (isset($orderData['customer'])) {
        $customer = $orderData['customer'];
        $logEntry .= "  - Name: " . (isset($customer['prenom']) ? $customer['prenom'] : 'N/A') . " " . (isset($customer['nom']) ? $customer['nom'] : 'N/A') . "\n";
        $logEntry .= "  - Email: " . (isset($customer['email']) ? $customer['email'] : 'N/A') . "\n";
        $logEntry .= "  - Phone: " . (isset($customer['telephone']) ? $customer['telephone'] : 'N/A') . "\n";
        $logEntry .= "  - Address: " . (isset($customer['adresse']) ? $customer['adresse'] : 'N/A') . "\n";
    }
    
    $logEntry .= "Raw JSON: " . json_encode($orderData, JSON_PRETTY_PRINT) . "\n";
    $logEntry .= "===================\n\n";
    
    // Append to file (create if doesn't exist)
    file_put_contents($fallbackFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Function to send confirmation email
function sendConfirmationEmail($orderData, $orderNumber, $language = 'fr') {
    try {
        // Prepare email data
        $emailData = [
            'customer' => $orderData['customer'],
            'order' => $orderData['order'],
            'order_number' => $orderNumber,
            'language' => $language
        ];
        
        // Call email service
        $emailUrl = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/send_order_confirmation.php';
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/json',
                'content' => json_encode($emailData),
                'timeout' => 10
            ]
        ]);
        
        $result = file_get_contents($emailUrl, false, $context);
        
        if ($result !== false) {
            $response = json_decode($result, true);
            return $response && isset($response['success']) && $response['success'];
        }
        
        return false;
    } catch (Exception $e) {
        error_log("Email sending failed: " . $e->getMessage());
        return false;
    }
}

// Function to update product inventory
function updateProductInventory($db, $productId, $size, $quantity) {
    try {
        error_log("Updating inventory for product ID: $productId, size: $size, quantity: $quantity");
        
        if ($productId && $size) {
            // For products with specific sizes
            $sizeColumn = '';
            switch(strtolower($size)) {
                case 'xs': $sizeColumn = 'xs_size'; break;
                case 's': $sizeColumn = 's_size'; break;
                case 'm': $sizeColumn = 'm_size'; break;
                case 'l': $sizeColumn = 'l_size'; break;
                case 'xl': $sizeColumn = 'xl_size'; break;
                case 'xxl': $sizeColumn = 'xxl_size'; break;
                case '3xl': $sizeColumn = '3xl_size'; break;
                case '4xl': $sizeColumn = '4xl_size'; break;
                case '48': $sizeColumn = '48_size'; break;
                case '50': $sizeColumn = '50_size'; break;
                case '52': $sizeColumn = '52_size'; break;
                case '54': $sizeColumn = '54_size'; break;
                case '56': $sizeColumn = '56_size'; break;
                case '58': $sizeColumn = '58_size'; break;
                default:
                    error_log("Unknown size: $size");
                    return false;
            }
            
            // Update specific size quantity
            $updateQuery = "UPDATE products SET $sizeColumn = GREATEST(0, $sizeColumn - :quantity) WHERE id_product = :product_id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
            $updateStmt->bindParam(':product_id', $productId, PDO::PARAM_INT);
            
            if (!$updateStmt->execute()) {
                error_log("Failed to update size-specific inventory");
                return false;
            }
            
            error_log("Updated $sizeColumn for product $productId, reduced by $quantity");
        } else if ($productId) {
            // For products with general quantity only
            $updateQuery = "UPDATE products SET qnty_product = GREATEST(0, qnty_product - :quantity) WHERE id_product = :product_id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
            $updateStmt->bindParam(':product_id', $productId, PDO::PARAM_INT);
            
            if (!$updateStmt->execute()) {
                error_log("Failed to update general inventory");
                return false;
            }
            
            error_log("Updated general quantity for product $productId, reduced by $quantity");
        }
        
        return true;
    } catch (Exception $e) {
        error_log("Error updating inventory: " . $e->getMessage());
        return false;
    }
}

try {
    error_log("=== SCRIPT START ===");
    error_log("PHP Version: " . phpversion());
    error_log("Script file: " . __FILE__);
    error_log("Current working directory: " . getcwd());
    
    // Test database connection first
    error_log("=== TESTING DATABASE CONNECTION ===");
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        error_log("Database connection failed - db is null");
        throw new Exception('Database connection failed');
    }
    
    error_log("Database connection successful");
    
    // Enhanced input handling with debugging
    $rawInput = '';
    $input = null;
    
    // Log request details for debugging
    error_log("=== REQUEST DEBUG INFO ===");
    error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
    error_log("Content-Type: " . (isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : 'Not set'));
    error_log("Content-Length: " . (isset($_SERVER['CONTENT_LENGTH']) ? $_SERVER['CONTENT_LENGTH'] : 'Not set'));
    error_log("HTTP Headers: " . json_encode(getallheaders()));
    error_log("POST data: " . json_encode($_POST));
    error_log("GET data: " . json_encode($_GET));
    
    // Check request method first
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        // For testing purposes, also allow GET requests
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['test'])) {
            // Test endpoint
            echo json_encode([
                'success' => true,
                'message' => 'API endpoint is working',
                'method' => $_SERVER['REQUEST_METHOD'],
                'server_info' => [
                    'php_version' => phpversion(),
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ]);
            exit;
        }
        
        throw new Exception('Only POST requests are allowed for order creation');
    }
    
    // Try to get input from different sources
    $rawInput = file_get_contents('php://input');
    error_log("Raw input from php://input: " . $rawInput);
    
    if (!empty($rawInput)) {
        $input = json_decode($rawInput, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("JSON decode error: " . json_last_error_msg());
            throw new Exception('Invalid JSON data: ' . json_last_error_msg());
        }
    } else {
        // Fallback to POST data (for FormData or URL-encoded)
        if (isset($_POST['data'])) {
            error_log("Using FormData fallback");
            $rawInput = $_POST['data'];
            $input = json_decode($rawInput, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON in FormData: ' . json_last_error_msg());
            }
        } else if (!empty($_POST)) {
            error_log("Using direct POST data");
            $input = $_POST;
        } else {
            error_log("No input data found in any source");
            throw new Exception('No input data received. Please send JSON data in the request body.');
        }
    }
    
    if (empty($input)) {
        throw new Exception('No input data received or data is empty');
    }
    
    // Log received data for debugging
    error_log("Received data: " . json_encode($input));
    
    // Handle payment confirmation from success page
    if (isset($input['action']) && $input['action'] === 'confirm_payment') {
        error_log("=== PROCESSING PAYMENT CONFIRMATION ===");
        if (isset($input['payment_ref']) && isset($input['order_id'])) {
            try {
                // Update payment status for successful payment
                $updatePaymentQuery = "
                    UPDATE orders 
                    SET payment_status = 'paid',
                        payment_link_konnekt = :payment_ref,
                        status_order = 'confirmed',
                        date_confirmation_order = CURRENT_TIMESTAMP
                    WHERE numero_commande = :order_id
                ";
                
                $updateStmt = $db->prepare($updatePaymentQuery);
                $updateStmt->bindParam(':payment_ref', $input['payment_ref']);
                $updateStmt->bindParam(':order_id', $input['order_id']);
                $updateStmt->execute();
                
                error_log("Payment confirmation successful for order: " . $input['order_id']);
                
                // Log payment success to fallback file
                $paymentData = [
                    'payment_ref' => $input['payment_ref'],
                    'order_id' => $input['order_id'],
                    'action' => 'payment_confirmation_from_frontend'
                ];
                saveToFallbackFile($paymentData, true);
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Payment confirmed successfully'
                ]);
                exit;
                
            } catch (Exception $e) {
                error_log("Payment confirmation failed: " . $e->getMessage());
                saveToFallbackFile($input, false, "Payment confirmation failed: " . $e->getMessage());
                throw $e;
            }
        }
    }
    
    // Handle payment success callback from Konnect (original webhook handler)
    if (isset($input['payment_ref']) && isset($input['order_id']) && !isset($input['action'])) {
        error_log("=== PROCESSING PAYMENT WEBHOOK ===");
        try {
            // Update payment status for successful payment
            $updatePaymentQuery = "
                UPDATE orders 
                SET payment_status = 'paid',
                    payment_link_konnekt = :payment_ref,
                    status_order = 'confirmed',
                    date_confirmation_order = CURRENT_TIMESTAMP
                WHERE numero_commande = :order_id
            ";
            
            $updateStmt = $db->prepare($updatePaymentQuery);
            $updateStmt->bindParam(':payment_ref', $input['payment_ref']);
            $updateStmt->bindParam(':order_id', $input['order_id']);
            $updateStmt->execute();
            
            error_log("Payment webhook processed successfully for order: " . $input['order_id']);
            
            // Log payment success to fallback file
            $paymentData = [
                'payment_ref' => $input['payment_ref'],
                'order_id' => $input['order_id'],
                'action' => 'payment_success_webhook'
            ];
            saveToFallbackFile($paymentData, true);
            
            echo json_encode([
                'success' => true,
                'message' => 'Payment status updated successfully'
            ]);
            exit;
            
        } catch (Exception $e) {
            error_log("Payment webhook processing failed: " . $e->getMessage());
            saveToFallbackFile($input, false, "Payment update failed: " . $e->getMessage());
            throw $e;
        }
    }
    
    error_log("=== PROCESSING NEW ORDER ===");
    
    // Validate required fields for new order
    if (!isset($input['customer']) || !isset($input['order'])) {
        throw new Exception('Customer and order information are required');
    }
    
    $customer = $input['customer'];
    $orderData = $input['order'];
    $language = isset($input['language']) ? $input['language'] : 'fr';
    
    error_log("Customer data: " . json_encode($customer));
    error_log("Order data: " . json_encode($orderData));
    
    // Validate customer fields
    $requiredCustomerFields = ['nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'code_postal', 'pays'];
    foreach ($requiredCustomerFields as $field) {
        if (!isset($customer[$field]) || empty(trim($customer[$field]))) {
            throw new Exception("Customer field '$field' is required and cannot be empty");
        }
    }
    
    // Validate order fields
    if (!isset($orderData['items']) || empty($orderData['items'])) {
        throw new Exception('Order must contain at least one item');
    }
    
    if (!isset($orderData['total_order']) || !is_numeric($orderData['total_order'])) {
        throw new Exception('Order total is required and must be numeric');
    }
    
    // Start transaction
    error_log("=== STARTING DATABASE TRANSACTION ===");
    $db->beginTransaction();
    
    try {
        error_log("Checking if customer exists with email: " . $customer['email']);
        $checkCustomerQuery = "SELECT id_customer FROM customers WHERE email_customer = :email";
        $checkCustomerStmt = $db->prepare($checkCustomerQuery);
        $checkCustomerStmt->bindParam(':email', $customer['email']);  
        $checkCustomerStmt->execute();
        $existingCustomer = $checkCustomerStmt->fetch();
        
        if ($existingCustomer) {
            $customerId = $existingCustomer['id_customer'];
            error_log("Found existing customer with ID: " . $customerId);
            
            // Update customer information
            $updateCustomerQuery = "
                UPDATE customers 
                SET nom_customer = :nom,
                    prenom_customer = :prenom,
                    telephone_customer = :telephone,
                    adresse_customer = :adresse,
                    ville_customer = :ville,
                    code_postal_customer = :code_postal,
                    pays_customer = :pays,
                    date_modification_customer = CURRENT_TIMESTAMP
                WHERE id_customer = :id
            ";
            
            $updateCustomerStmt = $db->prepare($updateCustomerQuery);
            $updateCustomerStmt->bindParam(':nom', $customer['nom']);
            $updateCustomerStmt->bindParam(':prenom', $customer['prenom']);
            $updateCustomerStmt->bindParam(':telephone', $customer['telephone']);
            $updateCustomerStmt->bindParam(':adresse', $customer['adresse']);
            $updateCustomerStmt->bindParam(':ville', $customer['ville']);
            $updateCustomerStmt->bindParam(':code_postal', $customer['code_postal']);
            $updateCustomerStmt->bindParam(':pays', $customer['pays']);
            $updateCustomerStmt->bindParam(':id', $customerId);
            $updateCustomerStmt->execute();
            
            error_log("Updated existing customer successfully");
        } else {
            error_log("Creating new customer");
            // Insert new customer
            $insertCustomerQuery = "
                INSERT INTO customers (
                    nom_customer,
                    prenom_customer,
                    email_customer,
                    telephone_customer,
                    adresse_customer,
                    ville_customer,
                    code_postal_customer,
                    pays_customer
                ) VALUES (
                    :nom,
                    :prenom,
                    :email,
                    :telephone,
                    :adresse,
                    :ville,
                    :code_postal,
                    :pays
                )
            ";
            
            $insertCustomerStmt = $db->prepare($insertCustomerQuery);
            $insertCustomerStmt->bindParam(':nom', $customer['nom']);
            $insertCustomerStmt->bindParam(':prenom', $customer['prenom']);
            $insertCustomerStmt->bindParam(':email', $customer['email']);
            $insertCustomerStmt->bindParam(':telephone', $customer['telephone']);
            $insertCustomerStmt->bindParam(':adresse', $customer['adresse']);
            $insertCustomerStmt->bindParam(':ville', $customer['ville']);
            $insertCustomerStmt->bindParam(':code_postal', $customer['code_postal']);
            $insertCustomerStmt->bindParam(':pays', $customer['pays']);
            
            if (!$insertCustomerStmt->execute()) {
                $errorInfo = $insertCustomerStmt->errorInfo();
                error_log("Failed to insert customer. Error info: " . json_encode($errorInfo));
                throw new Exception('Failed to insert customer: ' . implode(', ', $errorInfo));
            }
            
            $customerId = $db->lastInsertId();
            error_log("Created new customer with ID: " . $customerId);
        }
        
        $timestamp = time();
        $microseconds = microtime(true);
        $randomSuffix = mt_rand(1000, 9999);
        $orderNumber = 'CMD-' . date('Y') . '-' . $customerId . $timestamp . $randomSuffix;
        
        // Ensure uniqueness by checking if order number already exists
        $maxAttempts = 10;
        $attempts = 0;
        
        while ($attempts < $maxAttempts) {
            $checkOrderQuery = "SELECT COUNT(*) as count FROM orders WHERE numero_commande = :numero_commande";
            $checkOrderStmt = $db->prepare($checkOrderQuery);
            $checkOrderStmt->bindParam(':numero_commande', $orderNumber);
            $checkOrderStmt->execute();
            $orderExists = $checkOrderStmt->fetch();
            
            if ($orderExists['count'] == 0) {
                break; // Order number is unique
            }
            
            // Generate new order number
            $randomSuffix = mt_rand(1000, 9999);
            $orderNumber = 'CMD-' . date('Y') . '-' . $customerId . time() . $randomSuffix;
            $attempts++;
            
            error_log("Order number collision detected, attempting new number: " . $orderNumber);
        }
        
        if ($attempts >= $maxAttempts) {
            throw new Exception('Unable to generate unique order number after ' . $maxAttempts . ' attempts');
        }
        
        error_log("Generated unique order number: " . $orderNumber);
        
        $sousTotal = isset($orderData['sous_total']) ? floatval($orderData['sous_total']) : 0;
        $discountAmount = isset($orderData['discount_amount']) ? floatval($orderData['discount_amount']) : 0;
        $discountPercentage = isset($orderData['discount_percentage']) ? floatval($orderData['discount_percentage']) : 0;
        $deliveryCost = isset($orderData['delivery_cost']) ? floatval($orderData['delivery_cost']) : 0;
        $totalOrder = floatval($orderData['total_order']);
        $paymentMethod = isset($orderData['payment_method']) ? $orderData['payment_method'] : 'pending';
        $notes = isset($orderData['notes']) ? $orderData['notes'] : null;
        
        // Determine order status and payment status based on payment method
        $status = 'pending';
        $paymentStatus = 'pending';
        
        if (isset($orderData['payment_method'])) {
            switch ($orderData['payment_method']) {
                case 'Cash on Delivery':
                    $status = 'pending_cash_payment';
                    $paymentStatus = 'pending_cash';
                    break;
                case 'Test Payment':
                    $status = 'confirmed';
                    $paymentStatus = 'test_payment';
                    break;
                case 'Konnect':
                default:
                    $status = 'pending';
                    $paymentStatus = 'pending';
                    break;
            }
        }
        
        error_log("Order details - Total: $totalOrder, Status: $status, Payment Method: $paymentMethod");
        
        // Insert order
        error_log("Inserting order into database");
        $insertOrderQuery = "
            INSERT INTO orders (
                id_customer,
                numero_commande,
                sous_total_order,
                discount_amount_order,
                discount_percentage_order,
                delivery_cost_order,
                total_order,
                status_order,
                payment_method,
                payment_status,
                notes_order,
                vue_par_admin
            ) VALUES (
                :customer_id,
                :numero_commande,
                :sous_total,
                :discount_amount,
                :discount_percentage,
                :delivery_cost,
                :total_order,
                :status,
                :payment_method,
                :payment_status,
                :notes,
                :vue_par_admin
            )
        ";
        
        $insertOrderStmt = $db->prepare($insertOrderQuery);
        $vueParAdmin = 0;
        $insertOrderStmt->bindParam(':customer_id', $customerId);
        $insertOrderStmt->bindParam(':numero_commande', $orderNumber);
        $insertOrderStmt->bindParam(':sous_total', $sousTotal);
        $insertOrderStmt->bindParam(':discount_amount', $discountAmount);
        $insertOrderStmt->bindParam(':discount_percentage', $discountPercentage);
        $insertOrderStmt->bindParam(':delivery_cost', $deliveryCost);
        $insertOrderStmt->bindParam(':total_order', $totalOrder);
        $insertOrderStmt->bindParam(':status', $status);
        $insertOrderStmt->bindParam(':payment_method', $paymentMethod);
        $insertOrderStmt->bindParam(':payment_status', $paymentStatus);
        $insertOrderStmt->bindParam(':notes', $notes);
        $insertOrderStmt->bindParam(':vue_par_admin', $vueParAdmin);
        
        if (!$insertOrderStmt->execute()) {
            $errorInfo = $insertOrderStmt->errorInfo();
            error_log("Failed to insert order. Error info: " . json_encode($errorInfo));
            throw new Exception('Failed to insert order: ' . implode(', ', $errorInfo));
        }
        
        $orderId = $db->lastInsertId();
        error_log("Created order with ID: " . $orderId);
        
        // Insert order items and update inventory
        error_log("Inserting " . count($orderData['items']) . " order items");
        foreach ($orderData['items'] as $index => $item) {
            if (!isset($item['nom_product']) || !isset($item['price']) || !isset($item['quantity'])) {
                throw new Exception("Item $index must have nom_product, price, and quantity");
            }
            
            $reference = isset($item['reference']) ? $item['reference'] : '';
            $size = isset($item['size']) ? $item['size'] : null;
            $color = isset($item['color']) ? $item['color'] : null;
            $quantity = intval($item['quantity']);
            $price = floatval($item['price']);
            $discount = isset($item['discount']) ? floatval($item['discount']) : 0;
            $subtotal = $quantity * $price;
            $total = $subtotal - $discount;
            $productId = isset($item['product_id']) ? intval($item['product_id']) : null;
            
            error_log("Inserting item: " . $item['nom_product'] . " (Qty: $quantity, Price: $price)");
            
            $insertItemQuery = "
                INSERT INTO order_items (
                    id_order,
                    id_product,
                    nom_product_snapshot,
                    reference_product_snapshot,
                    price_product_snapshot,
                    size_selected,
                    color_selected,
                    quantity_ordered,
                    subtotal_item,
                    discount_item,
                    total_item
                ) VALUES (
                    :order_id,
                    :product_id,
                    :nom_product,
                    :reference,
                    :price,
                    :size,
                    :color,
                    :quantity,
                    :subtotal,
                    :discount,
                    :total
                )
            ";
            
            $insertItemStmt = $db->prepare($insertItemQuery);
            $insertItemStmt->bindParam(':order_id', $orderId);
            $insertItemStmt->bindParam(':product_id', $productId);
            $insertItemStmt->bindParam(':nom_product', $item['nom_product']);
            $insertItemStmt->bindParam(':reference', $reference);
            $insertItemStmt->bindParam(':price', $price);
            $insertItemStmt->bindParam(':size', $size);
            $insertItemStmt->bindParam(':color', $color);
            $insertItemStmt->bindParam(':quantity', $quantity);
            $insertItemStmt->bindParam(':subtotal', $subtotal);
            $insertItemStmt->bindParam(':discount', $discount);
            $insertItemStmt->bindParam(':total', $total);
            
            if (!$insertItemStmt->execute()) {
                $errorInfo = $insertItemStmt->errorInfo();
                error_log("Failed to insert order item $index. Error info: " . json_encode($errorInfo));
                throw new Exception("Failed to insert order item $index: " . implode(', ', $errorInfo));
            }
            
            // UPDATE INVENTORY - New functionality
            if ($productId) {
                error_log("=== UPDATING INVENTORY ===");
                $inventoryUpdated = updateProductInventory($db, $productId, $size, $quantity);
                if (!$inventoryUpdated) {
                    error_log("Warning: Failed to update inventory for product $productId");
                    // Don't throw exception, just log warning as inventory update is not critical for order creation
                }
            }
        }
        
        if (isset($orderData['delivery_address'])) {
            error_log("Inserting delivery address");
            $delivery = $orderData['delivery_address'];
            
            $insertDeliveryQuery = "
                INSERT INTO delivery_addresses (
                    id_order,
                    nom_destinataire,
                    prenom_destinataire,
                    telephone_destinataire,
                    adresse_livraison,
                    ville_livraison,
                    code_postal_livraison,
                    pays_livraison,
                    instructions_livraison
                ) VALUES (
                    :order_id,
                    :nom,
                    :prenom,
                    :telephone,
                    :adresse,
                    :ville,
                    :code_postal,
                    :pays,
                    :instructions
                )
            ";
            
            $insertDeliveryStmt = $db->prepare($insertDeliveryQuery);
            $deliveryTelephone = isset($delivery['telephone']) ? $delivery['telephone'] : null;
            $deliveryInstructions = isset($delivery['instructions']) ? $delivery['instructions'] : null;
            
            $insertDeliveryStmt->bindParam(':order_id', $orderId);
            $insertDeliveryStmt->bindParam(':nom', $delivery['nom']);
            $insertDeliveryStmt->bindParam(':prenom', $delivery['prenom']);
            $insertDeliveryStmt->bindParam(':telephone', $deliveryTelephone);
            $insertDeliveryStmt->bindParam(':adresse', $delivery['adresse']);
            $insertDeliveryStmt->bindParam(':ville', $delivery['ville']);
            $insertDeliveryStmt->bindParam(':code_postal', $delivery['code_postal']);
            $insertDeliveryStmt->bindParam(':pays', $delivery['pays']);
            $insertDeliveryStmt->bindParam(':instructions', $deliveryInstructions);
            
            if (!$insertDeliveryStmt->execute()) {
                $errorInfo = $insertDeliveryStmt->errorInfo();
                error_log("Failed to insert delivery address. Error info: " . json_encode($errorInfo));
            }
        }
        
        error_log("=== COMMITTING TRANSACTION ===");
        $db->commit();
        
        $successData = $input;
        $successData['generated_order_id'] = $orderId;
        $successData['generated_order_number'] = $orderNumber;
        $successData['generated_customer_id'] = $customerId;
        saveToFallbackFile($successData, true);
        
        // Send confirmation email (non-blocking)
        error_log("Attempting to send confirmation email");
        $emailSent = sendConfirmationEmail($input, $orderNumber, $language);
        error_log("Email sent result: " . ($emailSent ? 'true' : 'false'));
        
        error_log("=== ORDER CREATED SUCCESSFULLY ===");
        error_log("Order ID: $orderId, Order Number: $orderNumber, Customer ID: $customerId");
        
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'order_id' => $orderId,
            'customer_id' => $customerId,
            'order_number' => $orderNumber,
            'email_sent' => $emailSent
        ]);
        
    } catch (Exception $e) {
        error_log("=== ROLLING BACK TRANSACTION ===");
        error_log("Transaction error: " . $e->getMessage());
        error_log("Error trace: " . $e->getTraceAsString());
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    // Save failed order to fallback file
    $errorData = isset($input) ? $input : ['raw_input' => $rawInput ?? 'No input', 'request_method' => $_SERVER['REQUEST_METHOD']];
    saveToFallbackFile($errorData, false, $e->getMessage());
    
    // Log error for debugging
    error_log("=== FATAL ERROR ===");
    error_log("Order creation error: " . $e->getMessage());
    error_log("Error file: " . $e->getFile());
    error_log("Error line: " . $e->getLine());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    echo json_encode([
        'success' => false,
        'message' => 'Error creating order: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'input_received' => !empty($rawInput),
            'input_length' => strlen($rawInput ?? ''),
            'content_type' => isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : 'Not set',
            'request_method' => $_SERVER['REQUEST_METHOD'],
            'raw_input_preview' => substr($rawInput ?? '', 0, 200)
        ]
    ]);
}
?>
