import type { ChatReply } from '../../shared/types.js';
import { qaKnowledgeRepo } from '../repositories/qaKnowledge.repo.js';

export const FALLBACK_ANSWER =
  '抱歉，我暂时没有找到关于这个问题的答案。你可以尝试问「谢可寅是谁」「有哪些代表作品」「粉丝名叫什么」等常见问题。';

export const MAINTENANCE_MESSAGE = '问答服务维护中，当前使用本地知识库回答，部分问题可能无法覆盖。';

/**
 * 基于 qa_knowledge 关键词匹配的本地问答（MOI 语义检索接入前的兜底方案）
 */
export async function answerQuestion(question: string): Promise<ChatReply> {
  const entries = await qaKnowledgeRepo.listActive();
  const q = question.toLowerCase();
  const hit = entries.find((e) => e.keywords.some((k) => q.includes(k.toLowerCase())));
  if (hit) {
    return { answer: hit.answer, source: hit.source, isFallback: true, fallbackType: 'matched' };
  }
  return { answer: FALLBACK_ANSWER, isFallback: true, fallbackType: 'generic' };
}
