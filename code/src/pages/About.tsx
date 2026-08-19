import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SITE } from '../data/site';

const PROFILE = {
  chineseName: '谢可寅',
  englishName: 'Shaking Chloe',
  birthDate: '1997-01-04',
  birthplace: '四川成都',
  school: '南京艺术学院 表演专业',
  identity: '歌手 · 演员 · Rapper',
  fans: '虎卫队（简称虎丝）',
  cheerColor: '可寅银',
  luckyNumbers: '4、5',
  bio: '谢可寅，1997年1月4日出生于四川省成都市，毕业于南京艺术学院表演专业。2020年通过爱奇艺《青春有你2》以第三名出道，成为限定团 THE9 的 Rap 担当。从舞台到银幕不断突破，凭借《问心2》等作品获第 11 届文荣奖年度瞩目青年演员，被赞为"没有被群嘲"的爱豆 Rapper。',
};

const ACHIEVEMENTS = [
  { year: '2024', title: '第 11 届文荣奖年度瞩目青年演员', desc: '凭借影视作品获行业认可' },
  { year: '2020', title: 'THE9 出道 · Rap 担当', desc: '《青春有你2》第三名出道' },
  { year: '2022', title: '首个被认证"没有被群嘲"的爱豆 Rapper', desc: '《中国说唱巅峰对决》' },
];

const REPRESENTATIVES = [
  { name: '青春有你2', link: '/variety' },
  { name: 'THE9', link: '/works' },
  { name: '问心2', link: '/movies' },
  { name: '中国说唱巅峰对决', link: '/variety' },
  { name: 'Black Cupid', link: '/music' },
  { name: 'Comet', link: '/music' },
  { name: '流浪·地球', link: '/movies' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-8" data-testid="page-about">
      {/* Hero 区 */}
      <div
        className="relative flex h-[50vh] items-center justify-center overflow-hidden rounded-card"
        style={{ background: 'linear-gradient(135deg, #2d1b00 0%, #1b004d 50%, #0a0a0a 100%)' }}
        role="img"
        aria-label="谢可寅形象照"
      >
        <div className="text-center">
          <h1 className="text-h1 text-text-primary">谢可寅</h1>
          <p className="mt-2 text-h3 text-accent-gold">Shaking Chloe</p>
        </div>
      </div>

      {/* 个人信息卡片 */}
      <div className="relative z-10 mx-auto -mt-16 max-w-[800px] rounded-card border border-border bg-bg-card p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-accent-gold bg-bg-secondary">
            <span className="text-h1 font-bold text-accent-gold">寅</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-text-primary">{PROFILE.chineseName}</h2>
          <p className="mt-1 text-base font-medium text-accent-gold">{PROFILE.englishName}</p>
          <p className="mt-1 text-sm text-text-secondary">{PROFILE.identity}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary">{PROFILE.bio}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary">
            <span>🎂 {PROFILE.birthDate}</span>
            <span>📍 {PROFILE.birthplace}</span>
            <span>🎓 {PROFILE.school}</span>
          </div>
        </div>
      </div>

      {/* 粉丝文化 */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: '粉丝名', value: PROFILE.fans },
          { label: '应援色', value: PROFILE.cheerColor },
          { label: '幸运数字', value: PROFILE.luckyNumbers },
        ].map((item) => (
          <div key={item.label} className="rounded-card border border-border bg-bg-card p-6 text-center">
            <div className="text-caption text-text-secondary">{item.label}</div>
            <div className="mt-1 text-h3 text-accent-gold">{item.value}</div>
          </div>
        ))}
      </div>

      {/* 代表作品 */}
      <section className="mt-12">
        <div className="section-title-accent">
          <h2 className="section-title text-2xl">代表作品</h2>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {REPRESENTATIVES.map((w) => (
            <Link
              key={w.name}
              to={w.link}
              className="group flex items-center gap-1 rounded-full border border-border bg-bg-card px-4 py-2 text-sm text-text-primary transition-colors hover:border-accent-gold hover:text-accent-gold"
            >
              {w.name}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* 获奖荣誉 */}
      <section className="mt-12">
        <div className="section-title-accent">
          <h2 className="section-title text-2xl">主要成就</h2>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.title}
              className="flex gap-4 rounded-card border border-border bg-bg-card p-5"
              data-testid={`achievement-${a.title}`}
            >
              <span className="shrink-0 text-h3 font-bold text-accent-gold">{a.year}</span>
              <div>
                <h3 className="text-h3 text-text-primary">{a.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 社交 */}
      <section className="mt-12">
        <div className="section-title-accent">
          <h2 className="section-title text-2xl">社交媒体</h2>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          {['微博 @谢可寅', '抖音 @谢可寅Shaking Chloe', '小红书 @谢可寅', 'Instagram @shaking_chole'].map(
            (s) => (
              <a
                key={s}
                href="#"
                className="rounded-full border border-border bg-bg-card px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent-gold hover:text-accent-gold"
              >
                {s}
              </a>
            ),
          )}
        </div>
      </section>

      <footer className="mt-12 border-t border-border pt-4 text-center text-caption text-[#666666]">
        © 2026 Shaking Chloe {SITE.chineseName}粉丝站 | 非官方网站，仅供粉丝交流使用
      </footer>
    </div>
  );
}
