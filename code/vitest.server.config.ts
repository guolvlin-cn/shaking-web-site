import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['server/**/*.test.ts'],
    // 后端测试不依赖前端 jsdom 配置
    setupFiles: [],
  },
});
