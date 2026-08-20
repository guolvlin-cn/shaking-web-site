import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

/**
 * 数据库迁移脚本（开发/部署工具，仅通过 tsx 运行，不参与 server 编译）
 * 用法: npm run db:migrate
 * 流程: 探测/创建库 → 带库连接执行 schema.sql
 * 说明: MatrixOne freetier 不支持 changeUser（errno 20101 unsupported command），
 *       因此不做 use-db 切换，而是以 database 参数建立第二个连接执行建表 SQL；
 *       freetier 若拒绝 CREATE DATABASE（errno 20101），先报错提示在云控制台建库。
 */
export async function runMigrate(conn: mysql.Connection): Promise<void> {
  const sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
  await conn.query(sql);
}

export async function migrate(): Promise<void> {
  // 1) 无库连接：确认目标库存在，缺失时尝试创建
  const probe = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
  });
  try {
    const [rows] = (await probe.query('SHOW DATABASES')) as [{ [k: string]: string }[], unknown];
    const exists = rows.some((r) => Object.values(r)[0] === env.db.database);
    if (!exists) {
      try {
        await probe.query(
          `CREATE DATABASE \`${env.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        );
      } catch (err) {
        throw new Error(
          `database "${env.db.database}" does not exist and CREATE DATABASE was rejected: ${(err as Error).message}`,
        );
      }
    } else {
      console.log(`[db:migrate] database ${env.db.database} exists`);
    }
  } finally {
    await probe.end();
  }

  // 2) 带库连接：执行建表 SQL
  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
  });
  try {
    await runMigrate(conn);
    console.log(`[db:migrate] schema applied to ${env.db.database}`);
  } finally {
    await conn.end();
  }
}

const isCli = process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isCli) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[db:migrate] failed:', err);
      process.exit(1);
    });
}
