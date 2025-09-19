# Better Auth Environment Setup

## 🔧 **Environment Variables Required**

Create a `.env` file in your project root with these variables:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-here-change-this-in-production
DATABASE_URL=postgresql://postgres:%23Lusanda04!@db.jktoowmuzjjvmpeitgxw.supabase.co:5432/postgres

# Supabase Configuration (if needed for other features)
VITE_SUPABASE_URL=https://jktoowmuzjjvmpeitgxw.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## 🔑 **How to Get These Values:**

### **BETTER_AUTH_SECRET**
- Generate a random secret key (32+ characters)
- You can use: `openssl rand -base64 32`
- Or generate online: https://generate-secret.vercel.app/32

### **DATABASE_URL**
- This is your Supabase PostgreSQL connection string
- Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- Get it from: Supabase Dashboard → Settings → Database → Connection string

### **VITE_SUPABASE_URL**
- Your Supabase project URL
- Format: `https://[PROJECT-REF].supabase.co`
- Get it from: Supabase Dashboard → Settings → API

### **VITE_SUPABASE_ANON_KEY**
- Your Supabase anonymous key
- Get it from: Supabase Dashboard → Settings → API → Project API keys

## ⚠️ **Important Notes:**

1. **Never commit `.env` to version control**
2. **Use different secrets for development/production**
3. **The DATABASE_URL should use your actual Supabase password**
4. **Make sure your Supabase project allows connections from your IP**
