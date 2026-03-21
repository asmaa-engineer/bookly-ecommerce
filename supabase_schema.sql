-- Update User Profiles with role and preferences
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS favorite_categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT false;

-- Newsletter Table
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS on Newsletter
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view newsletter list" ON newsletter FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin Policies for Books
CREATE POLICY "Admins can manage books" ON books FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Admin Policies for Profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);