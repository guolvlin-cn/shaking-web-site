import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcryptjs';

vi.mock('../repositories/adminUser.repo.js', () => ({
  adminUserRepo: { findByUsername: vi.fn(), getById: vi.fn(), updateLastLogin: vi.fn() },
}));

import { getUserFromToken, login, signToken } from './auth.service.js';
import { adminUserRepo } from '../repositories/adminUser.repo.js';
import { ApiError } from '../middleware/error.js';

const mockFind = vi.mocked(adminUserRepo.findByUsername);
const mockGetById = vi.mocked(adminUserRepo.getById);

const HASH = bcrypt.hashSync('secret123', 4);
const USER_ROW = {
  id: 'au-1',
  username: 'admin',
  password_hash: HASH,
  email: null,
  role: 'super_admin',
  last_login: null,
  is_active: 1,
  passwordHash: HASH,
};

beforeEach(() => vi.clearAllMocks());

describe('login', () => {
  it('正确凭据返回 token + user，并更新 last_login', async () => {
    mockFind.mockResolvedValue(USER_ROW as never);
    const result = await login('admin', 'secret123');
    expect(result.user.username).toBe('admin');
    expect(result.token).toBeTruthy();
    expect(adminUserRepo.updateLastLogin).toHaveBeenCalledWith('au-1');
  });

  it('错误密码抛 401', async () => {
    mockFind.mockResolvedValue(USER_ROW as never);
    await expect(login('admin', 'wrong')).rejects.toMatchObject({ status: 401 });
  });

  it('用户不存在抛 401', async () => {
    mockFind.mockResolvedValue(null);
    await expect(login('nobody', 'x')).rejects.toMatchObject({ status: 401 });
  });

  it('禁用用户抛 401', async () => {
    mockFind.mockResolvedValue({ ...USER_ROW, is_active: 0 } as never);
    await expect(login('admin', 'secret123')).rejects.toMatchObject({ status: 401 });
  });
});

describe('JWT roundtrip', () => {
  it('signToken → getUserFromToken 还原用户', async () => {
    const user = { id: 'au-1', username: 'admin', role: 'super_admin' as const, isActive: true };
    mockGetById.mockResolvedValue(user as never);
    const token = signToken(user);
    const got = await getUserFromToken(token);
    expect(got?.id).toBe('au-1');
  });

  it('无效 token 返回 null', async () => {
    const got = await getUserFromToken('invalid.token.value');
    expect(got).toBeNull();
  });
});

describe('ApiError 辅助', () => {
  it('unauthorized 状态码 401', () => {
    expect(ApiError.unauthorized()).toMatchObject({ status: 401 });
  });
});
