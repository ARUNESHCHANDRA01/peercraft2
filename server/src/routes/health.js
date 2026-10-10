import express from 'express';
import { config } from '../config.js';
import { store } from '../services/store.js';

const router = express.Router();
const startTime = Date.now();

router.get('/', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const studentsCount = store.getStudents().length;
  const resourcesCount = store.getResources().length;

  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    environment: config.nodeEnv,
    services: {
      application: {
        status: 'operational',
      },
      storage: {
        status: 'operational',
        provider: 'Persistent File Store (JSON + Memory Cache)',
        records: {
          students: studentsCount,
          resources: resourcesCount,
        },
      },
      dify: {
        configured: config.dify.isConfigured,
        status: config.dify.isConfigured ? 'configured' : 'unconfigured_fallback_active',
        engine: config.dify.isConfigured ? 'Dify Workflow (PEERCRAFT)' : 'Deterministic Local Scoring Engine',
        baseUrl: config.dify.baseUrl,
      },
    },
  });
});

export default router;
