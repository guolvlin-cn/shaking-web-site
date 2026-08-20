import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Stage from './Stage';
import { STAGE_EVENTS } from '../data/stage';

vi.mock('../hooks/useContentQueries', () => ({
  useStage: () => ({ data: STAGE_EVENTS, isLoading: false, isError: false, refetch: vi.fn() }),
}));

function renderStage() {
  return render(
    <MemoryRouter>
      <Stage />
    </MemoryRouter>,
  );
}

describe('舞台活动页 (Issue #8)', () => {
  it('TC-01 全部舞台活动渲染', () => {
    renderStage();
    for (const e of STAGE_EVENTS) {
      expect(screen.getByTestId(`stage-card-${e.id}`)).toBeInTheDocument();
    }
  });

  it('TC-02 分类 Tab 切换（音乐节）', () => {
    renderStage();
    fireEvent.click(screen.getByTestId('stage-tab-音乐节'));
    const festivals = STAGE_EVENTS.filter((e) => e.category === '音乐节');
    const other = STAGE_EVENTS.find((e) => e.category !== '音乐节');
    for (const e of festivals) {
      expect(screen.getByTestId(`stage-card-${e.id}`)).toBeInTheDocument();
    }
    if (other) {
      expect(screen.queryByTestId(`stage-card-${other.id}`)).not.toBeInTheDocument();
    }
  });

  it('TC-03 卡片含日期/地点/表演内容', () => {
    renderStage();
    expect(screen.getAllByText('2023-12-31').length).toBeGreaterThan(0);
    expect(screen.getAllByText('北京').length).toBeGreaterThan(0);
    expect(screen.getByText('《Comet》+ 经典曲目串烧')).toBeInTheDocument();
  });

  it('TC-04 点击查看图集打开灯箱', () => {
    renderStage();
    fireEvent.click(screen.getAllByText(/查看图集/)[0]);
    expect(screen.getByTestId('lightbox')).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
  });

  it('TC-05 灯箱右方向键切换', () => {
    renderStage();
    fireEvent.click(screen.getAllByText(/查看图集/)[0]);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
  });

  it('TC-06 ESC 关闭灯箱', () => {
    renderStage();
    fireEvent.click(screen.getAllByText(/查看图集/)[0]);
    expect(screen.getByTestId('lightbox')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();
  });

  it('TC-07 活动按时间倒序', () => {
    renderStage();
    const dates = STAGE_EVENTS.map((e) => e.date).sort((a, b) => b.localeCompare(a));
    expect(dates[0]).toBe('2024-01-01');
    expect(screen.getAllByText('微博之夜').length).toBeGreaterThan(0);
  });
});
