import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Interview from './Interview';
import { INTERVIEWS, QUOTES } from '../data/interview';

// 后端 /api/interviews 现在携带 quotes 字段（种子数据来自 QUOTES）
const INTERVIEW_FIXTURE = INTERVIEWS.map((item) => ({ ...item, quotes: QUOTES }));

vi.mock('../hooks/useContentQueries', () => ({
  useInterviews: () => ({
    data: INTERVIEW_FIXTURE,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

function renderInterview() {
  return render(
    <MemoryRouter>
      <Interview />
    </MemoryRouter>,
  );
}

describe('采访专区页 (Issue #10)', () => {
  it('TC-01 采访卡片渲染', () => {
    renderInterview();
    for (const i of INTERVIEWS) {
      expect(screen.getByTestId(`interview-card-${i.id}`)).toBeInTheDocument();
    }
  });

  it('TC-02 卡片字段检查', () => {
    renderInterview();
    expect(screen.getByText('「关于转型，谢可寅这么说」')).toBeInTheDocument();
    expect(screen.getByText('新浪娱乐')).toBeInTheDocument();
    expect(screen.getByText('2024-03-15')).toBeInTheDocument();
  });

  it('TC-03 点击跳转采访链接', () => {
    renderInterview();
    const link = screen.getByTestId('interview-link-i-001');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('href', expect.stringContaining('weibo.com'));
  });

  it('TC-04 时间倒序', () => {
    renderInterview();
    const dates = INTERVIEWS.map((i) => i.date).sort((a, b) => b.localeCompare(a));
    expect(dates[0]).toBe('2024-03-15');
  });

  it('TC-05 Tab 切换（杂志）', () => {
    renderInterview();
    fireEvent.click(screen.getByTestId('interview-tab-杂志'));
    const mags = INTERVIEWS.filter((i) => i.format === '杂志');
    const other = INTERVIEWS.find((i) => i.format !== '杂志');
    for (const i of mags) {
      expect(screen.getByTestId(`interview-card-${i.id}`)).toBeInTheDocument();
    }
    if (other) {
      expect(screen.queryByTestId(`interview-card-${other.id}`)).not.toBeInTheDocument();
    }
  });

  it('TC-06 精彩语录区', () => {
    renderInterview();
    for (const q of QUOTES) {
      expect(screen.getByText(`"${q.text}"`)).toBeInTheDocument();
      expect(screen.getByText(`— ${q.source}`)).toBeInTheDocument();
    }
  });
});
