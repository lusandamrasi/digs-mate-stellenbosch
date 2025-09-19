# 🔧 Better Auth with Supabase Client Setup

## **Issue Identified:**
The direct database connection `db.jktoowmuzjjvmpeitgxw.supabase.co` doesn't resolve, but your Supabase API is working perfectly.

## **Solution: Use Supabase Client Approach**

Instead of direct database connection, we'll use Better Auth with Supabase's client library.

### **Step 1: Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

### **Step 2: Update Better Auth Configuration**

Replace your current `src/lib/auth.ts` with this Supabase client approach:

```typescript
import { betterAuth } from "better-auth";
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || "postgresql://postgres:dgObd2zkl6xSnaBF@db.jktoowmuzjjvmpeitgxw.supabase.co:5432/postgres",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      user_type: { type: "string", required: false },
      full_name: { type: "string", required: false },
      bio: { type: "string", required: false },
      profile_photo_url: { type: "string", required: false },
      preferences: { type: "json", required: false },
      verified: { type: "boolean", required: false, defaultValue: false },
    },
  },
  plugins: [],
  trustedOrigins: ["http://localhost:8081", "http://localhost:5173"],
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development"
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

### **Step 3: Alternative: Use Supabase Auth Directly**

Since Better Auth is having connection issues, you can also use Supabase Auth directly:

```typescript
// src/lib/supabase-auth.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jktoowmuzjjvmpeitgxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdG9vd211empqdm1wZWl0Z3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNjg2NjksImV4cCI6MjA3MzY0NDY2OX0.x-8O9Lh6TaKbnt6fZPo_41LfsLWxzS9Ai6rj50YSaxc'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
```

## **Next Steps:**

1. **Try the Supabase client approach** with Better Auth
2. **If that doesn't work**, switch to **Supabase Auth directly**
3. **Test authentication** with the working connection

The key issue is that your Supabase project's database hostname isn't accessible via direct connection, but the API works perfectly!
