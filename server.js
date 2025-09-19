import express from 'express';
import cors from 'cors';
import { auth } from './src/lib/auth.ts';

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration - MUST be before other middleware
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:8081',  // Your React Native web/Expo
    'http://localhost:3000',  // Common React dev server
    'http://127.0.0.1:8081',  // Alternative localhost format
  ],
  credentials: true,  // This is crucial for Better Auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Middleware
app.use(express.json());

// Better Auth API routes
app.all('/api/auth/*', auth.handler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Better Auth server running on port ${PORT}`);
});