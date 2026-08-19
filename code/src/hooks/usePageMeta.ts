import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Shaking Chloe 谢可寅 - 个人展示网站',
    description: '谢可寅 Shaking Chloe 个人展示网站：作品合集、成长时间线、音乐影视、相册图库一站式浏览。',
  },
  '/timeline': { title: '成长时间线 - Shaking Chloe 谢可寅', description: '谢可寅从出道至今的成长历程与重要节点。' },
  '/works': { title: '作品合集 - Shaking Chloe 谢可寅', description: '谢可寅影视、音乐、舞台、综艺作品合集，一键跳转正版平台。' },
  '/music': { title: '音乐专区 - Shaking Chloe 谢可寅', description: '谢可寅原创单曲、合作曲、THE9 时期作品与舞台 Live。' },
  '/movies': { title: '影视专区 - Shaking Chloe 谢可寅', description: '谢可寅参演的电视剧与电影作品。' },
  '/stage': { title: '舞台活动 - Shaking Chloe 谢可寅', description: '谢可寅的晚会、音乐节、团体活动舞台记录。' },
  '/variety': { title: '综艺专区 - Shaking Chloe 谢可寅', description: '谢可寅参与的综艺节目。' },
  '/interview': { title: '采访专区 - Shaking Chloe 谢可寅', description: '谢可寅的专访与采访实录。' },
  '/gallery': { title: '相册图库 - Shaking Chloe 谢可寅', description: '谢可寅的舞台照、写真、路透与饭拍图集。' },
  '/about': { title: '关于谢可寅 - Shaking Chloe', description: '谢可寅个人档案、粉丝文化、主要成就与代表作品。' },
};

/**
 * 根据路由设置 document.title 与 meta description（对应 NF-027）。
 */
export default function usePageMeta() {
  const location = useLocation();

  useEffect(() => {
    const meta = PAGE_META[location.pathname] ?? PAGE_META['/'];
    document.title = meta.title;
    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', meta.description);

    // OG 标签（NF-027）
    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setOg('og:title', meta.title);
    setOg('og:description', meta.description);
    setOg('og:type', 'website');
    setOg('og:site_name', 'Shaking Chloe 谢可寅');
    // 部署后替换为站点绝对地址（如 https://shaking-chloe.com/logo.svg）
    setOg('og:image', '/logo.svg');
  }, [location.pathname]);
}
