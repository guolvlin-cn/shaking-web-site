import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { AdminUser, LoginResponse } from '../../shared/types.js';
import { adminUserRepo } from '../repositories/adminUser.repo.js';
import { ApiError } from '../middleware/error.js';
import { env } from '../config/env.js';

export function signToken(user: AdminUser): string {
  return jwt.sign({ sub: user.id, username: user.username, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

/** 登录：bcrypt 校验 + 签发 JWT + 记录 last_login */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const row = await adminUserRepo.findByUsername(username);
  if (!row || row.is_active !== 1) {
    throw ApiError.unauthorized('账号或密码错误');
  }
  const ok = await bcrypt.compare(password, row.passwordHash);
  if (!ok) {
    throw ApiError.unauthorized('账号或密码错误');
  }
  const user: AdminUser = {
    id: row.id,
    username: row.username,
    email: row.email ?? undefined,
    role: row.role,
    isActive: true,
  };
  void adminUserRepo.updateLastLogin(row.id);
  return { token: signToken(user), user };
}

/** 解析 token → 管理员；无效/过期返回 null */
export async function getUserFromToken(token: string): Promise<AdminUser | null> {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    return await adminUserRepo.getById(payload.sub);
  } catch {
    return null;
  }
}
