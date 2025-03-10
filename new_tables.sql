
-- Update artists table to include new fields
ALTER TABLE artists 
ADD COLUMN address TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN photo TEXT,
ADD COLUMN rehearsal_hours DECIMAL(10,2) DEFAULT 0,
ADD COLUMN total_revenue DECIMAL(10,2) DEFAULT 0,
ADD COLUMN social TEXT;

-- Projects table
CREATE TABLE projects (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  artist_id CHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'planifié',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id CHAR(36) NOT NULL
);

-- Project tasks table
CREATE TABLE project_tasks (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'à_faire',
  assigned_to VARCHAR(100),
  deadline DATE,
  project_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id CHAR(36) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Artist-event relationship table
CREATE TABLE artist_events (
  id CHAR(36) PRIMARY KEY,
  artist_id CHAR(36) NOT NULL,
  event_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id CHAR(36) NOT NULL,
  UNIQUE(artist_id, event_id)
);
