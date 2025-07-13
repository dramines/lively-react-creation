-- Create emails table for contact form submissions
CREATE TABLE IF NOT EXISTS `emails` (
  `id_email` int(11) NOT NULL AUTO_INCREMENT,
  `nom_client` varchar(255) NOT NULL,
  `email_client` varchar(255) NOT NULL,
  `telephone_client` varchar(50) NOT NULL,
  `sujet_message` varchar(500) DEFAULT NULL,
  `message_client` text NOT NULL,
  `vue_par_admin` tinyint(1) DEFAULT 0,
  `date_vue_admin` timestamp NULL DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;