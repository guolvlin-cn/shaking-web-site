import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../repositories/qaKnowledge.repo.js', () => ({
  qaKnowledgeRepo: { listActive: vi.fn() },
}));

import { answerQuestion, FALLBACK_ANSWER } from './chat.service.js';
import { qaKnowledgeRepo } from '../repositories/qaKnowledge.repo.js';

const mockList = qaKnowledgeRepo.listActive as ReturnType<typeof vi.fn>;

beforeEach(() => mockList.mockReset());

describe('answerQuestion', () => {
  it('关键词命中返回 matched 答案', async () => {
    mockList.mockResolvedValue([
      { id: '1', keywords: ['是谁', '介绍'], answer: '谢可寅是歌手、演员。', source: '官方', category: 'general', isActive: true },
    ]);
    const reply = await answerQuestion('谢可寅是谁？');
    expect(reply).toMatchObject({ answer: '谢可寅是歌手、演员。', fallbackType: 'matched', source: '官方' });
  });

  it('未命中返回 generic 兜底', async () => {
    mockList.mockResolvedValue([
      { id: '1', keywords: ['是谁'], answer: 'a', source: 's', category: 'g', isActive: true },
    ]);
    const reply = await answerQuestion('今天天气怎么样');
    expect(reply.isFallback).toBe(true);
    expect(reply.fallbackType).toBe('generic');
    expect(reply.answer).toBe(FALLBACK_ANSWER);
  });

  it('知识库为空时兜底', async () => {
    mockList.mockResolvedValue([]);
    const reply = await answerQuestion('随便问问');
    expect(reply.fallbackType).toBe('generic');
  });
});
