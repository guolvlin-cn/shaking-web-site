import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

vi.mock('../repositories/adminUser.repo.js', () => ({
  adminUserRepo: { findByUsername: vi.fn(), getById: vi.fn(), updateLastLogin: vi.fn() },
}));
vi.mock('../repositories/auditLog.repo.js', () => ({ auditLogRepo: { insert: vi.fn() } }));

import { createApp } from '../app.js';
import { adminUserRepo } from '../repositories/adminUser.repo.js';
import { auditLogRepo } from '../repositories/auditLog.repo.js';

const app = createApp();
const HASH = bcrypt.hashSync('secret123', 4);

beforeEach(() => vi.clearAllMocks());

describe('POST /api/auth/login', () => {
  it('正确凭据返回 200 + token', async () => {
    vi.mocked(adminUserRepo.findByUsername).mockResolvedValue({
      id: 'au-1', username: 'admin', password_hash: HASH, email: null,
      role: 'super_admin', last_login: null, is_active: 1, passwordHash: HASH,
    } as never);
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.username).toBe('admin');
    expect(auditLogRepo.insert).toHaveBeenCalled();
  });

  it('错误密码返回 401', async () => {
    vi.mocked(adminUserRepo.findByUsername).mockResolvedValue({
      id: 'au-1', username: 'admin', password_hash: HASH, email: null,
      role: 'super_admin', last_login: null, is_active: 1, passwordHash: HASH,
    } as never);
    const res = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('缺少字段返回 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: '' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('无 token 返回 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('有效 token 返回用户信息', async () => {
    vi.mocked(adminUserRepo.getById).mockResolvedValue({
      id: 'au-1', username: 'admin', role: 'super_admin', isActive: true,
    } as never);
    // 用真实服务签发 token（findByUsername 模拟）
    vi.mocked(adminUserRepo.findByUsername).mockResolvedValue({
      id: 'au-1', username: 'admin', password_hash: HASH, email: null,
      role: 'super_admin', last_login: null, is_active: 1, passwordHash: HASH,
    } as never);
    const loginRes = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'secret123' });
    const token = loginRes.body.token as string;
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('admin');
  });

  it('非法 token 返回 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer bad.token.here');
    expect(res.status).toBe(401);
  });
});
