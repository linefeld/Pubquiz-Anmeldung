-- Pubquiz Registrations Table
-- This creates a clean, readable table structure for individual registrations

CREATE TABLE IF NOT EXISTS pubquiz_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mannschaft TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pubquiz_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pubquiz_registrations
  FOR SELECT USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON pubquiz_registrations
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public delete access (for admin functions)
CREATE POLICY "Allow public delete access" ON pubquiz_registrations
  FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pubquiz_created_at ON pubquiz_registrations(created_at DESC);

-- Optional: View to see data in a nice format
CREATE OR REPLACE VIEW pubquiz_registrations_view AS
SELECT 
  id,
  name,
  mannschaft,
  created_at,
  TO_CHAR(created_at, 'DD.MM.YYYY HH24:MI') AS anmeldung_am
FROM pubquiz_registrations
ORDER BY created_at DESC;

