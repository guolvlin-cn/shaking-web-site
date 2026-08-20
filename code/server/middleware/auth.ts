import type { RequestHandler } from 'express';
import { ApiError } from './error.js';
import { getUserFromToken } from '../services/auth.service.js';

/** 要求携带有效 JWT（Authorization: Bearer <token>），通过后注入 req.user */
export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      throw ApiError.unauthorized();
    }
    const user = await getUserFromToken(token);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized();
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
