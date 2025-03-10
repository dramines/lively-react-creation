
CREATE TABLE IF NOT EXISTS transactions (
  id CHAR(36) PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  status TEXT CHECK (status IN ('payé', 'en_attente', 'annulé')),
  type TEXT CHECK (type IN ('dépense', 'revenu')),
  artist_supplier TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id CHAR(36)
);
