// 采访数据（对应 requirements NF-020 / ui-design-spec §4.11）

export interface InterviewItem {
  id: string;
  title: string;
  media: string; // 来源媒体
  date: string;
  format: '视频专访' | '文字专访' | '杂志' | '电台';
  gradient: string;
  externalLink?: string;
}

export const INTERVIEWS: InterviewItem[] = [
  {
    id: 'i-001',
    title: '关于转型，谢可寅这么说',
    media: '新浪娱乐',
    date: '2024-03-15',
    format: '视频专访',
    gradient: 'linear-gradient(135deg, #1b002d 0%, #1a1a1a 100%)',
    externalLink: 'https://weibo.com',
  },
  {
    id: 'i-002',
    title: '从舞台到银幕：我的演员之路',
    media: '搜狐娱乐',
    date: '2023-11-08',
    format: '文字专访',
    gradient: 'linear-gradient(135deg, #002b1b 0%, #1a1a1a 100%)',
    externalLink: 'https://www.sohu.com',
  },
  {
    id: 'i-003',
    title: '虎卫队与我的五年',
    media: '杂志',
    date: '2023-06-20',
    format: '杂志',
    gradient: 'linear-gradient(135deg, #3d2d00 0%, #1a1a1a 100%)',
    externalLink: 'https://weibo.com',
  },
  {
    id: 'i-004',
    title: '音乐创作幕后访谈',
    media: '网易云音乐电台',
    date: '2022-09-30',
    format: '电台',
    gradient: 'linear-gradient(135deg, #2b002b 0%, #1a1a1a 100%)',
    externalLink: 'https://music.163.com',
  },
];

export const INTERVIEW_FILTERS: Array<{ key: string; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '视频专访', label: '视频专访' },
  { key: '文字专访', label: '文字专访' },
  { key: '杂志', label: '杂志' },
  { key: '电台', label: '电台' },
];

export const QUOTES = [
  { text: '我不想被定义，我想一直尝试新的可能。', source: '2024 某杂志专访' },
  { text: '舞台上的每一次全力以赴，都是对支持我的人的回应。', source: '2023 采访实录' },
];
