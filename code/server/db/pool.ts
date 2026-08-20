import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

/**
 * MatrixOne 连接池（MySQL 协议兼容）
 * 连接参数来自环境变量（见 server/config/env.md）
 */
export const pool: mysql.Pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z',
});

export default pool;
