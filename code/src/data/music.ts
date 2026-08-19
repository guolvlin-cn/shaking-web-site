// 音乐数据（对应 requirements F-011/F-012）

export interface MusicWork {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  category: '原创单曲' | '合作曲' | 'EP' | 'THE9时期' | '舞台Live';
  tags: string[];
  gradient: string;
  externalLink?: string;
}

export const MUSIC_WORKS: MusicWork[] = [
  {
    id: 'm-001',
    title: 'Black Cupid',
    artist: '谢可寅',
    releaseDate: '2022-02-14',
    category: '原创单曲',
    tags: ['原创', '说唱'],
    gradient: 'linear-gradient(135deg, #2b002b 0%, #1a1a1a 100%)',
    externalLink: 'https://music.163.com',
  },
  {
    id: 'm-002',
    title: 'Comet',
    artist: '谢可寅',
    releaseDate: '2023-05-20',
    category: '原创单曲',
    tags: ['原创'],
    gradient: 'linear-gradient(135deg, #002b2b 0%, #1a1a1a 100%)',
    externalLink: 'https://y.qq.com',
  },
  {
    id: 'm-003',
    title: 'A Little Bit',
    artist: '谢可寅 × 合作',
    releaseDate: '2021-08-18',
    category: '合作曲',
    tags: ['合作'],
    gradient: 'linear-gradient(135deg, #1b004d 0%, #1a1a1a 100%)',
    externalLink: 'https://music.163.com',
  },
  {
    id: 'm-004',
    title: '想见你想见你想见你 (THE9版)',
    artist: 'THE9',
    releaseDate: '2020-06-20',
    category: 'THE9时期',
    tags: ['THE9', '翻唱'],
    gradient: 'linear-gradient(135deg, #2d0014 0%, #1a1a1a 100%)',
    externalLink: 'https://y.qq.com',
  },
  {
    id: 'm-005',
    title: 'Not Me',
    artist: 'THE9',
    releaseDate: '2020-07-28',
    category: 'THE9时期',
    tags: ['THE9', '团体'],
    gradient: 'linear-gradient(135deg, #001f3f 0%, #1a1a1a 100%)',
    externalLink: 'https://music.163.com',
  },
  {
    id: 'm-006',
    title: '舞台 Live 精选',
    artist: '谢可寅',
    releaseDate: '2024-01-01',
    category: '舞台Live',
    tags: ['Live', '舞台'],
    gradient: 'linear-gradient(135deg, #3d2d00 0%, #1a1a1a 100%)',
    externalLink: 'https://www.bilibili.com',
  },
  {
    id: 'm-007',
    title: '新 EP（筹备中）',
    artist: '谢可寅',
    releaseDate: '2026-12',
    category: 'EP',
    tags: ['EP', '筹备'],
    gradient: 'linear-gradient(135deg, #004d3d 0%, #1a1a1a 100%)',
  },
];

export const MUSIC_FILTERS: Array<{ key: string; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '原创单曲', label: '原创单曲' },
  { key: '合作曲', label: '合作曲' },
  { key: 'THE9时期', label: 'THE9时期' },
  { key: '舞台Live', label: '舞台Live' },
];
