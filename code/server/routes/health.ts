import { Router } from 'express';
import { env } from '../config/env.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'shaking-web-api',
    version: '0.1.0',
    env: env.nodeEnv,
    time: new Date().toISOString(),
  });
});
