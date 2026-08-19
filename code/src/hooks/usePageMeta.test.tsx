import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import usePageMeta from './usePageMeta';

function renderMetaHook(path: string) {
  return renderHook(() => usePageMeta(), {
    wrapper: ({ children }) => <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>,
  });
}

describe('SEO Meta 标签 (Issue #16)', () => {
  it('TC-03 首页设置独立 title 与 description', async () => {
    renderMetaHook('/');
    await waitFor(() => {
      expect(document.title).toBe('Shaking Chloe 谢可寅 - 个人展示网站');
    });
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      expect.stringContaining('个人展示网站'),
    );
  });

  it('TC-04 作品页设置独立 title 与 OG 标签', async () => {
    renderMetaHook('/works');
    await waitFor(() => {
      expect(document.title).toBe('作品合集 - Shaking Chloe 谢可寅');
    });
    const og = document.querySelector('meta[property="og:title"]');
    expect(og).toHaveAttribute('content', '作品合集 - Shaking Chloe 谢可寅');
  });
});
