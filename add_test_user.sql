
-- SQL script to add a test user to the users table
-- The password is 'Password123' (hashed with password_hash in PHP)
INSERT INTO users (id, email, full_name, password, role, created_at, updated_at)
VALUES (
    uuid_generate_v4(), -- Generates a UUID
    'test@example.com', -- Email
    'Test User', -- Full name
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Hashed password for 'Password123'
    'admin', -- Role
    NOW(), -- Created at
    NOW() -- Updated at
);

-- If you prefer to add a user without a hashed password (not recommended for production),
-- you can use this query and then update the password through the API or directly in the database.
-- The password will need to be hashed before it can be used with the login system.

-- INSERT INTO users (id, email, full_name, password, role, created_at, updated_at)
-- VALUES (
--    uuid_generate_v4(),
--    'admin@vilart.com',
--    'Administrator',
--    'plaintext_password_to_be_hashed',
--    'admin',
--    NOW(),
--    NOW()
-- );
