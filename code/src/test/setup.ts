import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom 不实现 IntersectionObserver，提供最小 mock（不自动触发回调，避免测试不可控）
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
    MockIntersectionObserver;
}

