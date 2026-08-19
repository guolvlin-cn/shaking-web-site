// 舞台活动数据（对应 requirements F-015/F-016）

export interface StageEvent {
  id: string;
  date: string;
  name: string;
  location: string;
  performance: string;
  category: '晚会' | '音乐节' | '团体活动' | '选秀历程' | '颁奖典礼';
  gradient: string;
  photos: string[]; // 图集（占位渐变索引）
}

export const STAGE_EVENTS: StageEvent[] = [
  {
    id: 'st-001',
    date: '2024-01-01',
    name: '微博之夜',
    location: '北京',
    performance: '现场舞台表演',
    category: '颁奖典礼',
    gradient: 'linear-gradient(135deg, #1b002d 0%, #1a1a1a 100%)',
    photos: ['st-001-1', 'st-001-2', 'st-001-3'],
  },
  {
    id: 'st-002',
    date: '2023-12-31',
    name: '跨年晚会',
    location: '北京',
    performance: '《Comet》+ 经典曲目串烧',
    category: '晚会',
    gradient: 'linear-gradient(135deg, #4d1b00 0%, #1a1a1a 100%)',
    photos: ['st-002-1', 'st-002-2'],
  },
  {
    id: 'st-003',
    date: '2023-08-20',
    name: '音乐节',
    location: '上海',
    performance: '个人舞台 40 分钟',
    category: '音乐节',
    gradient: 'linear-gradient(135deg, #002b1b 0%, #1a1a1a 100%)',
    photos: ['st-003-1', 'st-003-2', 'st-003-3', 'st-003-4'],
  },
  {
    id: 'st-004',
    date: '2021-04-01',
    name: 'THE9 巡回演唱会',
    location: '多城',
    performance: 'Rap 担当舞台',
    category: '团体活动',
    gradient: 'linear-gradient(135deg, #2d0014 0%, #1a1a1a 100%)',
    photos: ['st-004-1', 'st-004-2'],
  },
  {
    id: 'st-005',
    date: '2020-05-30',
    name: '《青春有你2》总决赛',
    location: '广州',
    performance: '决赛舞台，第三名出道',
    category: '选秀历程',
    gradient: 'linear-gradient(135deg, #1b004d 0%, #1a1a1a 100%)',
    photos: ['st-005-1', 'st-005-2', 'st-005-3'],
  },
];

export const STAGE_FILTERS: Array<{ key: string; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '晚会', label: '晚会' },
  { key: '音乐节', label: '音乐节' },
  { key: '团体活动', label: '团体活动' },
  { key: '选秀历程', label: '选秀历程' },
  { key: '颁奖典礼', label: '颁奖典礼' },
];
