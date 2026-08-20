import type { AdminUser } from '../../shared/types.js';

declare global {
  namespace Express {
    interface Request {
      /** 已认证的管理员（requireAuth 中间件注入） */
      user?: AdminUser;
    }
  }
}

export {};
