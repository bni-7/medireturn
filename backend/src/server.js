import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';  // ← Changed: removed src/
import errorHandler, { notFound } from './middleware/errorHandler.js';  // ← Changed: removed src/

// Routes
import authRoutes from './routes/authRoutes.js';  // ← Changed: removed src/
import userRoutes from './routes/userRoutes.js';  // ← Changed: removed src/
import collectionPointRoutes from './routes/collectionPointRoutes.js';  // ← Changed: removed src/
import pickupRoutes from './routes/pickupRoutes.js';  // ← Changed: removed src/
import adminRoutes from './routes/adminRoutes.js';  // ← Changed: removed src/

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL  // Will be your Vercel URL
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collection-points', collectionPointRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});