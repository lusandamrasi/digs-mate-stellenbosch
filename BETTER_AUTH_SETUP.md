# Better Auth Setup Guide for FlatMate

This guide will help you set up Better Auth with Supabase for your FlatMate application.

## 🚀 **What's Been Implemented:**

### ✅ **Complete Authentication System:**

1. **Better Auth Configuration** (`src/lib/auth.ts`)
   - Email & password authentication
   - Custom user fields (user_type, full_name, bio, etc.)
   - Session management (7-day expiry)
   - PostgreSQL database integration

2. **Auth Client** (`src/lib/authclient.ts`)
   - React hooks for authentication
   - Sign in, sign up, sign out functions
   - Session management

3. **Authentication Page** (`src/pages/Auth.tsx`)
   - Beautiful sign-in/sign-up form
   - User type selection (Student/Landlord)
   - Password visibility toggle
   - Error handling and loading states

4. **Auth Provider** (`src/providers/BetterAuthProvider.tsx`)
   - React context for authentication state
   - Session management across the app

5. **Protected Routes** (`src/components/ProtectedRoute.tsx`)
   - Automatic redirect to auth page for unauthenticated users
   - Loading states during authentication check

6. **Updated Header** (`src/components/Header.tsx`)
   - User name display in profile dropdown
   - Functional logout button
   - Theme toggle integration

## 🔧 **Setup Instructions:**

### 1. **Environment Variables**

Create a `.env.local` file with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Better Auth Configuration
DATABASE_URL=your_supabase_database_connection_string
VITE_BETTER_AUTH_URL=http://localhost:8080
```

### 2. **Database Setup**

Better Auth will automatically create the necessary tables in your Supabase database. The tables include:

- `user` - User accounts
- `session` - User sessions
- `account` - Social account connections
- `verification` - Email verification tokens

### 3. **Running the Application**

You need to run two servers:

**Terminal 1 - Auth Server:**
```bash
npm run dev:auth
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. **Supabase Database Connection**

Update the `DATABASE_URL` in your auth configuration with your Supabase connection string:

1. Go to your Supabase dashboard
2. Navigate to **Settings** → **Database**
3. Copy the **Connection string** (URI format)
4. Update the `DATABASE_URL` in your `.env.local` file

## 🎯 **Features Implemented:**

### **Authentication Flow:**
- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ User type selection (Student/Landlord)
- ✅ Session persistence
- ✅ Automatic logout on session expiry

### **User Management:**
- ✅ User profiles with custom fields
- ✅ User type tracking
- ✅ Profile information storage
- ✅ Session management

### **Security Features:**
- ✅ Password hashing
- ✅ Session tokens
- ✅ CSRF protection
- ✅ Rate limiting (built-in)

### **UI/UX:**
- ✅ Beautiful authentication forms
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Dark theme integration

## 🔍 **Testing the Authentication:**

1. **Start both servers** (auth server on port 8080, frontend on port 8081)
2. **Navigate to** `http://localhost:8081`
3. **You'll be redirected** to the auth page (`/auth`)
4. **Create an account** with your email and password
5. **Select user type** (Student or Landlord)
6. **Sign in** and you'll be redirected to the dashboard
7. **Check Supabase** - you should see the user in your database

## 📱 **User Dashboard Integration:**

Users are automatically stored in Supabase and can be viewed in your Supabase dashboard:

1. **Go to Supabase Dashboard**
2. **Navigate to Table Editor**
3. **Look for the `user` table**
4. **View registered users** with their information

## 🚨 **Important Notes:**

### **Production Considerations:**
- Set `requireEmailVerification: true` for production
- Use proper environment variables
- Set up proper CORS origins
- Enable HTTPS in production

### **Database Security:**
- Better Auth handles password hashing automatically
- Sessions are securely managed
- User data is properly validated

### **Customization:**
- Add social providers (Google, GitHub, etc.)
- Implement email verification
- Add two-factor authentication
- Customize user fields as needed

## 🔗 **Useful Links:**

- [Better Auth Documentation](https://www.better-auth.com/docs/introduction)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [Supabase Documentation](https://supabase.com/docs)

## 🎉 **You're All Set!**

Your FlatMate application now has a complete, production-ready authentication system powered by Better Auth and Supabase. Users can sign up, sign in, and their data is securely stored in your Supabase database.

The authentication system is fully integrated with your existing UI components and follows modern security best practices.
