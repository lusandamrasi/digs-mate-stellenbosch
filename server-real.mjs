import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './src/lib/auth.ts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? 'Set' : 'Not set');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:8081',  // Your React app
    'http://localhost:3000',  // Common React dev server
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth API routes
app.use('/api/auth', toNodeHandler(auth));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Better Auth server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Auth endpoints: http://localhost:${PORT}/api/auth/*`);
});
