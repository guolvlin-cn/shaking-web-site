import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

// 从项目根加载 .env（存在时生效）；无 .env 时回退到 server/config/db.local.json（开发期本地 DB 配置）
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../.env') });

interface DbLocalConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

/**
 * 开发期本地 DB 覆盖（server/config/db.local.json，已 gitignore）。
 * 优先级：环境变量/.env > db.local.json > 内置默认值。
 */
function loadDbLocal(): DbLocalConfig | null {
  try {
    const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'db.local.json');
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, 'utf8')) as DbLocalConfig;
  } catch {
    return null;
  }
}

const dbLocal = loadDbLocal();

export interface ServerEnv {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  jwtSecret: string;
  jwtExpiresIn: SignOptions['expiresIn'];
  corsOrigin: string | boolean;
  admin: {
    initialUsername: string;
    initialPassword: string;
  };
}

const nodeEnv = (process.env.NODE_ENV ?? 'development') as ServerEnv['nodeEnv'];

export const env: ServerEnv = {
  nodeEnv,
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? dbLocal?.host ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? dbLocal?.port ?? 6001),
    user: process.env.DB_USER ?? dbLocal?.user ?? 'root',
    password: process.env.DB_PASSWORD ?? dbLocal?.password ?? '',
    database: process.env.DB_NAME ?? dbLocal?.database ?? 'shaking_web',
  },
  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-insecure-secret-change-in-production',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? '12h') as SignOptions['expiresIn'],
  corsOrigin: process.env.CORS_ORIGIN === '*' ? true : (process.env.CORS_ORIGIN ?? true),
  admin: {
    initialUsername: process.env.ADMIN_INITIAL_USERNAME ?? 'admin',
    initialPassword: process.env.ADMIN_INITIAL_PASSWORD ?? 'admin123456',
  },
};
