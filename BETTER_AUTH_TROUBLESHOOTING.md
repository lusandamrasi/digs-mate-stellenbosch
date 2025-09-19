# 🔧 Better Auth Troubleshooting Guide

## **Current Issue: Server Returns Mock Data**

The Better Auth server is running but returning mock data instead of connecting to the real Supabase database.

## **Step-by-Step Fix:**

### **1. Set Up Environment Variables**

Create a `.env` file in your project root:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-here-change-this-in-production
DATABASE_URL=postgresql://postgres:%23Lusanda04!@db.jktoowmuzjjvmpeitgxw.supabase.co:5432/postgres
```

**Generate a secret:**
```bash
openssl rand -base64 32
```

### **2. Run Database Migration**

1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy the contents** of `better-auth-migration.sql`
3. **Paste and run** the migration
4. **Verify tables created** in Table Editor

### **3. Test Database Connection**

```bash
# Test if the database connection works
curl -X POST http://localhost:8080/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "user_type": "student",
    "full_name": "Test User"
  }'
```

### **4. Check Supabase Dashboard**

1. **Go to Table Editor** → `user` table
2. **Look for new user** with email `test@example.com`
3. **Verify custom fields** are populated

## **Common Issues & Solutions:**

### **Issue 1: Environment Variables Not Loaded**
```bash
# Make sure .env file exists and has correct values
cat .env
```

### **Issue 2: Database Connection Failed**
- Check DATABASE_URL format
- Verify Supabase project is active
- Check IP allowlist in Supabase

### **Issue 3: Tables Don't Exist**
- Run the migration SQL in Supabase
- Check Table Editor for `user`, `account`, `session`, `verification` tables

### **Issue 4: Better Auth Still Returns Mock Data**
- Restart the server after setting environment variables
- Check server logs for database connection errors
- Verify BETTER_AUTH_SECRET is set

## **Verification Steps:**

1. **Server Health Check:**
   ```bash
   curl http://localhost:8080/health
   ```

2. **Test Sign Up:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/sign-up/email \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
   ```

3. **Check Supabase:**
   - Go to Supabase Dashboard → Table Editor → `user` table
   - Look for the new user record

## **Expected Behavior:**

✅ **Server returns real user data** from Supabase  
✅ **Users appear in Supabase dashboard**  
✅ **Custom fields are populated** (user_type, full_name)  
✅ **Sessions are stored** in database  

## **Next Steps:**

1. **Set up environment variables**
2. **Run database migration**
3. **Test authentication flow**
4. **Verify users in Supabase**

The authentication system will work with real database persistence once these steps are completed!
