import type { AdminUser } from '../../shared/types.js';
import { mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface AdminUserRow extends DbRow {
  id: string;
  username: string;
  password_hash: string;
  email: string | null;
  role: 'super_admin' | 'editor';
  last_login: string | null;
  is_active: number;
}

export function adminUserFromRow(r: AdminUserRow): AdminUser {
  return {
    id: r.id,
    username: r.username,
    email: r.email ?? undefined,
    role: r.role,
    lastLogin: r.last_login ?? undefined,
    isActive: toBool(r.is_active),
  };
}

export const adminUserRepo = {
  async findByUsername(username: string): Promise<(AdminUserRow & { passwordHash: string }) | null> {
    const rows = await queryRows<AdminUserRow>('SELECT * FROM admin_users WHERE username = ?', [username]);
    if (rows.length === 0) return null;
    return { ...rows[0], passwordHash: rows[0].password_hash };
  },

  async getById(id: string): Promise<AdminUser | null> {
    const rows = await queryRows<AdminUserRow>('SELECT * FROM admin_users WHERE id = ?', [id]);
    return rows.length > 0 ? adminUserFromRow(rows[0]) : null;
  },

  async updateLastLogin(id: string): Promise<void> {
    await mutate('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  },

  async create(input: { username: string; passwordHash: string; email?: string; role: 'super_admin' | 'editor' }): Promise<AdminUser> {
    const id = newId('au');
    await mutate(
      'INSERT INTO admin_users (id, username, password_hash, email, role, is_active) VALUES (?, ?, ?, ?, ?, 1)',
      [id, input.username, input.passwordHash, input.email ?? null, input.role],
    );
    return (await adminUserRepo.getById(id))!;
  },
};
