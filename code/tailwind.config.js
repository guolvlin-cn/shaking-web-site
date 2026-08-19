/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 设计规范 §2.1 配色方案（深色主题）
        bg: {
          base: '#0a0a0a', // 主背景
          secondary: '#121212', // 次背景
          card: '#1a1a1a', // 卡片背景
          cardHover: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#b0b0b0',
        },
        accent: {
          gold: '#f5c518', // 强调色/金色
          goldBright: '#ffd700',
          error: '#ff4d4f',
          success: '#52c41a',
        },
        border: {
          DEFAULT: '#2a2a2a',
          light: '#333333',
        },
        tag: {
          green: 'rgba(52, 211, 153, 0.15)',
          blue: 'rgba(96, 165, 250, 0.15)',
          gold: 'rgba(245, 197, 24, 0.15)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Hiragino Sans GB',
          'Source Han Sans SC',
          'Noto Sans SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      spacing: {
        // 间距系统 §2.3
        18: '4.5rem',
      },
      borderRadius: {
        // 圆角系统 §2.4
        card: '0.75rem',
        pill: '9999px',
      },
      boxShadow: {
        // 阴影系统 §2.5
        card: '0 2px 8px rgba(0, 0, 0, 0.4)',
        hover: '0 8px 24px rgba(0, 0, 0, 0.6)',
        gold: '0 0 12px rgba(245, 197, 24, 0.4)',
      },
      fontSize: {
        // 字体规范 §2.2
        h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 32-40px
        h2: ['1.625rem', { lineHeight: '1.3', fontWeight: '700' }], // 24-28px
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }], // 18-20px
        body: ['1rem', { lineHeight: '1.6' }],
        caption: ['0.8125rem', { lineHeight: '1.4' }], // 12-13px
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
