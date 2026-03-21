-- تحديث جدول user_profiles لإضافة عمود newsletter_subscribed
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT FALSE;

-- تأكد أيضاً من وجود عمود favorite_categories الذي قد تحتاجه ميزات الذكاء الاصطناعي
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS favorite_categories TEXT[] DEFAULT '{}';