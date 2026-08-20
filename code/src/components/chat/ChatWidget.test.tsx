import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWidget from './ChatWidget';

// 模拟后端 /api/chat：命中本地知识库返回答案；未命中抛错（触发维护提示）
const { mutateAsync } = vi.hoisted(() => ({
  mutateAsync: vi.fn(async (question: string) => {
    if (question.includes('谢可寅是谁')) {
      return {
        answer: '谢可寅（Shaking Chloe）——歌手、演员、Rapper',
        source: '来自官方资料',
        isFallback: true,
        fallbackType: 'matched' as const,
      };
    }
    if (question.includes('粉丝')) {
      return {
        answer: '谢可寅的粉丝名叫「虎卫队」',
        source: '来自官方资料',
        isFallback: true,
        fallbackType: 'matched' as const,
      };
    }
    throw new Error('NO_ANSWER');
  }),
}));

vi.mock('../../hooks/useContentQueries', () => ({
  useChatAnswer: () => ({ mutateAsync, isPending: false }),
}));

function renderChat() {
  return render(<ChatWidget />);
}

describe('AI 问答机器人 (Issue #13)', () => {
  it('TC-01 悬浮球常驻', () => {
    renderChat();
    expect(screen.getByTestId('chat-fab')).toBeInTheDocument();
  });

  it('TC-02 点击展开聊天窗口', () => {
    renderChat();
    fireEvent.click(screen.getByTestId('chat-fab'));
    expect(screen.getByTestId('chat-window')).toBeInTheDocument();
  });

  it('TC-03 快捷问题发送并获得回答', async () => {
    renderChat();
    fireEvent.click(screen.getByTestId('chat-fab'));
    fireEvent.click(screen.getByText('谢可寅是谁？'));
    await waitFor(
      () => {
        expect(screen.getByText(/谢可寅（Shaking Chloe）/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    expect(screen.getByText('来源：来自官方资料')).toBeInTheDocument();
  });

  it('TC-04 自定义输入回车发送', async () => {
    renderChat();
    fireEvent.click(screen.getByTestId('chat-fab'));
    const input = screen.getByLabelText('提问输入框');
    fireEvent.change(input, { target: { value: '粉丝名叫什么？' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(
      () => {
        expect(screen.getByText(/虎卫队/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('TC-05 无法回答时给出友好提示', async () => {
    renderChat();
    fireEvent.click(screen.getByTestId('chat-fab'));
    const input = screen.getByLabelText('提问输入框');
    fireEvent.change(input, { target: { value: '今天天气如何' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(
      () => {
        expect(screen.getByText(/问答服务维护中/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('TC-06 再次点击关闭', () => {
    renderChat();
    fireEvent.click(screen.getByTestId('chat-fab'));
    expect(screen.getByTestId('chat-window')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('chat-fab'));
    expect(screen.queryByTestId('chat-window')).not.toBeInTheDocument();
  });
});
