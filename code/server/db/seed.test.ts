import { describe, expect, it, vi } from 'vitest';
import {
  buildAdminRows,
  buildFaqRows,
  buildInterviewRows,
  buildMusicRows,
  buildPhotoRows,
  buildSiteConfigRows,
  buildStageRows,
  buildTimelineRows,
  buildVarietyRows,
  buildWorkRows,
  runSeed,
} from './seed.js';

describe('seed 行构建器', () => {
  it('works：10 条，字段映射 snake_case + tags JSON', () => {
    const rows = buildWorkRows();
    expect(rows).toHaveLength(10);
    const w = rows[0] as Record<string, unknown>;
    expect(w).toHaveProperty('id');
    expect(w).toHaveProperty('release_date');
    expect(w).toHaveProperty('external_link');
    expect(typeof w.tags).toBe('string'); // JSON 序列化
  });

  it('timeline / photos / music / variety / stage / interviews / faq 数量与映射', () => {
    expect(buildTimelineRows()).toHaveLength(9);
    expect(buildPhotoRows()).toHaveLength(12);
    expect(buildMusicRows()).toHaveLength(7);
    expect(buildVarietyRows()).toHaveLength(4);
    expect(buildStageRows()).toHaveLength(5);
    expect(buildInterviewRows()).toHaveLength(4);
    const faq = buildFaqRows();
    expect(faq).toHaveLength(8);
    expect(faq[0]).toMatchObject({ keywords: JSON.stringify(['是谁', '介绍', '谢可寅', '个人']) });
  });

  it('site_configs：5 个配置键', () => {
    const rows = buildSiteConfigRows();
    const keys = rows.map((r) => r.config_key);
    expect(keys).toEqual(
      expect.arrayContaining(['site_profile', 'social_links', 'hero_slides', 'quick_jump_sections', 'announcement']),
    );
  });

  it('admin：bcrypt 哈希 + 环境变量用户名', async () => {
    const rows = await buildAdminRows();
    expect(rows).toHaveLength(1);
    const admin = rows[0] as Record<string, unknown>;
    expect(admin.username).toBe('admin'); // env 默认值
    expect(String(admin.password_hash)).toMatch(/^\$2[aby]\$/); // bcrypt
  });
});

describe('runSeed（mock 连接）', () => {
  it('按表顺序 DELETE + INSERT，管理员单独处理', async () => {
    const query = vi.fn().mockResolvedValue([{ affectedRows: 1 }] as never);
    const conn = { query } as never;

    await runSeed(conn);

    // 9 张内容表 ×2（DELETE+INSERT）+ admin DELETE + admin INSERT
    expect(query).toHaveBeenCalledTimes(20);
    const sqls = query.mock.calls.map((c) => String(c[0]));
    expect(sqls[0]).toBe('DELETE FROM works');
    expect(sqls[1]).toContain('INSERT INTO works');
    expect(sqls).toContain('DELETE FROM admin_users');
    // INSERT 带完整字段列表，用拼接后子串匹配
    expect(sqls.join('\n')).toContain('INSERT INTO admin_users');
  });
});
