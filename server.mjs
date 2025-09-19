import express from 'express';
import cors from 'cors';

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

// Mock auth endpoints for testing
app.post('/api/auth/sign-up/email', (req, res) => {
  console.log('Sign up request:', req.body);
  res.json({ 
    user: { 
      id: '1', 
      email: req.body.email, 
      name: req.body.name,
      createdAt: new Date().toISOString()
    },
    session: {
      id: 'session-1',
      userId: '1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

app.post('/api/auth/sign-in/email', (req, res) => {
  console.log('Sign in request:', req.body);
  res.json({ 
    user: { 
      id: '1', 
      email: req.body.email, 
      name: req.body.email.split('@')[0],
      createdAt: new Date().toISOString()
    },
    session: {
      id: 'session-1',
      userId: '1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

app.get('/api/auth/get-session', (req, res) => {
  res.json({ 
    user: { 
      id: '1', 
      email: 'test@example.com', 
      name: 'Test User',
      createdAt: new Date().toISOString()
    },
    session: {
      id: 'session-1',
      userId: '1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

app.post('/api/auth/sign-out', (req, res) => {
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock Auth server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
