import { Router } from 'express';
import { contentRouter } from './content.routes.js';
import { siteConfigRouter } from './siteConfig.routes.js';
import { chatRouter } from './chat.routes.js';
import { authRouter } from './auth.routes.js';

/**
 * API 总路由：
 * 公开：/api/works /api/timeline /api/photos /api/music /api/variety
 *      /api/stage /api/interviews /api/site-config /api/chat
 * 管理：/api/auth/login /api/auth/me
 */
export const apiRouter = Router();

apiRouter.use(contentRouter);
apiRouter.use(siteConfigRouter);
apiRouter.use(chatRouter);
apiRouter.use(authRouter);
