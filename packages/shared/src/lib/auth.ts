import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || "postgresql://postgres:%23Lusanda04!@db.jktoowmuzjjvmpeitgxw.supabase.co:5432/postgres",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    // Add social providers later if needed
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      user_type: {
        type: "string",
        required: false,
      },
      full_name: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      profile_photo_url: {
        type: "string",
        required: false,
      },
      preferences: {
        type: "json",
        required: false,
      },
      verified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  plugins: [],
  trustedOrigins: ["http://localhost:8081", "http://localhost:5173"],
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development"
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;