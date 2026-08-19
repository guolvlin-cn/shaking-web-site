// 时间线数据（对应 requirements 6.1 TimelineEvent 模型）

export type TimelineCategory = '选秀' | '出道' | '影视' | '音乐' | '舞台' | '获奖' | '其他';

export interface TimelineEvent {
  id: string;
  eventDate: string; // YYYY-MM-DD
  title: string;
  description: string;
  category: TimelineCategory;
  relatedWorks?: string[];
  image?: string;
  gradient: string;
  importance: number; // 1-5
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'tl-001',
    eventDate: '2020-03-12',
    title: '参加《青春有你2》',
    description:
      '以训练生身份参加爱奇艺女团选秀综艺《青春有你2》，凭借出色的说唱实力与舞台表现成为热门选手。',
    category: '选秀',
    relatedWorks: ['w-003'],
    gradient: 'linear-gradient(135deg, #1b004d 0%, #2b1b00 100%)',
    importance: 5,
  },
  {
    id: 'tl-002',
    eventDate: '2020-05-30',
    title: '以第三名出道，加入 THE9',
    description:
      '《青春有你2》总决赛以第三名成绩出道，成为限定团 THE9 成员并担任 Rap 担当，团名取自"无限可寅"。',
    category: '出道',
    relatedWorks: ['w-003'],
    gradient: 'linear-gradient(135deg, #2d0014 0%, #1b004d 100%)',
    importance: 5,
  },
  {
    id: 'tl-003',
    eventDate: '2021-04-01',
    title: 'THE9 巡回演唱会',
    description: '随 THE9 展开巡回演唱会，担任团队 Rapper，现场表现力备受好评。',
    category: '舞台',
    relatedWorks: ['w-007'],
    gradient: 'linear-gradient(135deg, #002b1b 0%, #1a1a1a 100%)',
    importance: 4,
  },
  {
    id: 'tl-004',
    eventDate: '2022-02-14',
    title: '发行个人单曲《Black Cupid》',
    description: '发布个人单曲《Black Cupid》，展现独立音乐人身份与创作能力。',
    category: '音乐',
    relatedWorks: ['w-005'],
    gradient: 'linear-gradient(135deg, #2b002b 0%, #1a1a1a 100%)',
    importance: 4,
  },
  {
    id: 'tl-005',
    eventDate: '2022-06-25',
    title: '参加《中国说唱巅峰对决》',
    description:
      '以 Rapper 身份登上说唱竞演综艺《中国说唱巅峰对决》，证明爱豆 Rapper 的实力，获赞"没有被群嘲"。',
    category: '选秀',
    relatedWorks: ['w-004'],
    gradient: 'linear-gradient(135deg, #4d1b00 0%, #1a1a1a 100%)',
    importance: 5,
  },
  {
    id: 'tl-006',
    eventDate: '2023-05-20',
    title: '发行个人单曲《Comet》',
    description: '发布个人单曲《Comet》，延续个人音乐风格。',
    category: '音乐',
    relatedWorks: ['w-006'],
    gradient: 'linear-gradient(135deg, #002b2b 0%, #1a1a1a 100%)',
    importance: 4,
  },
  {
    id: 'tl-007',
    eventDate: '2024-01-01',
    title: '微博之夜现场表演',
    description: '亮相微博之夜并带来现场舞台表演。',
    category: '舞台',
    relatedWorks: ['w-008'],
    gradient: 'linear-gradient(135deg, #1b002d 0%, #1a1a1a 100%)',
    importance: 3,
  },
  {
    id: 'tl-008',
    eventDate: '2025-11-15',
    title: '《问心2》热播',
    description: '主演都市医疗剧《问心2》，演员身份进一步获认可。',
    category: '影视',
    relatedWorks: ['w-001'],
    gradient: 'linear-gradient(135deg, #2d1b00 0%, #1a1a1a 100%)',
    importance: 5,
  },
  {
    id: 'tl-009',
    eventDate: '2026-01-01',
    title: '获第 11 届文荣奖年度瞩目青年演员',
    description: '凭借影视表现荣获第 11 届文荣奖年度瞩目青年演员，从舞台到银幕的转型获得行业认可。',
    category: '获奖',
    relatedWorks: ['w-001'],
    gradient: 'linear-gradient(135deg, #3d2d00 0%, #1a1a1a 100%)',
    importance: 5,
  },
];

export const TIMELINE_FILTERS: Array<{ key: TimelineCategory | '全部'; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '选秀', label: '选秀' },
  { key: '出道', label: '出道' },
  { key: '影视', label: '影视' },
  { key: '音乐', label: '音乐' },
  { key: '舞台', label: '舞台' },
  { key: '获奖', label: '获奖' },
];

export const getYearGroups = (events: TimelineEvent[]): Map<string, TimelineEvent[]> => {
  const groups = new Map<string, TimelineEvent[]>();
  const sorted = [...events].sort((a, b) => b.eventDate.localeCompare(a.eventDate));
  for (const ev of sorted) {
    const year = ev.eventDate.slice(0, 4);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(ev);
  }
  return groups;
};
