import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useChatAnswer } from '../../hooks/useContentQueries';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  error?: boolean;
}

const QUICK_QUESTIONS = ['谢可寅是谁？', '有哪些代表作品？', '粉丝名叫什么？'];

const MAINTENANCE_MESSAGE = '问答服务维护中，请稍后再试。';

let msgId = 0;
const nextId = () => `msg-${++msgId}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const { mutateAsync, isPending } = useChatAnswer();

  const send = useCallback(
    async (raw: string) => {
      const content = raw.trim();
      if (!content || isPending) return;
      const userMsg: ChatMessage = { id: nextId(), role: 'user', content };
      setMessages((m) => [...m, userMsg]);
      setInput('');

      try {
        // 问答走后端 /api/chat（qa_knowledge 关键词匹配 + 兜底）
        const res = await mutateAsync(content);
        setMessages((m) => [
          ...m,
          { id: nextId(), role: 'assistant', content: res.answer, source: res.source },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { id: nextId(), role: 'assistant', content: MAINTENANCE_MESSAGE, error: true },
        ]);
      }
    },
    [mutateAsync, isPending],
  );

  useEffect(() => {
    bodyRef.current?.scrollTo?.({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isPending]);

  return (
    <>
      {/* 悬浮球 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '关闭问答' : '打开问答'}
        className="fixed bottom-6 right-6 z-[800] flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold text-bg-base shadow-gold transition-transform hover:scale-110"
        data-testid="chat-fab"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* 聊天窗口 */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[800] flex h-[480px] w-[360px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-card border border-border bg-bg-card shadow-2xl"
          role="dialog"
          aria-label="问答机器人"
          data-testid="chat-window"
        >
          {/* 头部 */}
          <div className="flex items-center gap-2 border-b border-border bg-bg-secondary px-4 py-3">
            <Sparkles size={18} className="text-accent-gold" />
            <span className="text-sm font-semibold text-text-primary">Shaking 问答机器人</span>
          </div>

          {/* 消息区 */}
          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="text-caption text-text-secondary">
                你好！我是谢可寅的问答助手，可以问我关于她的问题～
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-accent-gold text-bg-base'
                      : msg.error
                        ? 'border border-accent-error/40 bg-accent-error/10 text-text-primary'
                        : 'border border-border bg-bg-secondary text-text-primary'
                  }`}
                  data-testid={`chat-msg-${msg.role}`}
                >
                  {msg.content}
                  {msg.source && !msg.error && (
                    <div className="mt-1 text-caption text-text-secondary">来源：{msg.source}</div>
                  )}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-secondary">
                  思考中…
                </div>
              </div>
            )}
          </div>

          {/* 快捷问题 */}
          <div className="flex gap-2 overflow-x-auto border-t border-border px-3 py-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="shrink-0 rounded-full border border-border px-3 py-1 text-caption text-text-secondary transition-colors hover:border-accent-gold hover:text-accent-gold"
              >
                {q}
              </button>
            ))}
          </div>

          {/* 输入区 */}
          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send(input);
              }}
              placeholder="输入问题…"
              aria-label="提问输入框"
              className="h-10 flex-1 rounded-full border border-border bg-bg-secondary px-4 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={() => send(input)}
              aria-label="发送"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-gold text-bg-base transition-transform hover:scale-105"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
