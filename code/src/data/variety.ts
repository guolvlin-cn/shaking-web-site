// 综艺数据（对应 requirements F-007 综艺类目 / ui-design-spec §4.10）

export interface VarietyShow {
  id: string;
  name: string;
  year: string;
  platform: string;
  role: string; // 身份
  category: '选秀' | '真人秀' | '音综' | '晚会';
  gradient: string;
  externalLink?: string;
}

export const VARIETY_SHOWS: VarietyShow[] = [
  {
    id: 'v-001',
    name: '青春有你2',
    year: '2020',
    platform: '爱奇艺',
    role: '选手 → 出道',
    category: '选秀',
    gradient: 'linear-gradient(135deg, #1b004d 0%, #2b1b00 100%)',
    externalLink: 'https://www.iqiyi.com',
  },
  {
    id: 'v-002',
    name: '中国说唱巅峰对决',
    year: '2022',
    platform: '爱奇艺',
    role: '选手',
    category: '音综',
    gradient: 'linear-gradient(135deg, #4d1b00 0%, #1a1a1a 100%)',
    externalLink: 'https://www.iqiyi.com',
  },
  {
    id: 'v-003',
    name: '做家务的男人',
    year: '2021',
    platform: '爱奇艺',
    role: '嘉宾',
    category: '真人秀',
    gradient: 'linear-gradient(135deg, #002b2b 0%, #1a1a1a 100%)',
    externalLink: 'https://www.iqiyi.com',
  },
  {
    id: 'v-004',
    name: '经典舞台晚会',
    year: '2023',
    platform: '卫视',
    role: '表演嘉宾',
    category: '晚会',
    gradient: 'linear-gradient(135deg, #3d2d00 0%, #1a1a1a 100%)',
    externalLink: 'https://www.mgtv.com',
  },
];

export const VARIETY_FILTERS: Array<{ key: string; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '选秀', label: '选秀' },
  { key: '真人秀', label: '真人秀' },
  { key: '音综', label: '音综' },
  { key: '晚会', label: '晚会' },
];
