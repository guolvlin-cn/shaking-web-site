import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TimelinePage from './Timeline';
import { TIMELINE_EVENTS } from '../data/timeline';

function renderTimeline() {
  return render(
    <MemoryRouter>
      <TimelinePage />
    </MemoryRouter>,
  );
}

describe('成长时间线页 (Issue #4)', () => {
  it('TC-01 页面标题与副标题渲染', () => {
    renderTimeline();
    expect(screen.getByText('成长时间线')).toBeInTheDocument();
    expect(screen.getByText('从选秀舞台到全能艺人')).toBeInTheDocument();
  });

  it('TC-02 事件按时间倒序渲染', () => {
    renderTimeline();
    const years = [...screen.getAllByTestId(/timeline-year-/)].map((el) => el.dataset.testid);
    // 数据最新 2026 在前
    const firstYear = years[0];
    expect(firstYear).toContain('2026');
  });

  it('TC-03 全部事件节点渲染', () => {
    renderTimeline();
    for (const ev of TIMELINE_EVENTS) {
      expect(screen.getByTestId(`timeline-card-${ev.id}`)).toBeInTheDocument();
    }
  });

  it('TC-04 筛选标签切换（音乐）', () => {
    renderTimeline();
    fireEvent.click(screen.getByRole('button', { name: '音乐' }));
    const musicEvents = TIMELINE_EVENTS.filter((e) => e.category === '音乐');
    expect(musicEvents.length).toBeGreaterThan(0);
    for (const ev of musicEvents) {
      expect(screen.getByTestId(`timeline-card-${ev.id}`)).toBeInTheDocument();
    }
    // 非音乐事件不应渲染
    const nonMusic = TIMELINE_EVENTS.find((e) => e.category !== '音乐');
    if (nonMusic) {
      expect(screen.queryByTestId(`timeline-card-${nonMusic.id}`)).not.toBeInTheDocument();
    }
  });

  it('TC-05 点击展开详情', () => {
    renderTimeline();
    const card = screen.getByTestId('timeline-card-tl-001');
    expect(screen.queryByText('相关作品 →')).not.toBeInTheDocument();
    fireEvent.click(card);
    expect(screen.getAllByText('相关作品 →').length).toBeGreaterThan(0);
    expect(screen.getByText('收起')).toBeInTheDocument();
  });

  it('TC-06 再次点击收起', () => {
    renderTimeline();
    const card = screen.getByTestId('timeline-card-tl-001');
    fireEvent.click(card);
    fireEvent.click(card);
    expect(screen.queryByText('收起')).not.toBeInTheDocument();
  });

  it('TC-07 相关作品链接跳转 /works', () => {
    renderTimeline();
    const card = screen.getByTestId('timeline-card-tl-001');
    fireEvent.click(card);
    const link = screen.getAllByText('相关作品 →')[0].closest('a');
    expect(link).toHaveAttribute('href', '/works');
  });

  it('TC-08 年份分组存在', () => {
    renderTimeline();
    // 2020 / 2026 等年份标记
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });
});
