-- Better Auth Database Migration for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Users table
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE NOT NULL,
  "emailVerified" BOOLEAN DEFAULT false,
  "name" TEXT,
  "image" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Accounts table (for OAuth providers)
CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE("providerId", "accountId")
);

-- 3. Sessions table
CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

-- 4. Verification table (for email verification)
CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Add custom fields to user table for your app
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "user_type" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "full_name" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "profile_photo_url" TEXT;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "preferences" JSONB;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN DEFAULT false;

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account"("userId");
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "idx_session_token" ON "session"("token");
CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification"("identifier");

-- 7. Enable Row Level Security (RLS)
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON "user" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own profile" ON "user" FOR UPDATE USING (auth.uid()::text = id);

-- Accounts are private to users
CREATE POLICY "Users can view own accounts" ON "account" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can manage own accounts" ON "account" FOR ALL USING (auth.uid()::text = "userId");

-- Sessions are private to users
CREATE POLICY "Users can view own sessions" ON "session" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can manage own sessions" ON "session" FOR ALL USING (auth.uid()::text = "userId");

-- Verification records are public (needed for email verification)
CREATE POLICY "Verification records are public" ON "verification" FOR ALL USING (true);

-- 9. Create functions for updatedAt timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_account_updated_at BEFORE UPDATE ON "account" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_updated_at BEFORE UPDATE ON "session" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_updated_at BEFORE UPDATE ON "verification" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
