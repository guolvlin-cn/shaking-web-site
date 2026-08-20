import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from './About';
import { SITE } from '../data/site';

vi.mock('../hooks/useContentQueries', () => ({
  useSiteConfig: () => ({
    data: { site: SITE, socialLinks: [], heroSlides: [], quickJumpSections: [], announcement: '' },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

function renderAbout() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );
}

describe('关于页 (Issue #12)', () => {
  it('TC-01 个人档案字段完整', () => {
    renderAbout();
    expect(screen.getAllByText('谢可寅').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Shaking Chloe').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1997-01-04/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/四川成都/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/南京艺术学院/).length).toBeGreaterThan(0);
  });

  it('TC-02 粉丝文化信息', () => {
    renderAbout();
    expect(screen.getByText('虎卫队（简称虎丝）')).toBeInTheDocument();
    expect(screen.getByText('可寅银')).toBeInTheDocument();
  });

  it('TC-03 成就列表渲染', () => {
    renderAbout();
    expect(screen.getByTestId('achievement-第 11 届文荣奖年度瞩目青年演员')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-THE9 出道 · Rap 担当')).toBeInTheDocument();
  });

  it('TC-04 代表作品跳转专区', () => {
    renderAbout();
    const link = screen.getByText('Black Cupid').closest('a');
    expect(link).toHaveAttribute('href', '/music');
    const the9 = screen.getByText('THE9').closest('a');
    expect(the9).toHaveAttribute('href', '/works');
  });

  it('TC-05 社交链接', () => {
    renderAbout();
    expect(screen.getByText('微博 @谢可寅')).toBeInTheDocument();
    expect(screen.getByText('Instagram @shaking_chole')).toBeInTheDocument();
  });
});
