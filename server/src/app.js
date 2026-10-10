import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import healthRouter from './routes/health.js';
import teamFinderRouter from './routes/teamFinder.js';
import profilesRouter from './routes/profiles.js';
import resourcesRouter from './routes/resources.js';
import creditsRouter from './routes/credits.js';
import reputationRouter from './routes/reputation.js';
import dashboardRouter from './routes/dashboard.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security & Parsing Middleware
app.use(cors({
  origin: [config.corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// Lightweight request logging
app.use((req, res, next) => {
  if (config.nodeEnv !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Route Registrations
app.use('/api/health', healthRouter);
app.use('/api/team-finder', teamFinderRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/credits', creditsRouter);
app.use('/api/reputation', reputationRouter);
app.use('/api/dashboard', dashboardRouter);

// Catch-all 404 for unmatched API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
