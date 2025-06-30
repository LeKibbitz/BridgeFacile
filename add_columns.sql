-- Add last_name column to contacts table
ALTER TABLE contacts ADD COLUMN last_name TEXT;

-- Add postal_code column to contacts table  
ALTER TABLE contacts ADD COLUMN postal_code TEXT;

-- Add message column to contacts table (if not exists)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS message TEXT;

