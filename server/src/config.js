import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, fallback to root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = parseInt(process.env.PORT || '3001', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const DIFY_API_KEY = process.env.DIFY_API_KEY?.trim() || '';
const DIFY_BASE_URL = (process.env.DIFY_BASE_URL || 'https://api.dify.ai').replace(/\/+$/, '');

const isDifyConfigured = Boolean(
  DIFY_API_KEY &&
  DIFY_API_KEY !== 'your-dify-api-key-here' &&
  DIFY_API_KEY.length > 5
);

export const config = {
  port: PORT,
  nodeEnv: NODE_ENV,
  corsOrigin: CORS_ORIGIN,
  dify: {
    apiKey: DIFY_API_KEY,
    baseUrl: DIFY_BASE_URL,
    isConfigured: isDifyConfigured,
  },
};
