import type { FaqEntry } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface QaRow extends DbRow {
  id: string;
  question: string | null;
  keywords: string | null;
  answer: string;
  category: string | null;
  source: string | null;
  is_active: number;
}

export function qaFromRow(r: QaRow): FaqEntry {
  return {
    id: r.id,
    keywords: jsonParse<string[]>(r.keywords, []),
    answer: r.answer,
    source: r.source ?? '',
    category: r.category ?? undefined,
    isActive: toBool(r.is_active),
  };
}

export type QaInput = Omit<FaqEntry, 'id' | 'isActive'> & { isActive?: boolean };

const BASE = 'SELECT * FROM qa_knowledge';
const COLS = 'question,keywords,answer,category,source,is_active';

function toParams(q: QaInput): unknown[] {
  return [
    null, // question（MOI 语义检索预留）
    JSON.stringify(q.keywords ?? []),
    q.answer,
    q.category ?? null,
    q.source ?? null,
    q.isActive === false ? 0 : 1,
  ];
}

export const qaKnowledgeRepo = {
  async listActive(): Promise<FaqEntry[]> {
    const rows = await queryRows<QaRow>(`${BASE} WHERE is_active = TRUE`);
    return rows.map(qaFromRow);
  },
  async listAll(): Promise<FaqEntry[]> {
    const rows = await queryRows<QaRow>(`${BASE} ORDER BY id ASC`);
    return rows.map(qaFromRow);
  },
  async getById(id: string): Promise<FaqEntry | null> {
    const rows = await queryRows<QaRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? qaFromRow(rows[0]) : null;
  },
  async create(input: QaInput): Promise<FaqEntry> {
    const id = newId('qa');
    await mutate(`INSERT INTO qa_knowledge (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await qaKnowledgeRepo.getById(id))!;
  },
  async update(id: string, input: QaInput): Promise<FaqEntry | null> {
    await mutate(`UPDATE qa_knowledge SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return qaKnowledgeRepo.getById(id);
  },
  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM qa_knowledge WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
