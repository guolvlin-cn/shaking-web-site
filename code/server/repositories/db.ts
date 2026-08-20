import { randomUUID } from 'node:crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../db/pool.js';

/** 查询行类型基类 */
export type DbRow = RowDataPacket;

/** 查询多行 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mysql2 参数为异构值，运行时由驱动校验
export async function queryRows<T extends DbRow>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

/** 写操作（INSERT/UPDATE/DELETE） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mysql2 参数为异构值，运行时由驱动校验
export async function mutate(sql: string, params?: any[]): Promise<ResultSetHeader> {
  const [result] = await pool.execute(sql, params);
  return result as ResultSetHeader;
}

/** 生成带前缀短 UUID 主键（如 works-3f2a91c7） */
export function newId(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

export function toBool(v: unknown): boolean {
  return v === 1 || v === true;
}

/** JSON 列解析（容错：空/非法返回 fallback） */
export function jsonParse<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  try {
    return typeof v === 'string' ? (JSON.parse(v) as T) : (v as T);
  } catch {
    return fallback;
  }
}
