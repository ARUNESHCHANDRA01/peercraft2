import app from './app.js';
import { config } from './config.js';

const server = app.listen(config.port, () => {
  console.log(`===============================================`);
  console.log(` PeerCraft Server running on port ${config.port}`);
  console.log(` Health Check: http://localhost:${config.port}/api/health`);
  console.log(` Dify Status: ${config.dify.isConfigured ? 'Live Configured' : 'Local Deterministic Fallback'}`);
  console.log(` Environment: ${config.nodeEnv}`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default server;
