# Better Auth Testing Guide

## 🚀 **Quick Setup for Testing**

I've created a mock authentication server to test the authentication flow while we work on the full Better Auth integration.

### **Running the Application:**

**Terminal 1 - Auth Server (Port 8080):**
```bash
npm run dev:auth
```

**Terminal 2 - Frontend (Port 8081):**
```bash
npm run dev -- --port 8081
```

### **Testing the Authentication:**

1. **Visit** `http://localhost:8081`
2. **You'll be redirected** to `/auth` (authentication page)
3. **Try signing up** with any email and password
4. **The mock server** will accept any credentials and return a mock user
5. **You'll be redirected** to the dashboard after successful signup/signin

### **What's Working:**

✅ **Authentication Flow** - Sign up and sign in  
✅ **Protected Routes** - Automatic redirect to auth page  
✅ **Session Management** - Mock session handling  
✅ **CORS Configuration** - Proper cross-origin requests  
✅ **UI Components** - Beautiful auth forms with dark theme  
✅ **Navigation** - Logout button in header dropdown  

### **Mock Server Endpoints:**

- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - User login  
- `GET /api/auth/get-session` - Get current session
- `POST /api/auth/sign-out` - User logout
- `GET /health` - Server health check

### **Next Steps for Full Implementation:**

1. **Set up Supabase database** with Better Auth tables
2. **Configure environment variables** with real database connection
3. **Replace mock server** with actual Better Auth server
4. **Add custom user fields** (user_type, full_name, etc.)
5. **Implement email verification** for production

### **Current Status:**

The authentication system is **fully functional** with mock data. Users can:
- Sign up with email/password
- Sign in with existing credentials  
- Stay logged in across page refreshes
- Logout and be redirected to auth page
- Access protected routes only when authenticated

The UI is **production-ready** with:
- Responsive design
- Dark theme integration
- Loading states
- Error handling
- Beautiful forms

### **Testing Commands:**

```bash
# Test auth server health
curl http://localhost:8080/health

# Test sign up
curl -X POST http://localhost:8080/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test sign in  
curl -X POST http://localhost:8080/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🎉 **Ready to Test!**

Your authentication system is now working with mock data. You can test the complete user flow and see how the authentication integrates with your FlatMate application!
