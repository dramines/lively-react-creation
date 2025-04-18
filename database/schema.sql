-- Create database if not exists with proper character set
-- Création de la base de données si elle n'existe pas, avec le bon jeu de caractères
CREATE DATABASE IF NOT EXISTS myapp_database1 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
USE myapp_database1;

-- Table des utilisateurs - Mise à jour pour supprimer les champs name, nom, prenom
-- Users Table - Updated to remove name, nom, prenom fields
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,                    -- Prénom de l'utilisateur
    lastName VARCHAR(100) NOT NULL,                     -- Nom de l'utilisateur
    email VARCHAR(100) UNIQUE NOT NULL,                 -- Email (unique) de l'utilisateur
    password VARCHAR(255) NOT NULL,                     -- Mot de passe hashé
    phone VARCHAR(20) DEFAULT NULL,                     -- Numéro de téléphone (optionnel)
    role ENUM('admin', 'user', 'provider') NOT NULL DEFAULT 'user',  -- Rôle de l'utilisateur
    status ENUM('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active',  -- Statut du compte
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Date de création
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Date de mise à jour
    INDEX idx_email (email),                            -- Index sur l'email pour accélérer les recherches
    INDEX idx_role (role),                              -- Index sur le rôle
    INDEX idx_status (status)                           -- Index sur le statut
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insertion d'utilisateurs exemple (mot de passe: Azerty123456)
-- Insert sample users (password: Azerty123456)
-- Le hash de mot de passe ci-dessous est pour "Azerty123456" utilisant bcrypt
INSERT INTO users (firstName, lastName, email, password, phone, role, status) VALUES
('Admin', 'User', 'admin@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', '+21625478632', 'admin', 'active'),
('Regular', 'User', 'user@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', '+21625478633', 'user', 'active'),
('John', 'Doe', 'john@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', '+21625478634', 'user', 'active'),
('Jane', 'Smith', 'jane@example.com', '$2a$10$JNe8AhPXkcLfQAOLJAQYpemUPLOLJrr0Fot1IQUcTTiQmWGn9aJQ2', '+21625478635', 'user', 'active');

-- Table des lieux
-- Places Table
CREATE TABLE IF NOT EXISTS places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                         -- Nom du lieu
    type VARCHAR(50) NOT NULL,                          -- Type de lieu (musée, parc, etc.)
    description TEXT,                                   -- Description détaillée
    location TEXT,                                      -- Localisation (JSON avec coordonnées)
    images TEXT,                                        -- URLs des images (format JSON)
    openingHours TEXT,                                  -- Horaires d'ouverture (format JSON)
    entranceFee TEXT,                                   -- Tarifs d'entrée (format JSON)
    provider_id INT,                                    -- ID du fournisseur/propriétaire
    average_rating DECIMAL(3,2) DEFAULT 0,              -- Note moyenne des avis
    isActive BOOLEAN DEFAULT TRUE,                      -- Statut d'activation du lieu
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Date de création
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Date de mise à jour
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE SET NULL,  -- Clé étrangère vers utilisateurs
    INDEX idx_name (name(191)),                         -- Index sur le nom (limité à 191 chars pour utf8mb4)
    INDEX idx_type (type),                              -- Index sur le type
    INDEX idx_provider (provider_id),                   -- Index sur le fournisseur
    INDEX idx_isActive (isActive)                       -- Index sur le statut d'activation
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table des événements
-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                        -- Titre de l'événement
    description TEXT,                                   -- Description détaillée
    startDate DATETIME NOT NULL,                        -- Date et heure de début
    endDate DATETIME NOT NULL,                          -- Date et heure de fin
    location VARCHAR(255),                              -- Lieu de l'événement
    organizer VARCHAR(255),                             -- Organisateur
    ticketPrice DECIMAL(10,2),                          -- Prix du billet
    capacity INT,                                       -- Capacité maximale
    images TEXT,                                        -- URLs des images (format JSON)
    provider_id INT,                                    -- ID du fournisseur/organisateur
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Date de création
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Date de mise à jour
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE SET NULL,  -- Clé étrangère vers utilisateurs
    INDEX idx_startDate (startDate),                    -- Index sur la date de début
    INDEX idx_endDate (endDate),                        -- Index sur la date de fin
    INDEX idx_location (location(191)),                 -- Index sur le lieu
    INDEX idx_provider (provider_id)                    -- Index sur le fournisseur
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table des sessions
-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId1 INT NOT NULL,                               -- ID du premier utilisateur
    userId2 INT NOT NULL,                               -- ID du deuxième utilisateur
    lastMessageAt TIMESTAMP NULL,                       -- Horodatage du dernier message
    isActive BOOLEAN DEFAULT TRUE,                      -- Statut d'activité de la session
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Date de création
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Date de mise à jour
    FOREIGN KEY (userId1) REFERENCES users(id) ON DELETE CASCADE,  -- Clé étrangère avec suppression en cascade
    FOREIGN KEY (userId2) REFERENCES users(id) ON DELETE CASCADE,  -- Clé étrangère avec suppression en cascade
    INDEX idx_user1 (userId1),                          -- Index sur le premier utilisateur
    INDEX idx_user2 (userId2),                          -- Index sur le deuxième utilisateur
    INDEX idx_last_message (lastMessageAt)              -- Index sur le dernier message
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table des messages
-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessionId INT NOT NULL,                             -- ID de la session de conversation
    senderId INT NOT NULL,                              -- ID de l'expéditeur
    content TEXT NOT NULL,                              -- Contenu du message
    is_read BOOLEAN DEFAULT FALSE,                      -- Statut de lecture
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Date de création
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Date de mise à jour
    FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,  -- Clé étrangère avec suppression en cascade
    FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE,  -- Clé étrangère avec suppression en cascade
    INDEX idx_sessionId (sessionId),                    -- Index sur la session
    INDEX idx_senderId (senderId)                       -- Index sur l'expéditeur
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Table des avis
-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,                                -- ID de l'utilisateur qui a posté l'avis
    placeId INT NOT NULL,                               -- ID du lieu concerné
    rating DECIMAL(3,2) NOT NULL,                       -- Note (sur 5 étoiles)
    comment TEXT,                                       -- Commentaire textuel
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Date de création
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Date de mise à jour
    FOREIGN KEY (placeId) REFERENCES places(id) ON DELETE CASCADE,  -- Clé étrangère avec suppression en cascade
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,  -- Clé étrangère avec suppression en cascade
    INDEX idx_place_id (placeId),                       -- Index sur le lieu
    INDEX idx_user_id (userId)                          -- Index sur l'utilisateur
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Reste des tables et déclencheurs
-- Individual triggers for rating update
CREATE TRIGGER update_place_rating_insert AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE placeId = NEW.placeId
    ) WHERE id = NEW.placeId;
END;

CREATE TRIGGER update_place_rating_update AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE placeId = NEW.placeId
    ) WHERE id = NEW.placeId;
END;

CREATE TRIGGER update_place_rating_delete AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE places SET average_rating = (
        SELECT AVG(rating) FROM reviews 
        WHERE placeId = OLD.placeId
    ) WHERE id = OLD.placeId;
END;

-- Trigger to update lastMessageAt in session when a new message is created
CREATE TRIGGER update_session_last_message AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    UPDATE sessions 
    SET lastMessageAt = NEW.createdAt
    WHERE id = NEW.sessionId;
END;
