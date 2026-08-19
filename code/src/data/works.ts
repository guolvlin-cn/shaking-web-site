// 作品数据（对应 requirements 6.1 Work 模型；真实数据接入 API 后替换）

export type WorkType = '综艺' | '电视剧' | '电影' | '音乐' | '舞台';
export type WorkStatus = '已播出' | '即将上线' | '热播中' | '筹备中' | '待官宣';

export interface Work {
  id: string;
  title: string;
  type: WorkType;
  category?: string;
  releaseDate?: string;
  coverImage?: string;
  gradient: string; // 封面占位渐变
  description?: string;
  role?: string;
  platform?: string;
  externalLink?: string;
  status: WorkStatus;
  tags?: string[];
  sortOrder?: number;
  isPublished: boolean;
}

export const WORKS: Work[] = [
  // 影视
  {
    id: 'w-001',
    title: '问心2',
    type: '电视剧',
    category: '都市医疗',
    releaseDate: '2025-11',
    gradient: 'linear-gradient(135deg, #2d1b00 0%, #1a1a1a 100%)',
    description: '都市医疗剧《问心2》，谢可寅饰演林逸。',
    role: '林逸',
    platform: '腾讯视频',
    externalLink: 'https://v.qq.com',
    status: '已播出',
    tags: ['主演'],
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'w-002',
    title: '流浪·地球',
    type: '电影',
    category: '科幻',
    releaseDate: '2026-01',
    gradient: 'linear-gradient(135deg, #0a2a4a 0%, #1a1a1a 100%)',
    description: '科幻电影《流浪·地球》，谢可寅参与演出。',
    role: '客串',
    platform: '院线',
    externalLink: 'https://www.maoyan.com',
    status: '已播出',
    tags: ['电影'],
    sortOrder: 2,
    isPublished: true,
  },
  // 综艺
  {
    id: 'w-003',
    title: '青春有你2',
    type: '综艺',
    category: '选秀',
    releaseDate: '2020-03',
    gradient: 'linear-gradient(135deg, #1b004d 0%, #1a1a1a 100%)',
    description: '《青春有你2》以第三名成绩出道，THE9 成员、Rap 担当。',
    role: '练习生 → 出道',
    platform: '爱奇艺',
    externalLink: 'https://www.iqiyi.com',
    status: '已播出',
    tags: ['出道', 'THE9'],
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: 'w-004',
    title: '中国说唱巅峰对决',
    type: '综艺',
    category: '说唱竞演',
    releaseDate: '2022-06',
    gradient: 'linear-gradient(135deg, #4d1b00 0%, #1a1a1a 100%)',
    description: '说唱竞演综艺，谢可寅以 Rapper 身份参赛。',
    role: '选手',
    platform: '爱奇艺',
    externalLink: 'https://www.iqiyi.com',
    status: '已播出',
    tags: ['Rap'],
    sortOrder: 4,
    isPublished: true,
  },
  // 音乐
  {
    id: 'w-005',
    title: 'Black Cupid',
    type: '音乐',
    category: '单曲',
    releaseDate: '2022-02',
    gradient: 'linear-gradient(135deg, #2b002b 0%, #1a1a1a 100%)',
    description: '谢可寅个人单曲《Black Cupid》。',
    role: '歌手',
    platform: '网易云音乐',
    externalLink: 'https://music.163.com',
    status: '已播出',
    tags: ['单曲'],
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: 'w-006',
    title: 'Comet',
    type: '音乐',
    category: '单曲',
    releaseDate: '2023-05',
    gradient: 'linear-gradient(135deg, #002b2b 0%, #1a1a1a 100%)',
    description: '谢可寅个人单曲《Comet》。',
    role: '歌手',
    platform: 'QQ音乐',
    externalLink: 'https://y.qq.com',
    status: '已播出',
    tags: ['单曲'],
    sortOrder: 6,
    isPublished: true,
  },
  // 舞台
  {
    id: 'w-007',
    title: 'THE9 巡回演唱会',
    type: '舞台',
    category: '演唱会',
    releaseDate: '2021-04',
    gradient: 'linear-gradient(135deg, #2d0014 0%, #1a1a1a 100%)',
    description: 'THE9 组合巡回演唱会，谢可寅担任 Rap 担当。',
    role: '表演者',
    platform: '现场',
    externalLink: 'https://www.bilibili.com',
    status: '已播出',
    tags: ['THE9', '演唱会'],
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: 'w-008',
    title: '微博之夜表演',
    type: '舞台',
    category: '晚会',
    releaseDate: '2024-01',
    gradient: 'linear-gradient(135deg, #1b002d 0%, #1a1a1a 100%)',
    description: '微博之夜现场表演。',
    role: '表演者',
    platform: '微博',
    externalLink: 'https://weibo.com',
    status: '已播出',
    tags: ['晚会'],
    sortOrder: 8,
    isPublished: true,
  },
  // 敬请期待
  {
    id: 'w-009',
    title: '新专辑',
    type: '音乐',
    category: 'EP',
    releaseDate: '2026-12',
    gradient: 'linear-gradient(135deg, #3d2d00 0%, #1a1a1a 100%)',
    description: '筹备中的个人音乐作品。',
    role: '歌手',
    platform: '待定',
    status: '筹备中',
    tags: ['EP'],
    sortOrder: 9,
    isPublished: true,
  },
  {
    id: 'w-010',
    title: '待官宣影视项目',
    type: '电影',
    category: '影视',
    releaseDate: '2027',
    gradient: 'linear-gradient(135deg, #003d3d 0%, #1a1a1a 100%)',
    description: '待官宣的影视合作项目。',
    role: '待定',
    platform: '待定',
    status: '待官宣',
    tags: ['待官宣'],
    sortOrder: 10,
    isPublished: true,
  },
];

export const getLatestWorks = (limit = 8): Work[] =>
  WORKS.filter((w) => w.status === '已播出' || w.status === '热播中')
    .sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''))
    .slice(0, limit);

export const getUpcomingWorks = (): Work[] =>
  WORKS.filter((w) => ['即将上线', '筹备中', '待官宣'].includes(w.status));
