import { Router } from 'express';
import type { RequestHandler } from 'express';
import { answerQuestion } from '../services/chat.service.js';

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const chatRouter = Router();

chatRouter.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
    if (!question) {
      res.status(400).json({ error: { message: 'question 不能为空', code: 'BAD_REQUEST' } });
      return;
    }
    if (question.length > 500) {
      res.status(400).json({ error: { message: '问题过长（最多 500 字）', code: 'BAD_REQUEST' } });
      return;
    }
    res.json(await answerQuestion(question));
  }),
);
