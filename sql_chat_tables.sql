-- Chat system tables for luxury assistant

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id_session VARCHAR(255) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) DEFAULT NULL,
    status ENUM('active', 'closed', 'archived') DEFAULT 'active',
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_count INT DEFAULT 0,
    unread_count INT DEFAULT 0,
    INDEX idx_client_email (client_email),
    INDEX idx_status_activity (status, last_activity),
    INDEX idx_date_created (date_created)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id_message INT AUTO_INCREMENT PRIMARY KEY,
    id_session VARCHAR(255) NOT NULL,
    sender_type ENUM('client', 'agent') NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    message_content TEXT,
    message_type ENUM('text', 'file', 'system', 'image') DEFAULT 'text',
    is_read BOOLEAN DEFAULT FALSE,
    date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(512) NULL,
    image_name VARCHAR(255) NULL,
    image_size INT NULL,
    FOREIGN KEY (id_session) REFERENCES chat_sessions(id_session) ON DELETE CASCADE,
    INDEX idx_session_date (id_session, date_sent),
    INDEX idx_sender_read (sender_type, is_read),
    INDEX idx_message_type (message_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agent status table (simple online/offline system)
CREATE TABLE IF NOT EXISTS agent_status (
    id INT PRIMARY KEY DEFAULT 1,
    is_online BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    agent_name VARCHAR(255) DEFAULT 'Luxury Assistant'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default agent status
INSERT INTO agent_status (id, is_online, agent_name) VALUES (1, FALSE, 'Luxury Assistant') 
ON DUPLICATE KEY UPDATE agent_name = VALUES(agent_name);

-- Dummy data for testing
INSERT INTO chat_sessions (id_session, client_name, client_email, client_phone, status, date_created) VALUES
('session_001', 'Marie Dubois', 'marie.dubois@email.com', '+33123456789', 'active', '2024-01-15 10:30:00'),
('session_002', 'Jean Martin', 'jean.martin@email.com', '+33987654321', 'active', '2024-01-15 11:45:00'),
('session_003', 'Sophie Laurent', 'sophie.laurent@email.com', NULL, 'closed', '2024-01-14 14:20:00');

INSERT INTO chat_messages (id_session, sender_type, sender_name, message_content, message_type, date_sent, is_read) VALUES
-- Session 1 messages
('session_001', 'client', 'Marie Dubois', 'Bonjour, j\'aimerais me renseigner sur vos produits de luxe.', 'text', '2024-01-15 10:30:00', TRUE),
('session_001', 'agent', 'Luxury Assistant', 'Bonjour Marie ! Je serais ravi de vous aider. Quel type de produit vous intéresse ?', 'text', '2024-01-15 10:31:00', TRUE),
('session_001', 'client', 'Marie Dubois', 'Je cherche un sac à main pour une occasion spéciale.', 'text', '2024-01-15 10:32:00', TRUE),
('session_001', 'agent', 'Luxury Assistant', 'Parfait ! Nous avons une magnifique collection. Quel est votre budget approximatif ?', 'text', '2024-01-15 10:33:00', FALSE),

-- Session 2 messages  
('session_002', 'client', 'Jean Martin', 'Bonjour, j\'ai une question sur ma commande.', 'text', '2024-01-15 11:45:00', FALSE),
('session_002', 'agent', 'Luxury Assistant', 'Bonjour Jean ! Je vais vérifier votre commande. Pouvez-vous me donner votre numéro de commande ?', 'text', '2024-01-15 11:46:00', FALSE),

-- Session 3 messages (closed session)
('session_003', 'client', 'Sophie Laurent', 'Merci pour votre aide !', 'text', '2024-01-14 14:20:00', TRUE),
('session_003', 'agent', 'Luxury Assistant', 'Je vous en prie ! N\'hésitez pas à revenir si vous avez d\'autres questions.', 'text', '2024-01-14 14:21:00', TRUE),
('session_003', 'system', 'System', 'Session fermée par l\'agent', 'system', '2024-01-14 14:22:00', TRUE);