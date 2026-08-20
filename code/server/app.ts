import express from 'express';
import type { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { healthRouter } from './routes/health.js';
import { apiRouter } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

/** 组装 Express 应用（不含 listen，便于 supertest 测试） */
export function createApp(): Express {
  const app = express();
  app.disable('x-powered-by');

  app.use(helmet({ contentSecurityPolicy: false })); // 与前端 Vite 内联资源兼容，生产可再收紧
  app.use(cors({ origin: env.corsOrigin === true ? true : env.corsOrigin, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));

  // 公共 API 限流：100 次/分钟/IP（tech-spec NF-015）；test 环境跳过
  if (env.nodeEnv !== 'test') {
    app.use(
      '/api',
      rateLimit({
        windowMs: 60_000,
        limit: 100,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: { error: { message: '请求过于频繁，请稍后再试', code: 'RATE_LIMITED' } },
      }),
    );
  }

  app.use(healthRouter); // GET /health
  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
