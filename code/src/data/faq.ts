// 本地 FAQ 兜底知识库（对应 requirements F-025/NF-011 降级策略）
// MOI 服务不可用时使用本地问答

export interface FaqEntry {
  keywords: string[];
  answer: string;
  source: string;
}

export const FAQ: FaqEntry[] = [
  {
    keywords: ['是谁', '介绍', '谢可寅', '个人'],
    answer:
      '谢可寅（Shaking Chloe），1997年1月4日出生于四川成都，毕业于南京艺术学院表演专业。歌手、演员、Rapper，2020年《青春有你2》第三名出道，THE9 成员、Rap 担当。',
    source: '来自官方资料',
  },
  {
    keywords: ['代表作品', '作品', '有什么'],
    answer:
      '代表作品包括：《青春有你2》《THE9》《问心2》《中国说唱巅峰对决》《Black Cupid》《Comet》《流浪·地球》等，可在「作品合集」「音乐专区」「影视专区」查看详情。',
    source: '来自官网资料',
  },
  {
    keywords: ['粉丝', '粉丝名', '虎卫队', '虎丝'],
    answer: '谢可寅的粉丝名叫「虎卫队」，粉丝简称「虎丝」，应援色为「可寅银」。',
    source: '来自官方资料',
  },
  {
    keywords: ['生日', '出生', '年龄'],
    answer: '谢可寅出生于 1997 年 1 月 4 日，出生地为四川省成都市，幸运数字是 4 和 5。',
    source: '来自百科',
  },
  {
    keywords: ['THE9', '组合', '团'],
    answer:
      'THE9 是 2020 年《青春有你2》出道的限定女团，谢可寅以第三名出道并担任 Rap 担当。团名取自「无限可寅」。',
    source: '来自百科',
  },
  {
    keywords: ['获奖', '成就', '文荣奖'],
    answer:
      '谢可寅曾获第 11 届文荣奖年度瞩目青年演员，也是首个被认证「没有被群嘲」的爱豆 Rapper。',
    source: '来自官方资料',
  },
  {
    keywords: ['微博', '社交', '关注', '抖音', '小红书'],
    answer:
      '谢可寅的社交账号：微博@谢可寅、抖音@谢可寅Shaking Chloe、小红书@谢可寅、Instagram@shaking_chole。',
    source: '来自官方资料',
  },
  {
    keywords: ['官网', '网站', '本站'],
    answer:
      '本站是谢可寅个人展示网站（非官方粉丝站），提供作品合集、成长时间线、相册图库等内容的集中展示，所有版权作品均跳转正版平台观看。',
    source: '来自本站说明',
  },
];

export const FALLBACK_ANSWER =
  '抱歉，我暂时没有找到关于这个问题的答案。你可以尝试问「谢可寅是谁」「有哪些代表作品」「粉丝名叫什么」等常见问题。';

export const MAINTENANCE_MESSAGE = '问答服务维护中，当前使用本地知识库回答，部分问题可能无法覆盖。';

export function findFaqAnswer(question: string): { answer: string; source: string } | null {
  const q = question.toLowerCase();
  for (const entry of FAQ) {
    if (entry.keywords.some((k) => q.includes(k.toLowerCase()))) {
      return { answer: entry.answer, source: entry.source };
    }
  }
  return null;
}
