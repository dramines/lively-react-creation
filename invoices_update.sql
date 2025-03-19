
ALTER TABLE invoices ADD COLUMN client_address VARCHAR(255) DEFAULT NULL;
ALTER TABLE invoices ADD COLUMN client_phone VARCHAR(50) DEFAULT NULL;
ALTER TABLE invoices ADD COLUMN client_tax_number VARCHAR(50) DEFAULT NULL;
ALTER TABLE invoices ADD COLUMN company_name VARCHAR(100) DEFAULT 'Vilart Production';
ALTER TABLE invoices ADD COLUMN company_tax_number VARCHAR(50) DEFAULT '1865480/V/A/M/000';
ALTER TABLE invoices ADD COLUMN company_address VARCHAR(255) DEFAULT 'A3, Imm La Coupole, rue Windermere, Lac 1, Tunis 1053';
ALTER TABLE invoices ADD COLUMN company_phone VARCHAR(50) DEFAULT '+216 54 754 704';
ALTER TABLE invoices ADD COLUMN company_email VARCHAR(100) DEFAULT 'vilartprod@gmail.com';
