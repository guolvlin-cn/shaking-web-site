// 全站配置与社交链接（对应 requirements §9.1 / ui-design-spec §4.1.2）

export const SITE = {
  name: 'Shaking Chloe',
  chineseName: '谢可寅',
  tagline: '歌手 · 演员 · Rapper，从舞台到银幕，不断突破的全能艺人',
  fans: '虎卫队',
  cheerColor: '可寅银',
};

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: '微博', href: 'https://weibo.com/u/谢可寅', icon: 'weibo' },
  { name: '小红书', href: 'https://www.xiaohongshu.com/user/profile/谢可寅', icon: 'xiaohongshu' },
  { name: '抖音', href: 'https://www.douyin.com/user/谢可寅', icon: 'douyin' },
  { name: 'B站', href: 'https://space.bilibili.com/谢可寅', icon: 'bilibili' },
  { name: 'Instagram', href: 'https://www.instagram.com/shaking_chole', icon: 'instagram' },
];

// 首页 Hero 轮播幻灯片（封面先用渐变占位，后续替换为真实物料）
export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  image?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'Shaking Chloe',
    subtitle: '从舞台到银幕，全能艺人之路',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b00 55%, #0a0a0a 100%)',
  },
  {
    id: 'hero-2',
    title: 'THE9 · Rap 担当',
    subtitle: '《青春有你2》出道 · 破局者',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #1b004d 55%, #0a0a0a 100%)',
  },
  {
    id: 'hero-3',
    title: '演员谢可寅',
    subtitle: '《问心2》热播 · 文荣奖年度瞩目青年演员',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #002b1b 55%, #0a0a0a 100%)',
  },
];

// 作品类型标签色（ui-design-spec §4.1.4）
export const TYPE_TAG_COLORS: Record<string, string> = {
  影视: 'bg-[#4834d4]',
  舞台: 'bg-[#00d2d3]',
  音乐: 'bg-[#ff6b6b]',
  综艺: 'bg-[#ff9f43]',
};

export const QUICK_JUMP_SECTIONS = [
  { id: 'latest', num: '01', title: '最新作品' },
  { id: 'upcoming', num: '02', title: '敬请期待' },
  { id: 'explore', num: '03', title: '探索更多' },
  { id: 'milestones', num: '04', title: '成长足迹' },
];
