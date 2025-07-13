<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function sendOrderConfirmationEmail($orderData, $language = 'fr') {
    $to = $orderData['customer']['email'];
    
    // Set language-specific content
    if ($language === 'en') {
        $subject = "Order Confirmation - Luccy by E.Y - Order #" . $orderData['order_number'];
        $fromName = "Luccy by E.Y";
        $translations = [
            'title' => 'It\'s ordered!',
            'thank_you_message' => 'Hi ' . $orderData['customer']['prenom'] . ' – thanks for your order, we hope you enjoyed shopping with us.',
            'where' => 'Where...',
            'when' => 'When...',
            'standard_delivery' => 'Standard Delivery',
            'delivered_on' => 'Delivered on or before',
            'what_ordered' => 'What you ordered:',
            'order_number' => 'Order number:',
            'item_description' => 'Item description',
            'qty' => 'QTY:',
            'product_code' => 'Product Code:',
            'sub_total' => 'Sub Total',
            'delivery' => 'Delivery (Standard Delivery)',
            'discount' => 'Discount',
            'total' => 'Total',
            'payment_method' => 'Payment method:',
            'changed_mind' => 'Changed your mind?',
            'unable_changes' => 'We\'re not able to make changes to your order, but you do have the option to',
            'cancel_it' => 'cancel it.',
            'standard' => 'Standard',
            'cancel_within' => 'Cancel within 1 hour',
            'express' => 'Express',
            'cancel_within_15' => 'Cancel within 15 mins',
            'next_day' => 'Next-Day/Evening Next-Day Delivery',
            'cancel_within_15_next' => 'Cancel within 15 mins',
            'return_option' => 'You also have the option to return any unwanted items to us by',
            'find_out_how' => 'Find out how.',
            'delivery_updates' => 'DELIVERY & SERVICE UPDATES',
            'need_help' => 'NEED HELP?',
            'currency' => '€'
        ];
    } else {
        $subject = "Confirmation de commande - Luccy by E.Y - Commande #" . $orderData['order_number'];
        $fromName = "Luccy by E.Y";
        $translations = [
            'title' => 'C\'est commandé !',
            'thank_you_message' => 'Bonjour ' . $orderData['customer']['prenom'] . ' – merci pour votre commande, nous espérons que vous avez apprécié faire vos achats avec nous.',
            'where' => 'Où...',
            'when' => 'Quand...',
            'standard_delivery' => 'Livraison Standard',
            'delivered_on' => 'Livré le ou avant le',
            'what_ordered' => 'Ce que vous avez commandé :',
            'order_number' => 'Numéro de commande :',
            'item_description' => 'Description de l\'article',
            'qty' => 'QTÉ :',
            'product_code' => 'Code produit :',
            'sub_total' => 'Sous-total',
            'delivery' => 'Livraison (Livraison Standard)',
            'discount' => 'Remise',
            'total' => 'Total',
            'payment_method' => 'Mode de paiement :',
            'changed_mind' => 'Vous avez changé d\'avis ?',
            'unable_changes' => 'Nous ne pouvons pas apporter de modifications à votre commande, mais vous avez la possibilité de',
            'cancel_it' => 'l\'annuler.',
            'standard' => 'Standard',
            'cancel_within' => 'Annuler dans l\'heure',
            'express' => 'Express',
            'cancel_within_15' => 'Annuler dans les 15 min',
            'next_day' => 'Livraison Lendemain/Soir Lendemain',
            'cancel_within_15_next' => 'Annuler dans les 15 min',
            'return_option' => 'Vous avez également la possibilité de nous retourner tout article non désiré avant le',
            'find_out_how' => 'Découvrez comment.',
            'delivery_updates' => 'MISES À JOUR LIVRAISON & SERVICE',
            'need_help' => 'BESOIN D\'AIDE ?',
            'currency' => ' TND'
        ];
    }
    
    // Headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . $fromName . " <contact@draminesaid.com>" . "\r\n";
    $headers .= "Reply-To: contact@draminesaid.com" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Format items list
    $itemsList = '';
    $itemsTotal = 0;
    foreach ($orderData['order']['items'] as $item) {
        $itemTotal = $item['quantity'] * $item['price'];
        $itemsTotal += $itemTotal;
        
        $itemsList .= '<tr style="border-bottom: 1px solid #e5e5e5;">
            <td style="padding: 15px 0; vertical-align: top;">
                <div style="font-size: 14px; color: #333; line-height: 1.4; margin-bottom: 5px;">
                    ' . htmlspecialchars($item['nom_product']) . '
                </div>';
        
        if (!empty($item['size']) || !empty($item['color'])) {
            $details = [];
            if (!empty($item['size'])) $details[] = 'Taille: ' . htmlspecialchars($item['size']);
            if (!empty($item['color'])) $details[] = 'Couleur: ' . htmlspecialchars($item['color']);
            $itemsList .= '<div style="font-size: 12px; color: #666; margin-bottom: 3px;">' . implode(' | ', $details) . '</div>';
        }
        
        $itemsList .= '<div style="font-size: 12px; color: #666;">' . $translations['qty'] . ' ' . htmlspecialchars($item['quantity']) . '</div>';
        
        if (!empty($item['reference'])) {
            $itemsList .= '<div style="font-size: 12px; color: #666;">' . $translations['product_code'] . ' ' . htmlspecialchars($item['reference']) . '</div>';
        }
        
        $itemsList .= '</td>
            <td style="padding: 15px 0; text-align: right; vertical-align: top; width: 80px;">
                <div style="font-size: 14px; color: #333; font-weight: 500;">
                    ' . number_format($itemTotal, 2) . $translations['currency'] . '
                </div>
            </td>
        </tr>';
    }

    // Delivery address
    $deliveryAddress = '';
    $deliveryDate = '';
    if (isset($orderData['order']['delivery_address'])) {
        $delivery = $orderData['order']['delivery_address'];
        $deliveryAddress = htmlspecialchars($delivery['prenom'] . ' ' . $delivery['nom']) . '<br>' .
                          htmlspecialchars($delivery['adresse']) . '<br>' .
                          htmlspecialchars($delivery['code_postal'] . ' ' . $delivery['ville']) . '<br>' .
                          htmlspecialchars($delivery['pays']);
        
        // Calculate delivery date (5-7 business days from now)
        $deliveryDate = date('l d F Y', strtotime('+7 days'));
    } else {
        $customer = $orderData['customer'];
        $deliveryAddress = htmlspecialchars($customer['prenom'] . ' ' . $customer['nom']) . '<br>' .
                          htmlspecialchars($customer['adresse']) . '<br>' .
                          htmlspecialchars($customer['code_postal'] . ' ' . $customer['ville']) . '<br>' .
                          htmlspecialchars($customer['pays']);
        
        $deliveryDate = date('l d F Y', strtotime('+7 days'));
    }

    // Payment method display
    $paymentMethod = $orderData['order']['payment_method'] ?? 'N/A';
    if ($paymentMethod === 'Cash on Delivery') {
        $paymentMethod = $language === 'en' ? 'Cash on Delivery' : 'Paiement à la livraison';
    } elseif ($paymentMethod === 'Test Payment') {
        $paymentMethod = $language === 'en' ? 'Test Payment' : 'Paiement test';
    } else {
        $paymentMethod = $language === 'en' ? 'Card Payment' : 'Paiement par carte';
    }

    // Return date (21 days from now)
    $returnDate = date('l d F Y', strtotime('+21 days'));

    // Calculate totals
    $subTotal = $orderData['order']['sous_total'] ?? $itemsTotal;
    $deliveryCost = $orderData['order']['delivery_cost'] ?? 0;
    $discountAmount = $orderData['order']['discount_amount'] ?? 0;
    $totalAmount = $orderData['order']['total_order'];

    // Clean, ASOS-style HTML email template
    $message = '
    <!DOCTYPE html>
    <html lang="' . $language . '">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>' . $translations['title'] . '</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f5f5f5; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
            
            <!-- Header -->
            <div style="text-align: center; padding: 40px 30px 30px;">
                <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 2px;">LUCCY BY E.Y</h1>
                <h2 style="font-size: 36px; font-weight: bold; margin: 0 0 20px 0; color: #333;">' . $translations['title'] . '</h2>
                <p style="font-size: 16px; color: #666; margin: 0; line-height: 1.5;">
                    ' . $translations['thank_you_message'] . '
                </p>
            </div>

            <!-- Divider -->
            <div style="height: 1px; background: #e5e5e5; margin: 0 30px;"></div>

            <!-- Delivery Info Section -->
            <div style="padding: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0;">' . $translations['where'] . '</h3>
                            <div style="font-size: 14px; color: #666; line-height: 1.5;">
                                ' . $deliveryAddress . '
                            </div>
                        </td>
                        <td style="width: 50%; vertical-align: top;">
                            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0;">' . $translations['when'] . '</h3>
                            <div style="font-size: 14px; color: #666; line-height: 1.5;">
                                <strong>' . $translations['standard_delivery'] . '</strong><br>
                                ' . $translations['delivered_on'] . ' ' . $deliveryDate . '
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Divider -->
            <div style="height: 1px; background: #e5e5e5; margin: 0 30px;"></div>

            <!-- Order Details Section -->
            <div style="padding: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">' . $translations['what_ordered'] . '</h3>
                <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">' . $translations['order_number'] . ' ' . htmlspecialchars($orderData['order_number']) . '</p>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid #333;">
                            <th style="text-align: left; padding: 10px 0; font-size: 14px; font-weight: bold;">' . $translations['item_description'] . '</th>
                            <th style="text-align: right; padding: 10px 0; font-size: 14px; font-weight: bold; width: 80px;">' . $translations['currency'] . '</th>
                        </tr>
                    </thead>
                    <tbody>
                        ' . $itemsList . '
                    </tbody>
                </table>

                <!-- Order Totals -->
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
                    <table style="width: 100%; font-size: 14px;">
                        <tr>
                            <td style="text-align: right; padding: 5px 0;">' . $translations['sub_total'] . '</td>
                            <td style="text-align: right; padding: 5px 0; width: 80px;">' . number_format($subTotal, 2) . $translations['currency'] . '</td>
                        </tr>
                        <tr>
                            <td style="text-align: right; padding: 5px 0;">' . $translations['delivery'] . '</td>
                            <td style="text-align: right; padding: 5px 0;">' . number_format($deliveryCost, 2) . $translations['currency'] . '</td>
                        </tr>';
    
    if ($discountAmount > 0) {
        $message .= '<tr>
                            <td style="text-align: right; padding: 5px 0;">' . $translations['discount'] . '</td>
                            <td style="text-align: right; padding: 5px 0;">-' . number_format($discountAmount, 2) . $translations['currency'] . '</td>
                        </tr>';
    }
    
    $message .= '<tr style="border-top: 1px solid #333; font-weight: bold; font-size: 16px;">
                            <td style="text-align: right; padding: 10px 0;">' . $translations['total'] . '</td>
                            <td style="text-align: right; padding: 10px 0;">' . number_format($totalAmount, 2) . $translations['currency'] . '</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top: 15px; font-size: 14px; color: #666;">
                    ' . $translations['payment_method'] . ' ' . $paymentMethod . '
                </div>
            </div>

            <!-- Divider -->
            <div style="height: 1px; background: #e5e5e5; margin: 0 30px;"></div>

            <!-- Cancellation Policy -->
            <div style="padding: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0;">' . $translations['changed_mind'] . '</h3>
                <p style="font-size: 14px; color: #666; line-height: 1.5; margin: 0 0 20px 0;">
                    ' . $translations['unable_changes'] . ' <a href="#" style="color: #333; text-decoration: underline;">' . $translations['cancel_it'] . '</a>
                </p>
                
                <div style="font-size: 14px; color: #666; line-height: 1.8;">
                    <div style="margin-bottom: 10px;">
                        <strong>' . $translations['standard'] . '</strong><br>
                        ' . $translations['cancel_within'] . '
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>' . $translations['express'] . '</strong><br>
                        ' . $translations['cancel_within_15'] . '
                    </div>
                    <div style="margin-bottom: 20px;">
                        <strong>' . $translations['next_day'] . '</strong><br>
                        ' . $translations['cancel_within_15_next'] . '
                    </div>
                </div>
                
                <p style="font-size: 14px; color: #666; line-height: 1.5; margin: 0;">
                    ' . $translations['return_option'] . ' ' . $returnDate . '. 
                    <a href="#" style="color: #333; text-decoration: underline;">' . $translations['find_out_how'] . '</a>
                </p>
            </div>

            <!-- Action Buttons -->
            <div style="padding: 0 30px 30px;">
                <div style="margin-bottom: 15px;">
                    <a href="#" style="display: block; background: #333; color: white; text-align: center; padding: 15px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 1px;">
                        ' . $translations['delivery_updates'] . '
                    </a>
                </div>
                <div>
                    <a href="mailto:contact@draminesaid.com" style="display: block; background: white; color: #333; text-align: center; padding: 15px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 1px; border: 2px solid #333;">
                        ' . $translations['need_help'] . '
                    </a>
                </div>
            </div>

        </div>
    </body>
    </html>';

    if (mail($to, $subject, $message, $headers)) {
        return true;
    } else {
        return false;
    }
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!empty($input) && isset($input['customer']) && isset($input['order'])) {
        $language = isset($input['language']) ? $input['language'] : 'fr';
        
        if (sendOrderConfirmationEmail($input, $language)) {
            echo json_encode([
                'success' => true,
                'message' => $language === 'en' ? 'Confirmation email sent successfully' : 'Email de confirmation envoyé avec succès'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => $language === 'en' ? 'Error sending confirmation email' : 'Erreur lors de l\'envoi de l\'email de confirmation'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Order data required'
        ]);
    }
}
?>
