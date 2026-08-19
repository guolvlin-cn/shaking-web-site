import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { HERO_SLIDES, SOCIAL_LINKS, QUICK_JUMP_SECTIONS, SITE } from '../../data/site';

const AUTOPLAY_MS = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setCurrent((next + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartTimer]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative -mx-4 flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 md:-mx-8 md:px-12"
      aria-label="首页首屏"
    >
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: slide.gradient }}
          aria-hidden={i !== current}
        />
      ))}
      {/* 遮罩 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-base/30 via-bg-base/60 to-bg-base/95" />

      {/* 左侧垂直轮播指示器 */}
      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 md:left-8">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`切换到第 ${i + 1} 张`}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-accent-gold' : 'w-2 bg-white/40 hover:scale-125'
            }`}
          />
        ))}
      </div>

      {/* 主内容（左下） */}
      <div className="relative z-10 max-w-2xl">
        <div key={current} className="animate-slide-up">
          <h1 className="text-h1 text-text-primary md:text-5xl">{SITE.name}</h1>
          <p className="mt-1 text-h3 font-medium text-accent-gold">{SITE.chineseName}</p>
          <p className="mt-3 max-w-md text-body text-text-secondary">{SITE.tagline}</p>
        </div>

        {/* 社交链接 */}
        <div className="mt-5 flex items-center gap-3">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.name}
              title={s.name}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/10 text-caption text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent-gold hover:bg-accent-gold/10 hover:text-accent-gold"
            >
              {s.name.slice(0, 1)}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => scrollTo('latest')}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-gold px-5 py-2.5 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold/10"
        >
          查看作品
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 右侧快速跳转 */}
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 md:right-8 lg:flex">
        {QUICK_JUMP_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className="flex items-center gap-2 text-right transition-colors hover:text-accent-gold"
          >
            <span className="text-caption font-medium text-accent-gold">{s.num}</span>
            <span className="text-sm text-text-primary">{s.title}</span>
          </button>
        ))}
      </div>

      {/* 左右箭头 */}
      <button
        type="button"
        aria-label="上一张"
        onClick={() => {
          go(current - 1);
          restartTimer();
        }}
        className="absolute left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-card/50 text-text-primary transition-colors hover:border-accent-gold hover:text-accent-gold md:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="下一张"
        onClick={() => {
          go(current + 1);
          restartTimer();
        }}
        className="absolute right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-card/50 text-text-primary transition-colors hover:border-accent-gold hover:text-accent-gold md:flex"
      >
        <ChevronRight size={20} />
      </button>

      {/* 底部滚动提示 */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce text-text-secondary">
        <ArrowDown size={20} />
      </div>
    </section>
  );
}
