-- Create products table with all specified fields
CREATE TABLE IF NOT EXISTS `products` (
  `id_product` int(11) NOT NULL AUTO_INCREMENT,
  `reference_product` varchar(100) NOT NULL,
  `nom_product` varchar(255) NOT NULL,
  `img_product` varchar(500) DEFAULT NULL,
  `img2_product` varchar(500) DEFAULT NULL,
  `img3_product` varchar(500) DEFAULT NULL,
  `img4_product` varchar(500) DEFAULT NULL,
  `description_product` text,
  `type_product` varchar(100) DEFAULT NULL,
  `category_product` varchar(100) DEFAULT NULL,
  `itemgroup_product` varchar(100) DEFAULT NULL,
  `price_product` decimal(10,2) NOT NULL,
  `qnty_product` int(11) DEFAULT 0,
  `3xl_size` int(11) DEFAULT 0,
  `s_size` int(11) DEFAULT 0,
  `xs_size` int(11) DEFAULT 0,
  `4xl_size` int(11) DEFAULT 0,
  `m_size` int(11) DEFAULT 0,
  `l_size` int(11) DEFAULT 0,
  `xl_size` int(11) DEFAULT 0,
  `xxl_size` int(11) DEFAULT 0,
  `color_product` varchar(100) DEFAULT NULL,
  `status_product` enum('active','inactive','draft') DEFAULT 'active',
  `related_products` text,
  `discount_product` decimal(5,2) DEFAULT 0.00,
  `createdate_product` timestamp DEFAULT CURRENT_TIMESTAMP,
  `48_size` int(11) DEFAULT 0,
  `50_size` int(11) DEFAULT 0,
  `52_size` int(11) DEFAULT 0,
  `54_size` int(11) DEFAULT 0,
  `56_size` int(11) DEFAULT 0,
  `58_size` int(11) DEFAULT 0,
  PRIMARY KEY (`id_product`),
  KEY `idx_category` (`category_product`),
  KEY `idx_status` (`status_product`),
  KEY `idx_reference` (`reference_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reservations table for private measure appointments
CREATE TABLE IF NOT EXISTS `reservations` (
  `id_reservation` int(11) NOT NULL AUTO_INCREMENT,
  `nom_client` varchar(255) NOT NULL,
  `email_client` varchar(255) NOT NULL,
  `telephone_client` varchar(20) NOT NULL,
  `date_reservation` date NOT NULL,
  `heure_reservation` time NOT NULL,
  `statut_reservation` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `notes_reservation` text,
  `date_creation` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_confirmation` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `idx_date` (`date_reservation`),
  KEY `idx_statut` (`statut_reservation`),
  KEY `idx_email` (`email_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create messages table for contact form
CREATE TABLE IF NOT EXISTS `messages` (
  `id_message` int(11) NOT NULL AUTO_INCREMENT,
  `nom_client` varchar(255) NOT NULL,
  `email_client` varchar(255) NOT NULL,
  `telephone_client` varchar(20) NOT NULL,
  `message_client` text NOT NULL,
  `vue_par_admin` tinyint(1) DEFAULT 0 COMMENT 'Track if message has been viewed by admin (0 = not viewed, 1 = viewed)',
  `date_vue_admin` timestamp NULL DEFAULT NULL COMMENT 'Date when admin first viewed the message',
  `date_creation` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_message`),
  KEY `idx_email` (`email_client`),
  KEY `idx_vue_par_admin` (`vue_par_admin`),
  KEY `idx_date_creation` (`date_creation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create customers table for order management (removed status field)
CREATE TABLE IF NOT EXISTS `customers` (
  `id_customer` int(11) NOT NULL AUTO_INCREMENT,
  `nom_customer` varchar(255) NOT NULL,
  `prenom_customer` varchar(255) NOT NULL,
  `email_customer` varchar(255) NOT NULL,
  `telephone_customer` varchar(20) NOT NULL,
  `adresse_customer` text NOT NULL,
  `ville_customer` varchar(100) NOT NULL,
  `code_postal_customer` varchar(20) NOT NULL,
  `pays_customer` varchar(100) NOT NULL,
  `date_creation_customer` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_modification_customer` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_customer`),
  UNIQUE KEY `idx_email_customer` (`email_customer`),
  KEY `idx_nom_customer` (`nom_customer`),
  KEY `idx_prenom_customer` (`prenom_customer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create orders table with vue/not vue functionality
CREATE TABLE IF NOT EXISTS `orders` (
  `id_order` int(11) NOT NULL AUTO_INCREMENT,
  `id_customer` int(11) NOT NULL,
  `numero_commande` varchar(50) NOT NULL UNIQUE,
  `sous_total_order` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount_order` decimal(10,2) DEFAULT 0.00,
  `discount_percentage_order` decimal(5,2) DEFAULT 0.00,
  `delivery_cost_order` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_order` decimal(10,2) NOT NULL,
  `status_order` enum('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `date_livraison_souhaitee` date DEFAULT NULL,
  `payment_link_konnekt` varchar(500) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_method` varchar(100) DEFAULT NULL,
  `notes_order` text,
  `vue_par_admin` tinyint(1) DEFAULT 0 COMMENT 'Track if order has been viewed by admin (0 = not viewed, 1 = viewed)',
  `date_vue_admin` timestamp NULL DEFAULT NULL COMMENT 'Date when admin first viewed the order',
  `date_creation_order` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_modification_order` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `date_confirmation_order` timestamp NULL DEFAULT NULL,
  `date_livraison_order` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_order`),
  FOREIGN KEY (`id_customer`) REFERENCES `customers`(`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_numero_commande` (`numero_commande`),
  KEY `idx_status_order` (`status_order`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_date_creation_order` (`date_creation_order`),
  KEY `idx_vue_par_admin` (`vue_par_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_items table for products in each order
CREATE TABLE IF NOT EXISTS `order_items` (
  `id_order_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `nom_product_snapshot` varchar(255) NOT NULL,
  `reference_product_snapshot` varchar(100) NOT NULL,
  `price_product_snapshot` decimal(10,2) NOT NULL,
  `size_selected` varchar(20) DEFAULT NULL,
  `color_selected` varchar(100) DEFAULT NULL,
  `quantity_ordered` int(11) NOT NULL DEFAULT 1,
  `subtotal_item` decimal(10,2) NOT NULL,
  `discount_item` decimal(10,2) DEFAULT 0.00,
  `total_item` decimal(10,2) NOT NULL,
  `date_creation_item` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_order_item`),
  FOREIGN KEY (`id_order`) REFERENCES `orders`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`id_product`) REFERENCES `products`(`id_product`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_order_item` (`id_order`),
  KEY `idx_product_item` (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_tracking table for order status history
CREATE TABLE IF NOT EXISTS `order_tracking` (
  `id_tracking` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `status_previous` varchar(50) DEFAULT NULL,
  `status_new` varchar(50) NOT NULL,
  `notes_tracking` text,
  `date_tracking` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tracking`),
  FOREIGN KEY (`id_order`) REFERENCES `orders`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_order_tracking` (`id_order`),
  KEY `idx_date_tracking` (`date_tracking`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create delivery_addresses table (for cases where delivery address differs from customer address)
CREATE TABLE IF NOT EXISTS `delivery_addresses` (
  `id_delivery_address` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `nom_destinataire` varchar(255) NOT NULL,
  `prenom_destinataire` varchar(255) NOT NULL,
  `telephone_destinataire` varchar(20) DEFAULT NULL,
  `adresse_livraison` text NOT NULL,
  `ville_livraison` varchar(100) NOT NULL,
  `code_postal_livraison` varchar(20) NOT NULL,
  `pays_livraison` varchar(100) NOT NULL,
  `instructions_livraison` text,
  `date_creation_delivery` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_delivery_address`),
  FOREIGN KEY (`id_order`) REFERENCES `orders`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `idx_order_delivery` (`id_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create enhanced newsletter_subscribers table with age field
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id_subscriber` int(11) NOT NULL AUTO_INCREMENT,
  `email_subscriber` varchar(255) NOT NULL,
  `nom_subscriber` varchar(255) DEFAULT NULL,
  `prenom_subscriber` varchar(255) DEFAULT NULL,
  `age_subscriber` int(3) DEFAULT NULL,
  `status_subscriber` enum('active','unsubscribed','bounced','pending') DEFAULT 'active',
  `source_subscriber` enum('website','checkout','social','manual','import','popup') DEFAULT 'website',
  `date_inscription` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_unsubscribe` timestamp NULL DEFAULT NULL,
  `ip_inscription` varchar(45) DEFAULT NULL,
  `token_unsubscribe` varchar(100) DEFAULT NULL,
  `preferences_subscriber` text COMMENT 'JSON field for subscriber preferences',
  PRIMARY KEY (`id_subscriber`),
  UNIQUE KEY `idx_email_subscriber` (`email_subscriber`),
  KEY `idx_status_subscriber` (`status_subscriber`),
  KEY `idx_date_inscription` (`date_inscription`),
  KEY `idx_source_subscriber` (`source_subscriber`),
  KEY `idx_age_subscriber` (`age_subscriber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create visitor tracking table
CREATE TABLE IF NOT EXISTS `visitor_tracking` (
    `id` varchar(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    `ip_address` varchar(45) NOT NULL,
    `page_visited` varchar(255) NOT NULL,
    `referrer` varchar(500) DEFAULT NULL,
    `user_agent` text,
    `city` varchar(100) DEFAULT NULL,
    `country` varchar(100) DEFAULT NULL,
    `visit_date` timestamp DEFAULT CURRENT_TIMESTAMP,
    `session_id` varchar(255) DEFAULT NULL,
    KEY `idx_page_visited` (`page_visited`),
    KEY `idx_visit_date` (`visit_date`),
    KEY `idx_country` (`country`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DUMMY DATA INSERTION

-- Insert comprehensive sample data for products with correct categories and item groups
INSERT INTO `products` (`reference_product`, `nom_product`, `img_product`, `img2_product`, `description_product`, `type_product`, `category_product`, `itemgroup_product`, `price_product`, `qnty_product`, `s_size`, `m_size`, `l_size`, `xl_size`, `xxl_size`, `color_product`, `status_product`, `discount_product`) VALUES
-- Sur Mesure - Homme
('SM-H-BLZ-001', 'Blazer Sur Mesure Homme', '/placeholder.svg', '/placeholder2.svg', 'Blazer élégant sur mesure pour homme', 'sur mesure', 'homme', 'blazers', 1200.00, 15, 0, 0, 0, 0, 0, 'Navy', 'active', 0.00),
('SM-H-BLO-001', 'Blouson Cuir Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Blouson en cuir sur mesure', 'sur mesure', 'homme', 'blouson', 2500.00, 8, 0, 0, 0, 0, 0, 'Black', 'active', 15.00),
('SM-H-MAN-001', 'Manteau Laine Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Manteau en laine pure sur mesure', 'sur mesure', 'homme', 'manteau', 1800.00, 12, 0, 0, 0, 0, 0, 'Charcoal', 'active', 0.00),
('SM-H-DJI-001', 'Djine Traditionnel Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Djine traditionnel sur mesure', 'sur mesure', 'homme', 'djine', 800.00, 20, 0, 0, 0, 0, 0, 'White', 'active', 0.00),
('SM-H-SLA-001', 'Slack Premium Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Pantalon slack premium sur mesure', 'sur mesure', 'homme', 'slack', 650.00, 25, 0, 0, 0, 0, 0, 'Gray', 'active', 10.00),
('SM-H-PAN-001', 'Pantalon Classique Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Pantalon classique sur mesure', 'sur mesure', 'homme', 'pantalon', 450.00, 30, 0, 0, 0, 0, 0, 'Black', 'active', 0.00),

-- Sur Mesure - Femme
('SM-F-CHE-001', 'Chemise Femme Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Chemise élégante sur mesure pour femme', 'sur mesure', 'femme', 'chemise', 380.00, 22, 8, 12, 8, 2, 0, 'White', 'active', 0.00),
('SM-F-COS-001', 'Costume Femme Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Costume complet sur mesure pour femme', 'sur mesure', 'femme', 'costume', 1500.00, 10, 5, 8, 6, 1, 0, 'Navy', 'active', 20.00),
('SM-F-BLZ-001', 'Blazer Femme Sur Mesure', '/placeholder.svg', '/placeholder2.svg', 'Blazer féminin sur mesure', 'sur mesure', 'femme', 'blazer', 950.00, 18, 6, 10, 8, 2, 0, 'Burgundy', 'active', 0.00),

-- Prêt à Porter
('PAP-CHE-001', 'Chemise Prêt à Porter', '/placeholder.svg', '/placeholder2.svg', 'Chemise classique prêt à porter', 'prêt à porter', '', 'chemise', 120.00, 50, 10, 15, 20, 5, 0, 'Blue', 'active', 5.00),
('PAP-TSH-001', 'T-shirt Premium Cotton', '/placeholder.svg', '/placeholder2.svg', 'T-shirt en coton premium', 'prêt à porter', '', 'tshirt', 45.00, 80, 15, 25, 30, 10, 0, 'White', 'active', 0.00),
('PAP-POL-001', 'Polo Élégant', '/placeholder.svg', '/placeholder2.svg', 'Polo élégant pour toutes occasions', 'prêt à porter', '', 'polo', 85.00, 60, 12, 20, 18, 8, 2, 'Navy', 'active', 10.00),
('PAP-CHA-001', 'Chaussures Cuir', '/placeholder.svg', '/placeholder2.svg', 'Chaussures en cuir véritable', 'prêt à porter', '', 'chaussure', 280.00, 40, 0, 0, 0, 0, 0, 'Brown', 'active', 15.00),
('PAP-CEI-001', 'Ceinture Cuir Premium', '/placeholder.svg', '/placeholder2.svg', 'Ceinture en cuir premium', 'prêt à porter', '', 'ceinture', 95.00, 35, 0, 0, 0, 0, 0, 'Black', 'active', 0.00),
('PAP-MAR-001', 'Portefeuille Maroquinerie', '/placeholder.svg', '/placeholder2.svg', 'Portefeuille en cuir de maroquinerie', 'prêt à porter', '', 'maroquinerie', 150.00, 45, 0, 0, 0, 0, 0, 'Brown', 'active', 0.00),

-- Accessoires
('ACC-CRA-001', 'Cravate Soie Premium', '/placeholder.svg', '/placeholder2.svg', 'Cravate en soie de haute qualité', 'accessoires', '', 'cravate', 65.00, 100, 0, 0, 0, 0, 0, 'Red', 'active', 0.00),
('ACC-POC-001', 'Pochette Élégante', '/placeholder.svg', '/placeholder2.svg', 'Pochette élégante pour costume', 'accessoires', '', 'pochette', 35.00, 75, 0, 0, 0, 0, 0, 'Silver', 'active', 0.00),
('ACC-MAR-001', 'Sac Maroquinerie Luxe', '/placeholder.svg', '/placeholder2.svg', 'Sac de luxe en maroquinerie', 'accessoires', '', 'maroquinerie', 450.00, 25, 0, 0, 0, 0, 0, 'Black', 'active', 25.00),
('ACC-AUT-001', 'Boutons de Manchette', '/placeholder.svg', '/placeholder2.svg', 'Boutons de manchette en or', 'accessoires', '', 'autre', 180.00, 30, 0, 0, 0, 0, 0, 'Gold', 'active', 0.00);

-- Insert sample reservations with varied statuses
INSERT INTO `reservations` (`nom_client`, `email_client`, `telephone_client`, `date_reservation`, `heure_reservation`, `statut_reservation`, `notes_reservation`) VALUES
('Jean Dupont', 'jean.dupont@email.com', '+33123456789', '2024-01-15', '10:00:00', 'confirmed', 'Mesure pour costume sur mesure'),
('Marie Martin', 'marie.martin@email.com', '+33987654321', '2024-01-16', '14:30:00', 'pending', 'Première consultation pour robe de soirée'),
('Pierre Bernard', 'pierre.bernard@email.com', '+33456789123', '2024-01-18', '11:00:00', 'completed', 'Essayage final terminé'),
('Sophie Dubois', 'sophie.dubois@email.com', '+33789123456', '2024-01-20', '15:30:00', 'confirmed', 'Retouches sur pantalon'),
('Ahmed Ben Ali', 'ahmed.benali@email.com', '+216123456789', '2024-01-22', '09:00:00', 'pending', 'Consultation pour costume de mariage'),
('Fatma Trabelsi', 'fatma.trabelsi@email.com', '+216987654321', '2024-01-25', '16:00:00', 'cancelled', 'Annulé par le client');

-- Insert sample customer data with more variety
INSERT INTO `customers` (`nom_customer`, `prenom_customer`, `email_customer`, `telephone_customer`, `adresse_customer`, `ville_customer`, `code_postal_customer`, `pays_customer`) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com', '+33123456789', '123 Rue de la Paix', 'Paris', '75001', 'France'),
('Martin', 'Marie', 'marie.martin@email.com', '+33987654321', '456 Avenue des Champs', 'Lyon', '69001', 'France'),
('Bernard', 'Pierre', 'pierre.bernard@email.com', '+33456789123', '789 Boulevard Saint-Germain', 'Marseille', '13001', 'France'),
('Dubois', 'Sophie', 'sophie.dubois@email.com', '+33789123456', '321 Rue de Rivoli', 'Nice', '06000', 'France'),
('Ben Ali', 'Ahmed', 'ahmed.benali@email.com', '+216123456789', '15 Avenue Bourguiba', 'Tunis', '1000', 'Tunisia'),
('Trabelsi', 'Fatma', 'fatma.trabelsi@email.com', '+216987654321', '25 Rue de la Liberté', 'Sfax', '3000', 'Tunisia'),
('El Amri', 'Youssef', 'youssef.amri@email.com', '+216555666777', '10 Avenue de la République', 'Sousse', '4000', 'Tunisia');

-- Insert sample order data with various statuses
INSERT INTO `orders` (`id_customer`, `numero_commande`, `sous_total_order`, `discount_amount_order`, `delivery_cost_order`, `total_order`, `status_order`, `date_livraison_souhaitee`, `payment_status`, `vue_par_admin`) VALUES
(1, 'CMD-2024-001', 970.00, 50.00, 15.00, 935.00, 'confirmed', '2024-02-01', 'paid', 1),
(2, 'CMD-2024-002', 420.00, 0.00, 10.00, 430.00, 'pending', '2024-02-05', 'pending', 0),
(3, 'CMD-2024-003', 1200.00, 180.00, 20.00, 1040.00, 'processing', '2024-02-10', 'paid', 1),
(4, 'CMD-2024-004', 650.00, 0.00, 12.00, 662.00, 'shipped', '2024-02-08', 'paid', 1),
(5, 'CMD-2024-005', 850.00, 0.00, 18.00, 868.00, 'delivered', '2024-01-30', 'paid', 1),
(6, 'CMD-2024-006', 300.00, 15.00, 8.00, 293.00, 'cancelled', '2024-02-15', 'refunded', 0);

-- Insert sample order items
INSERT INTO `order_items` (`id_order`, `id_product`, `nom_product_snapshot`, `reference_product_snapshot`, `price_product_snapshot`, `size_selected`, `color_selected`, `quantity_ordered`, `subtotal_item`, `total_item`) VALUES
(1, 1, 'Chemise en Coton Rayé', 'REF001', 320.00, 'L', 'Blue', 2, 640.00, 640.00),
(1, 3, 'Sac à Main Élégant', 'REF003', 650.00, NULL, 'Black', 1, 650.00, 650.00),
(2, 2, 'Blouse en Soie Premium', 'REF002', 420.00, 'M', 'White', 1, 420.00, 420.00),
(3, 4, 'Costume Trois Pièces', 'REF004', 1200.00, 'L', 'Navy', 1, 1200.00, 1200.00),
(4, 3, 'Sac à Main Élégant', 'REF003', 650.00, NULL, 'Black', 1, 650.00, 650.00),
(5, 5, 'Robe de Soirée', 'REF005', 850.00, 'M', 'Red', 1, 850.00, 850.00),
(6, 6, 'Pantalon Enfant', 'REF006', 180.00, 'L', 'Gray', 1, 180.00, 180.00),
(6, 8, 'Foulard en Soie', 'REF008', 120.00, NULL, 'Multi', 1, 120.00, 120.00);

-- Insert order tracking data
INSERT INTO `order_tracking` (`id_order`, `status_previous`, `status_new`, `notes_tracking`) VALUES
(1, NULL, 'pending', 'Commande créée'),
(1, 'pending', 'confirmed', 'Commande confirmée par l\'admin'),
(3, NULL, 'pending', 'Commande créée'),
(3, 'pending', 'confirmed', 'Commande confirmée'),
(3, 'confirmed', 'processing', 'En cours de préparation'),
(4, NULL, 'pending', 'Commande créée'),
(4, 'pending', 'confirmed', 'Commande confirmée'),
(4, 'confirmed', 'processing', 'En préparation'),
(4, 'processing', 'shipped', 'Expédiée'),
(5, 'shipped', 'delivered', 'Livrée avec succès');

-- Insert delivery addresses for some orders
INSERT INTO `delivery_addresses` (`id_order`, `nom_destinataire`, `prenom_destinataire`, `telephone_destinataire`, `adresse_livraison`, `ville_livraison`, `code_postal_livraison`, `pays_livraison`, `instructions_livraison`) VALUES
(4, 'Dubois', 'Sophie', '+33789123456', '321 Rue de Rivoli, Apt 5B', 'Nice', '06000', 'France', 'Sonner à l\'interphone, 3ème étage'),
(5, 'Ben Ali', 'Ahmed', '+216123456789', '15 Avenue Bourguiba, Bureau 12', 'Tunis', '1000', 'Tunisia', 'Livraison en bureau, horaires 9h-17h');

-- Insert comprehensive newsletter subscribers
INSERT INTO `newsletter_subscribers` (`email_subscriber`, `nom_subscriber`, `prenom_subscriber`, `age_subscriber`, `status_subscriber`, `source_subscriber`, `date_inscription`, `token_unsubscribe`) VALUES
('jean.dupont@email.com', 'Dupont', 'Jean', 30, 'active', 'website', '2024-01-15 10:30:00', 'token_001'),
('marie.martin@email.com', 'Martin', 'Marie', 25, 'active', 'checkout', '2024-01-10 09:15:00', 'token_002'),
('pierre.dubois@email.com', 'Dubois', 'Pierre', 35, 'unsubscribed', 'website', '2023-12-20 16:45:00', 'token_003'),
('sophie.bernard@email.com', 'Bernard', 'Sophie', 28, 'active', 'social', '2024-01-18 14:20:00', 'token_004'),
('claire.moreau@email.com', 'Moreau', 'Claire', 32, 'active', 'website', '2024-01-20 11:30:00', 'token_005'),
('lucas.petit@email.com', 'Petit', 'Lucas', 27, 'active', 'manual', '2024-01-22 15:45:00', 'token_006'),
('ahmed.benali@email.com', 'Ben Ali', 'Ahmed', 33, 'active', 'website', '2024-01-25 08:20:00', 'token_007'),
('fatma.trabelsi@email.com', 'Trabelsi', 'Fatma', 29, 'bounced', 'checkout', '2024-01-12 12:10:00', 'token_008'),
('youssef.amri@email.com', 'El Amri', 'Youssef', 26, 'pending', 'social', '2024-01-28 16:30:00', 'token_009'),
('salma.khelifi@email.com', 'Khelifi', 'Salma', 31, 'active', 'import', '2024-01-30 10:45:00', 'token_010');

-- Insert diverse visitor tracking data
INSERT INTO `visitor_tracking` (`ip_address`, `page_visited`, `referrer`, `user_agent`, `city`, `country`, `visit_date`, `session_id`) VALUES
('192.168.1.100', 'Home', 'Google Search', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Paris', 'France', '2024-01-20 10:30:00', 'sess_001'),
('192.168.1.101', 'Products', 'Facebook', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'Lyon', 'France', '2024-01-20 11:15:00', 'sess_002'),
('192.168.1.102', 'About', 'Direct', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Tunis', 'Tunisia', '2024-01-20 12:00:00', 'sess_003'),
('192.168.1.103', 'Home', 'Instagram', 'Mozilla/5.0 (Android 13; Mobile; rv:109.0)', 'New York', 'United States', '2024-01-20 13:30:00', 'sess_004'),
('192.168.1.104', 'Products', 'Google Search', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Casablanca', 'Morocco', '2024-01-20 14:45:00', 'sess_005'),
('41.230.45.123', 'Home', 'Google Search', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Sfax', 'Tunisia', '2024-01-21 09:20:00', 'sess_006'),
('197.15.89.234', 'Contact', 'Direct', 'Mozilla/5.0 (Linux; Android 12)', 'Sousse', 'Tunisia', '2024-01-21 15:40:00', 'sess_007'),
('86.195.123.45', 'Products', 'Twitter', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Marseille', 'France', '2024-01-22 11:25:00', 'sess_008'),
('105.98.67.189', 'About', 'LinkedIn', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Algiers', 'Algeria', '2024-01-22 14:10:00', 'sess_009'),
('78.246.135.78', 'Home', 'WhatsApp', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', 'Nice', 'France', '2024-01-23 16:55:00', 'sess_010');

-- Insert sample message data with different statuses
INSERT INTO `messages` (`nom_client`, `email_client`, `telephone_client`, `message_client`,  `vue_par_admin`, `date_vue_admin`) VALUES
('Jean Dupont', 'jean.dupont@email.com', '+33123456789', 'Bonjour, j\'aimerais avoir plus d\'informations sur vos costumes sur mesure. Quels sont vos délais de confection ?', 0, NULL),
('Marie Martin', 'marie.martin@email.com', '+33987654321', 'Pouvez-vous me renseigner sur les délais de livraison pour les commandes spéciales? J\'ai besoin d\'une robe pour un événement.', 1, '2024-01-21 10:30:00'),
('Pierre Bernard', 'pierre.bernard@email.com', '+33456789123', 'J\'ai une question concernant les retours et échanges. Quelle est votre politique de retour ?', 0, NULL),
('Ahmed Ben Ali', 'ahmed.benali@email.com', '+216123456789', 'Salut, est-ce que vous livrez en Tunisie ? Quels sont les frais de port ?', 1, '2024-01-22 14:15:00'),
('Sophie Dubois', 'sophie.dubois@email.com', '+33789123456', 'Bonjour, je voudrais savoir si vous proposez des services de retouches après achat ?', 0, NULL),
('Youssef Amri', 'youssef.amri@email.com', '+216555666777', 'Bonsoir, j\'ai vu vos créations sur Instagram. Proposez-vous des consultations en ligne ?', 1, '2024-01-23 09:45:00'),
('Fatma Trabelsi', 'fatma.trabelsi@email.com', '+216987654321', 'Bonjour, quels sont vos horaires d\'ouverture pour les essayages ? Merci.', 0, NULL);

-- Add age field to existing newsletter subscribers if not exists
ALTER TABLE `newsletter_subscribers` 
ADD COLUMN IF NOT EXISTS `age_subscriber` int(3) DEFAULT NULL AFTER `prenom_subscriber`,
ADD INDEX IF NOT EXISTS `idx_age_subscriber` (`age_subscriber`);

-- Update source_subscriber enum to include 'popup'
ALTER TABLE `newsletter_subscribers` 
MODIFY COLUMN `source_subscriber` enum('website','checkout','social','manual','import','popup') DEFAULT 'website';
