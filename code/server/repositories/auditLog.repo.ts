import type { AuditLog } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, type DbRow } from './db.js';

export interface AuditRow extends DbRow {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_value: string | null;
  new_value: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function auditFromRow(r: AuditRow): AuditLog {
  return {
    id: r.id,
    userId: r.user_id ?? undefined,
    action: r.action,
    resourceType: r.resource_type,
    resourceId: r.resource_id ?? undefined,
    oldValue: jsonParse<unknown>(r.old_value, undefined),
    newValue: jsonParse<unknown>(r.new_value, undefined),
    ipAddress: r.ip_address ?? undefined,
    createdAt: r.created_at,
  };
}

export interface AuditInput {
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

export const auditLogRepo = {
  async insert(input: AuditInput): Promise<void> {
    await mutate(
      'INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newId('log'),
        input.userId ?? null,
        input.action,
        input.resourceType,
        input.resourceId ?? null,
        input.oldValue !== undefined ? JSON.stringify(input.oldValue) : null,
        input.newValue !== undefined ? JSON.stringify(input.newValue) : null,
        input.ipAddress ?? null,
        input.userAgent ?? null,
      ],
    );
  },

  async list(limit = 100): Promise<AuditLog[]> {
    const rows = await queryRows<AuditRow>('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?', [limit]);
    return rows.map(auditFromRow);
  },
};
