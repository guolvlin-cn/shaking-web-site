/**
 * 全站共享领域类型（前后端共用）
 * 数据源：后端 API（MatrixOne 数据库驱动），前端页面不直接写死数据
 * 与 requirements-analysis.md §6.1 数据模型对齐，字段命名采用前端 camelCase（后端负责 snake_case 映射）
 */

// ---------- 作品 works ----------
export type WorkType = '综艺' | '电视剧' | '电影' | '音乐' | '舞台';
export type WorkStatus = '已播出' | '即将上线' | '热播中' | '筹备中' | '待官宣';

export interface Work {
  id: string;
  title: string;
  type: WorkType;
  category?: string;
  releaseDate?: string; // YYYY-MM 或 YYYY
  coverImage?: string;
  gradient?: string; // 封面占位渐变（无真实图片时使用）
  description?: string;
  role?: string;
  platform?: string;
  externalLink?: string;
  status: WorkStatus;
  tags?: string[];
  sortOrder?: number;
  isPublished: boolean;
}

// ---------- 成长时间线 timeline ----------
export type TimelineCategory = '选秀' | '出道' | '影视' | '音乐' | '舞台' | '获奖' | '其他';

export interface TimelineEvent {
  id: string;
  eventDate: string; // YYYY-MM-DD
  title: string;
  description?: string;
  category: TimelineCategory;
  relatedWorks?: string[];
  image?: string;
  gradient?: string;
  importance: number; // 1-5
  sortOrder?: number;
  isPublished: boolean;
}

// ---------- 相册 photos ----------
export type PhotoAlbum = '舞台照' | '写真' | '路透' | '饭拍';

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  album: PhotoAlbum;
  title: string;
  description?: string;
  tags?: string[];
  takenDate?: string;
  source?: string;
  gradient?: string;
  sortOrder?: number;
  isPublished: boolean;
}

// ---------- 音乐专区 music ----------
export type MusicCategory = '原创单曲' | '合作曲' | 'EP' | 'THE9时期' | '舞台Live';

export interface MusicWork {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  category: MusicCategory;
  tags?: string[];
  gradient?: string;
  externalLink?: string;
  sortOrder?: number;
  isPublished: boolean;
}

// ---------- 综艺专区 variety ----------
export type VarietyCategory = '选秀' | '真人秀' | '音综' | '晚会';

export interface VarietyShow {
  id: string;
  name: string;
  year: string;
  platform: string;
  role: string;
  category: VarietyCategory;
  gradient?: string;
  externalLink?: string;
  sortOrder?: number;
  isPublished: boolean;
}

// ---------- 舞台活动 stage ----------
export type StageCategory = '晚会' | '音乐节' | '团体活动' | '选秀历程' | '颁奖典礼';

export interface StageEvent {
  id: string;
  date: string;
  name: string;
  location: string;
  performance?: string;
  category: StageCategory;
  gradient?: string;
  photos?: string[];
  sortOrder?: number;
  isPublished: boolean;
}

// ---------- 采访 interview ----------
export type InterviewFormat = '视频专访' | '文字专访' | '杂志' | '电台';

export interface InterviewItem {
  id: string;
  title: string;
  media: string;
  date: string;
  format: InterviewFormat;
  gradient?: string;
  externalLink?: string;
  quotes?: Quote[];
  sortOrder?: number;
  isPublished: boolean;
}

export interface Quote {
  text: string;
  source: string;
}

// ---------- 问答 FAQ / 知识库 ----------
export interface FaqEntry {
  id: string;
  keywords: string[];
  answer: string;
  source: string;
  category?: string;
  isActive: boolean;
}

export type ChatFallbackType = 'matched' | 'generic' | 'service_unavailable';

export interface ChatReply {
  answer: string;
  source?: string;
  isFallback: boolean;
  fallbackType: ChatFallbackType;
}

// ---------- 站点配置 site ----------
export interface SiteConfig {
  id: string;
  configKey: string;
  configValue: string; // JSON 字符串
  description?: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  image?: string;
}

export interface QuickJumpSection {
  id: string;
  num: string;
  title: string;
}

export interface SiteDisplayConfig {
  site: {
    name: string;
    chineseName: string;
    tagline: string;
    fans: string;
    cheerColor: string;
  };
  socialLinks: SocialLink[];
  heroSlides: HeroSlide[];
  quickJumpSections: QuickJumpSection[];
  announcement?: string;
}

// ---------- 管理端 ----------
export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  role: 'super_admin' | 'editor';
  lastLogin?: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

// ---------- 通用 API 响应 ----------
export interface ListResponse<T> {
  items: T[];
  total: number;
}

export interface ApiErrorBody {
  error: {
    message: string;
    code?: string;
  };
}
