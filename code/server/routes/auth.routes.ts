import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../services/auth.service.js';
import { requireAuth } from '../middleware/auth.js';
import { auditLogRepo } from '../repositories/auditLog.repo.js';
import { ApiError } from '../middleware/error.js';
import { env } from '../config/env.js';

export const authRouter = Router();

// 登录接口限流：10 次/分钟/IP，防暴力破解（test 环境跳过）
const loginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: '尝试过于频繁，请 1 分钟后再试', code: 'RATE_LIMITED' } },
});

const loginMiddlewares: import('express').RequestHandler[] = [];
if (env.nodeEnv !== 'test') {
  loginMiddlewares.push(loginLimiter);
}

authRouter.post('/auth/login', loginMiddlewares, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = (req.body ?? {}) as { username?: unknown; password?: unknown };
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
      throw ApiError.badRequest('用户名和密码不能为空');
    }
    const result = await login(username.trim(), password);
    void auditLogRepo.insert({
      userId: result.user.id,
      action: 'login',
      resourceType: 'auth',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.get('/auth/me', requireAuth, (req, res) => {
  res.json(req.user);
});
