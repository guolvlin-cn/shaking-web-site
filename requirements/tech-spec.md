# Shaking Chloe 谢可寅个人展示网站 — 技术选型文档

> **文档版本**: v1.0  
> **创建日期**: 2026-06-25  
> **项目代号**: shaking-web  
> **文档状态**: 初稿待评审  
> **目标读者**: 前端工程师、后端工程师、DevOps工程师、技术负责人

---

## 目录

1. [前端技术栈](#1-前端技术栈)
2. [后端/API层](#2-后端api层)
3. [数据库层](#3-数据库层)
4. [智能问答集成](#4-智能问答集成)
5. [部署与DevOps](#5-部署与devops)
6. [监控体系](#6-监控体系)
7. [项目目录结构](#7-项目目录结构)
8. [关键配置文件模板](#8-关键配置文件模板)
9. [package.json 完整示例](#9-packagejson-完整示例)
10. [风险矩阵与应对策略](#10-风险矩阵与应对策略)

---

## 1. 前端技术栈

### 1.1 核心框架：React 18

| 维度 | 说明 |
|------|------|
| **选型版本** | `react@18.3.1`, `react-dom@18.3.1` |
| **选型理由** | ① 组件化开发成熟，生态最丰富；② Concurrent Features（Suspense、Transitions）提升交互体验；③ 与TypeScript深度集成；④ 展示型网站以组件复用为核心，React组件模型最契合 |
| **替代方案A** | **Vue 3** — 组合式API同样优秀，但团队React经验更丰富；Vue生态在国内活跃，但TypeScript支持略逊于React；迁移成本较高 |
| **替代方案B** | **Svelte** — 编译时优化，无虚拟DOM，包体更小；但生态成熟度不足，大型项目参考资料少，招聘难度大 |
| **潜在风险** | ① React 19即将发布，需关注升级路径；② Server Components生态仍在演进，本项目暂不使用RSC；③ 状态管理选择过多，需统一规范 |

### 1.2 类型系统：TypeScript

| 维度 | 说明 |
|------|------|
| **选型版本** | `typescript@5.5.4` |
| **选型理由** | ① 编译期类型检查，减少运行时错误；② 与React/Vite深度集成；③ 接口类型可前后端共享（OpenAPI生成）；④ IDE智能提示提升开发效率 |
| **替代方案A** | **JavaScript + JSDoc** — 无需编译步骤，但类型检查能力弱，大型项目维护困难 |
| **替代方案B** | **Flow** — Meta出品，但生态萎缩，社区转向TypeScript，不建议新项目采用 |
| **潜在风险** | ① 类型定义维护成本；② 第三方库类型定义缺失需自行补充；③ 严格模式配置不当导致开发体验下降 |

### 1.3 构建工具：Vite

| 维度 | 说明 |
|------|------|
| **选型版本** | `vite@5.3.3` |
| **选型理由** | ① 基于ESM的极速冷启动（<300ms）；② 按需编译，HMR毫秒级响应；③ 原生支持TypeScript/JSX/CSS Modules；④ 插件生态丰富（PWA、SSR、压缩等）；⑤ 配置简洁，开箱即用 |
| **替代方案A** | **Webpack 5** — 生态最成熟，但配置复杂，冷启动慢（10-30s），HMR体验差；大型项目迁移成本高 |
| **替代方案B** | **Turbopack** — Next.js官方，性能优秀，但仅支持Next.js，不适用于独立React项目；稳定性待验证 |
| **潜在风险** | ① 生产构建依赖Rollup，某些Webpack插件不兼容；② 对CommonJS依赖处理偶有异常；③ 需关注Vite 6升级路径 |

### 1.4 样式方案：Tailwind CSS + CSS Modules

| 维度 | 说明 |
|------|------|
| **选型版本** | `tailwindcss@3.4.6`, `postcss@8.4.39`, `autoprefixer@10.4.19` |
| **选型理由** | ① 原子化CSS减少样式文件体积（生产环境仅打包使用到的样式）；② 设计令牌（Design Tokens）与项目配色规范天然契合；③ 响应式前缀（sm/md/lg/xl）简化媒体查询；④ 与CSS Modules结合，复杂组件样式局部隔离 |
| **替代方案A** | **Styled Components / Emotion** — CSS-in-JS方案，动态样式能力强，但运行时开销大，SSR场景复杂；与Tailwind相比包体更大 |
| **替代方案B** | **Sass/SCSS** — 传统预处理器，变量/混合/嵌套功能完善；但需维护大量.scss文件，样式冗余风险高，与组件化开发模式不够契合 |
| **潜在风险** | ① HTML类名冗长，可读性下降（需配合Prettier插件自动排序）；② 团队需熟悉Tailwind类名体系，有学习曲线；③ 深色模式配置需自定义 |

### 1.5 状态管理：Zustand + React Query (TanStack Query)

| 维度 | 说明 |
|------|------|
| **选型版本** | `zustand@4.5.4`, `@tanstack/react-query@5.51.1` |
| **选型理由** | ① Zustand：轻量级（~1KB），无Provider包裹，TypeScript支持优秀，适合客户端状态（UI状态、主题、搜索条件）；② React Query：服务端状态管理首选，自动缓存、去重、重试、失效策略，完美契合展示型网站的数据获取需求 |
| **替代方案A** | **Redux Toolkit + RTK Query** — 生态成熟，DevTools强大；但样板代码多，配置复杂，对于展示型网站过重 |
| **替代方案B** | **MobX** — 响应式编程，代码简洁；但装饰器语法与严格TypeScript配置冲突，团队熟悉度低 |
| **潜在方案C** | **Jotai / Recoil** — 原子化状态管理，适合细粒度状态；但React Query已覆盖服务端状态，客户端状态简单，Zustand足够 |
| **潜在风险** | ① Zustand Store拆分不当导致状态分散；② React Query缓存策略配置错误导致数据不一致；③ 需统一服务端/客户端状态边界 |

### 1.6 路由：React Router v6

| 维度 | 说明 |
|------|------|
| **选型版本** | `react-router-dom@6.24.1` |
| **选型理由** | ① React生态路由标准方案；② v6引入`<Outlet>`嵌套路由、`<Suspense>`懒加载、相对路径，API更简洁；③ 与Vite代码分割天然配合；④ 支持Scroll Restoration |
| **替代方案A** | **TanStack Router** — 类型安全路由（基于TypeScript文件路径），功能强大；但生态较新，文档和社区支持不如React Router |
| **替代方案B** | **Next.js App Router** — 需要迁移至Next.js框架，本项目使用Vite+React Router保持轻量；SSR/SSG需求可通过Vite SSR插件实现 |
| **潜在风险** | ① 嵌套路由配置复杂页面需仔细设计；② 懒加载组件需配合Error Boundary；③ 未来React Router v7可能有Breaking Changes |

### 1.7 动画：Framer Motion

| 维度 | 说明 |
|------|------|
| **选型版本** | `framer-motion@11.2.12` |
| **选型理由** | ① 声明式API与React组件模型完美契合；② 支持布局动画（layout prop）、手势交互（drag/hover/tap）、SVG路径动画；③ 与React Router页面过渡无缝集成；④ 性能优化（自动使用GPU加速） |
| **替代方案A** | **GSAP (GreenSock)** — 功能最强大，时间轴控制精细；但需命令式API，与React声明式模式冲突，包体较大 |
| **替代方案B** | **React Spring** — 基于物理弹簧模型，动画自然；但API学习曲线陡峭，与Framer Motion功能重叠，社区活跃度下降 |
| **潜在风险** | ① 复杂动画场景性能开销；② 布局动画在频繁DOM变化时可能卡顿；③ 包体约40KB（gzip），需评估是否值得 |

### 1.8 图标：Lucide React

| 维度 | 说明 |
|------|------|
| **选型版本** | `lucide-react@0.400.0` |
| **选型理由** | ① 现代、简洁、一致的图标风格，与深色模式设计契合；② 树摇优化（Tree-shaking），仅打包使用到的图标；③ 支持SVG属性自定义（size/color/strokeWidth）；④ 社区活跃，持续更新 |
| **替代方案A** | **Heroicons** — Tailwind官方图标，风格类似；但更新频率和图标数量略逊于Lucide |
| **替代方案B** | **Ant Design Icons** — 与Ant Design组件库配套，图标丰富；但风格偏企业级，与娱乐媒体风格不够契合 |
| **潜在风险** | ① 自定义图标需额外引入SVG；② 图标命名需团队统一规范 |

---

## 2. 后端/API层

### 2.1 选型建议：Node.js + Express + 阿里云ECS（主方案）+ 阿里云函数计算（辅助）

| 维度 | 说明 |
|------|------|
| **选型方案** | 主服务：Node.js 20 + Express 4；部署：阿里云ECS；图片处理/轻量API：阿里云函数计算（FC） |
| **选型理由** | ① 团队技术栈统一（全TypeScript），前后端代码可共享类型定义；② Express生态成熟，中间件丰富（cors/helmet/compression/rate-limit）；③ 阿里云ECS初期成本低（1核2G约¥100/月），可控性强；④ 函数计算用于图片压缩、MOI问答代理等异步/轻量任务，按需付费 |
| **替代方案A** | **纯阿里云函数计算（Serverless）** — 免运维，自动扩缩容；但冷启动延迟（~500ms），不适合需要持久连接的场景；调试复杂；长期运行成本可能高于ECS |
| **替代方案B** | **Python + FastAPI + ECS** — FastAPI异步性能优秀，自动OpenAPI文档；但团队需维护两套技术栈，类型系统与前端不互通 |
| **替代方案C** | **Go + Gin + ECS** — 性能最佳，资源占用低；但开发效率低于Node.js，团队Go经验不足，过度设计 |
| **潜在风险** | ① Node.js单线程，CPU密集型任务需 offload 至Worker/函数计算；② Express 5升级可能有Breaking Changes；③ 需自行配置PM2进程管理、Nginx反向代理 |

### 2.2 后端架构分层

```
┌─────────────────────────────────────────────────────────────┐
│                      Nginx (反向代理)                        │
│         ┌──────────────┐          ┌──────────────┐           │
│         │  静态资源    │          │  API 路由    │           │
│         │  (React产物) │          │  /api/*      │           │
│         └──────────────┘          └──────┬───────┘           │
│                                           │                  │
│                              ┌────────────▼────────────┐      │
│                              │   Express 应用服务器    │      │
│                              │  ┌──────────────────┐  │      │
│                              │  │  Middleware层    │  │      │
│                              │  │  cors/helmet/     │  │      │
│                              │  │  compression/     │  │      │
│                              │  │  rate-limit       │  │      │
│                              │  └──────────────────┘  │      │
│                              │  ┌──────────────────┐  │      │
│                              │  │  Controller层    │  │      │
│                              │  │  /api/works       │  │      │
│                              │  │  /api/timeline    │  │      │
│                              │  │  /api/photos      │  │      │
│                              │  │  /api/chat        │  │      │
│                              │  └──────────────────┘  │      │
│                              │  ┌──────────────────┐  │      │
│                              │  │  Service层       │  │      │
│                              │  │  业务逻辑封装     │  │      │
│                              │  └──────────────────┘  │      │
│                              │  ┌──────────────────┐  │      │
│                              │  │  Repository层    │  │      │
│                              │  │  数据库访问抽象   │  │      │
│                              │  └──────────────────┘  │      │
│                              └─────────────────────────┘      │
│                                           │                  │
│                              ┌────────────▼────────────┐      │
│                              │      MatrixOne DB        │      │
│                              └─────────────────────────┘      │
│                                           │                  │
│                              ┌────────────▼────────────┐      │
│                              │   阿里云OSS (图片存储)   │      │
│                              └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 数据库层

### 3.1 选型：MatrixOne HTAP

| 维度 | 说明 |
|------|------|
| **选型版本** | MatrixOne 1.2.x（云托管版或自建） |
| **选型理由** | ① MySQL协议兼容，现有MySQL工具链可直接使用；② HTAP架构，OLTP（内容CRUD）+ OLAP（后台统计）统一引擎；③ 内置向量检索（支持QA知识库语义搜索）；④ 云原生，支持水平扩展；⑤ 非结构化数据（图片Blob）统一存储 |
| **替代方案A** | **MySQL 8.0 + Elasticsearch** — MySQL处理事务，ES处理全文搜索和向量检索；但架构复杂，数据同步延迟，运维成本高 |
| **替代方案B** | **PostgreSQL + pgvector** — PG生态强大，pgvector向量扩展成熟；但HTAP能力需额外插件（Citus/TimescaleDB），国内云厂商支持不如MySQL |
| **潜在风险** | ① MatrixOne社区版功能可能受限，需确认向量检索和Blob存储的成熟度；② HTAP场景资源隔离配置不当可能影响性能；③ 备份恢复工具链需验证 |

### 3.2 Schema 设计

```sql
-- 数据库: shaking_web
-- 字符集: utf8mb4
-- 排序规则: utf8mb4_unicode_ci

-- ============================================
-- 1. 作品表 (works)
-- ============================================
CREATE TABLE works (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title           VARCHAR(255) NOT NULL COMMENT '作品名称',
    type            ENUM('综艺', '电视剧', '电影', '音乐', '舞台') NOT NULL COMMENT '作品大类',
    category        VARCHAR(50) COMMENT '细分分类（如晚会/音乐节/单曲/EP）',
    release_date    DATE COMMENT '发布/播出日期',
    cover_image     VARCHAR(500) COMMENT '封面图片URL（OSS地址）',
    description     TEXT COMMENT '作品简介',
    role            VARCHAR(100) COMMENT '谢可寅角色/身份',
    platform        VARCHAR(100) COMMENT '播出/发行平台',
    external_link   VARCHAR(500) COMMENT '外部跳转链接',
    status          ENUM('已播出', '即将上线', '热播中') DEFAULT '已播出',
    tags            JSON COMMENT '标签数组 ["标签1", "标签2"]',
    sort_order      INT DEFAULT 0 COMMENT '排序权重',
    is_published    BOOLEAN DEFAULT TRUE COMMENT '是否发布',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_release_date (release_date),
    INDEX idx_status (status),
    FULLTEXT INDEX ft_title_desc (title, description)  -- 全文搜索
) ENGINE = MO_ENGINE COMMENT = '作品信息表';

-- ============================================
-- 2. 时间线事件表 (timeline_events)
-- ============================================
CREATE TABLE timeline_events (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_date      DATE NOT NULL COMMENT '事件日期',
    title           VARCHAR(255) NOT NULL COMMENT '事件标题',
    description     TEXT COMMENT '事件描述',
    category        ENUM('选秀', '出道', '影视', '音乐', '获奖', '其他') NOT NULL,
    related_works   JSON COMMENT '关联作品ID数组',
    images          JSON COMMENT '关联图片URL数组',
    importance      TINYINT DEFAULT 3 COMMENT '重要程度 1-5',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_category (category),
    INDEX idx_importance (importance)
) ENGINE = MO_ENGINE COMMENT = '成长时间线事件表';

-- ============================================
-- 3. 图片表 (photos)
-- ============================================
CREATE TABLE photos (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    url             VARCHAR(500) NOT NULL COMMENT '原图URL（OSS）',
    thumbnail_url   VARCHAR(500) COMMENT '缩略图URL（OSS）',
    webp_url        VARCHAR(500) COMMENT 'WebP格式URL',
    album           VARCHAR(50) NOT NULL COMMENT '相册分类',
    title           VARCHAR(255) COMMENT '图片标题',
    description     TEXT COMMENT '图片描述',
    tags            JSON COMMENT '标签数组',
    taken_date      DATE COMMENT '拍摄日期',
    source          VARCHAR(100) COMMENT '图片来源/摄影师',
    file_size       INT COMMENT '文件大小（字节）',
    width           INT COMMENT '图片宽度',
    height          INT COMMENT '图片高度',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_album (album),
    INDEX idx_taken_date (taken_date)
) ENGINE = MO_ENGINE COMMENT = '相册图片表';

-- ============================================
-- 4. 音乐作品表 (music) — 扩展表，继承works
-- ============================================
CREATE TABLE music (
    id              VARCHAR(36) PRIMARY KEY,
    work_id         VARCHAR(36) NOT NULL,
    music_type      ENUM('原创单曲', '合作曲', 'THE9时期', '舞台Live') NOT NULL,
    lyrics_by       VARCHAR(100) COMMENT '作词',
    composed_by     VARCHAR(100) COMMENT '作曲',
    arranged_by     VARCHAR(100) COMMENT '编曲',
    duration        INT COMMENT '时长（秒）',
    music_platform_links JSON COMMENT '音乐平台链接 {qq_music: "", netease: ""}',
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE = MO_ENGINE COMMENT = '音乐作品扩展信息';

-- ============================================
-- 5. 影视作品表 (film_tv) — 扩展表
-- ============================================
CREATE TABLE film_tv (
    id              VARCHAR(36) PRIMARY KEY,
    work_id         VARCHAR(36) NOT NULL,
    film_type       ENUM('电视剧', '电影', '微综') NOT NULL,
    episodes        INT COMMENT '集数',
    director        VARCHAR(100) COMMENT '导演',
    co_stars        JSON COMMENT '合作演员数组',
    broadcast_platform VARCHAR(100) COMMENT '播出平台',
    FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE = MO_ENGINE COMMENT = '影视作品扩展信息';

-- ============================================
-- 6. 问答知识库表 (qa_knowledge)
-- ============================================
CREATE TABLE qa_knowledge (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question        VARCHAR(500) NOT NULL COMMENT '问题',
    answer          TEXT NOT NULL COMMENT '答案',
    category        VARCHAR(50) COMMENT '分类',
    source          VARCHAR(100) COMMENT '来源',
    confidence      DECIMAL(3,2) DEFAULT 0.95 COMMENT '置信度',
    vector_embedding VECTOR(768) COMMENT '向量嵌入（用于语义检索）',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
) ENGINE = MO_ENGINE COMMENT = '本地FAQ知识库';

-- 向量索引（MatrixOne支持）
CREATE VECTOR INDEX idx_vector ON qa_knowledge(vector_embedding) USING ivf_flat;

-- ============================================
-- 7. 网站配置表 (site_configs)
-- ============================================
CREATE TABLE site_configs (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    config_key      VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value    TEXT COMMENT '配置值（JSON字符串）',
    description     VARCHAR(255) COMMENT '配置说明',
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key)
) ENGINE = MO_ENGINE COMMENT = '网站运行时配置';

-- ============================================
-- 8. 管理员账户表 (admin_users)
-- ============================================
CREATE TABLE admin_users (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username        VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL COMMENT 'bcrypt哈希',
    email           VARCHAR(100) UNIQUE,
    role            ENUM('super_admin', 'editor') DEFAULT 'editor',
    last_login      TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = MO_ENGINE COMMENT = '后台管理员表';

-- ============================================
-- 9. 审计日志表 (audit_logs)
-- ============================================
CREATE TABLE audit_logs (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         VARCHAR(36) COMMENT '操作人ID',
    action          VARCHAR(50) NOT NULL COMMENT '操作类型',
    resource_type   VARCHAR(50) NOT NULL COMMENT '资源类型',
    resource_id     VARCHAR(36) COMMENT '资源ID',
    old_value       JSON COMMENT '变更前数据',
    new_value       JSON COMMENT '变更后数据',
    ip_address      VARCHAR(45) COMMENT 'IP地址',
    user_agent      VARCHAR(255) COMMENT '浏览器UA',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at)
) ENGINE = MO_ENGINE COMMENT = '操作审计日志';

-- ============================================
-- 10. 初始化数据
-- ============================================
INSERT INTO site_configs (config_key, config_value, description) VALUES
('site_title', '"Shaking Chloe 谢可寅个人展示网站"', '网站标题'),
('site_description', '"谢可寅（Shaking Chloe）官方粉丝展示网站 - 音乐、影视、舞台、成长时间线"', 'SEO描述'),
('hero_banners', '["https://oss.example.com/banner1.jpg","https://oss.example.com/banner2.jpg"]', '首页轮播图'),
('social_links', '{"weibo":"https://weibo.com/xxx","douyin":"https://douyin.com/xxx","instagram":"https://instagram.com/xxx"}', '社交媒体链接'),
('moi_api_endpoint', '"https://moi.matrixorigin.cn/api/v1"', 'MOI API地址'),
('moi_api_timeout', '30000', 'MOI API超时(ms)');
```

### 3.3 连接方式

```typescript
// src/server/db/connection.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '6001'),
  user: process.env.DB_USER || 'shaking_user',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'shaking_web',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // MatrixOne兼容MySQL协议
  // 如需SSL: ssl: { ca: fs.readFileSync('ca.pem') }
});

export default pool;
```

### 3.4 ORM 选型：不使用传统ORM，采用 Repository + SQL Builder 模式

| 维度 | 说明 |
|------|------|
| **选型理由** | ① MatrixOne HTAP特性，复杂查询需原生SQL优化；② 展示型网站查询模式简单（CRUD+分页），ORM收益有限；③ 避免ORM抽象层带来的性能损耗和学习成本；④ TypeScript + `mysql2` 已提供类型安全的查询结果 |
| **SQL Builder** | `kysely@0.27.3` — 类型安全的SQL构建器，无ORM的模型层，编译期检查SQL语法，支持MySQL方言 |
| **替代方案A** | **Prisma** — 类型安全、自动迁移、可视化Studio；但Prisma对MatrixOne支持未验证，查询引擎额外开销 |
| **替代方案B** | **TypeORM** — 装饰器模式，功能丰富；但配置复杂，性能一般，与MatrixOne兼容性未知 |
| **潜在风险** | ① 手写SQL需团队有SQL调优能力；② 需自行管理连接池和事务；③ 数据库迁移需手写脚本或使用工具（如dbmate） |

---

## 4. 智能问答集成

### 4.1 MOI REST API 接入方案

```typescript
// src/server/services/moiChatService.ts

interface MOIChatRequest {
  question: string;
  session_id?: string;      // 多轮对话会话ID
  top_k?: number;           // 检索结果数量
  temperature?: number;     // 生成温度
  max_tokens?: number;      // 最大生成token数
}

interface MOIChatResponse {
  answer: string;
  sources: Array<{
    title: string;
    url: string;
    relevance: number;
  }>;
  session_id: string;
  confidence: number;
  processing_time: number;
}

interface ChatFallbackResponse {
  answer: string;
  is_fallback: true;
  fallback_type: 'local_faq' | 'generic' | 'service_unavailable';
}

const MOI_API_BASE = process.env.MOI_API_BASE_URL || 'https://moi.matrixorigin.cn/api/v1';
const MOI_API_KEY = process.env.MOI_API_KEY;
const MOI_TIMEOUT = parseInt(process.env.MOI_API_TIMEOUT || '30000');
const MOI_MAX_RETRIES = 2;

class MOIChatService {
  private async callMOIAPI(request: MOIChatRequest): Promise<MOIChatResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MOI_TIMEOUT);

    try {
      const response = await fetch(`${MOI_API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MOI_API_KEY}`,
          'X-Request-ID': crypto.randomUUID(),
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new MOIAPIError(
          `MOI API error: ${response.status} ${response.statusText}`,
          response.status,
          errorBody
        );
      }

      return await response.json() as MOIChatResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async chat(question: string, sessionId?: string): Promise<MOIChatResponse | ChatFallbackResponse> {
    // 1. 尝试调用MOI API（带重试）
    for (let attempt = 0; attempt <= MOI_MAX_RETRIES; attempt++) {
      try {
        const response = await this.callMOIAPI({
          question,
          session_id: sessionId,
          top_k: 5,
          temperature: 0.7,
          max_tokens: 512,
        });

        // 置信度过滤
        if (response.confidence < 0.6) {
          return this.fallbackToLocalFAQ(question);
        }

        return response;
      } catch (error) {
        if (attempt === MOI_MAX_RETRIES) {
          console.error('MOI API failed after retries:', error);
          break;
        }
        // 指数退避重试
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }

    // 2. 兜底策略
    return this.fallbackToLocalFAQ(question);
  }

  private async fallbackToLocalFAQ(question: string): Promise<ChatFallbackResponse> {
    // 2.1 本地FAQ精确匹配
    const exactMatch = await this.findLocalFAQ(question);
    if (exactMatch) {
      return {
        answer: exactMatch.answer,
        is_fallback: true,
        fallback_type: 'local_faq',
      };
    }

    // 2.2 语义相似度匹配（MatrixOne向量检索）
    const semanticMatch = await this.findSemanticFAQ(question);
    if (semanticMatch && semanticMatch.similarity > 0.85) {
      return {
        answer: semanticMatch.answer,
        is_fallback: true,
        fallback_type: 'local_faq',
      };
    }

    // 2.3 通用兜底回答
    return {
      answer: '抱歉，我暂时无法回答这个问题。您可以尝试询问谢可寅的代表作品、音乐作品或成长经历，我会尽力为您解答！',
      is_fallback: true,
      fallback_type: 'generic',
    };
  }

  private async findLocalFAQ(question: string) {
    // 精确匹配或LIKE查询
    const [rows] = await db.execute(
      'SELECT * FROM qa_knowledge WHERE question LIKE ? AND is_active = TRUE LIMIT 1',
      [`%${question}%`]
    );
    return rows[0] || null;
  }

  private async findSemanticFAQ(question: string) {
    // MatrixOne向量检索（需预先生成向量嵌入）
    // 实际实现需调用Embedding服务或预计算向量
    const [rows] = await db.execute(
      `SELECT id, question, answer, 
        cosine_similarity(vector_embedding, ?) as similarity
       FROM qa_knowledge 
       WHERE is_active = TRUE
       ORDER BY similarity DESC
       LIMIT 1`,
      [await getEmbedding(question)]
    );
    return rows[0] || null;
  }
}

class MOIAPIError extends Error {
  constructor(message: string, public statusCode: number, public body: string) {
    super(message);
  }
}
```

### 4.2 前端问答组件接口

```typescript
// src/types/chat.ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
  }>;
  isFallback?: boolean;
  timestamp: number;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: number;
}

// API端点
// POST /api/chat
// Request: { question: string, sessionId?: string }
// Response: { success: true, data: ChatMessage }
// Error: { success: false, error: string, fallback?: boolean }
```

### 4.3 错误处理与兜底策略

| 场景 | 策略 |
|------|------|
| MOI API 超时（>30s） | 返回本地FAQ匹配结果，UI显示"正在使用本地知识库回答" |
| MOI API 5xx错误 | 自动重试2次（指数退避），仍失败则切换本地FAQ |
| MOI API 4xx错误 | 记录错误日志，直接返回通用兜底回答 |
| 置信度 < 0.6 | 不展示低置信度回答，切换至本地FAQ或通用回答 |
| 本地FAQ无匹配 | 返回通用友好提示，引导用户提问其他问题 |
| 网络完全中断 | UI显示"问答服务维护中，请稍后重试"，不影响主站功能 |

---

## 5. 部署与DevOps

### 5.1 GitHub Actions CI/CD 流程

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  REGISTRY: registry.cn-hangzhou.aliyuncs.com
  IMAGE_NAME: shaking-web

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Build
        run: npm run build

  build-and-push:
    name: Build Docker Image
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Alibaba Cloud Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.ALICLOUD_USERNAME }}
          password: ${{ secrets.ALICLOUD_PASSWORD }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ secrets.ALICLOUD_NAMESPACE }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=,suffix=,format=short
            type=raw,value=latest
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy to ECS
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.ECS_HOST }}
          username: ${{ secrets.ECS_USER }}
          key: ${{ secrets.ECS_SSH_KEY }}
          script: |
            cd /opt/shaking-web
            docker pull ${{ env.REGISTRY }}/${{ secrets.ALICLOUD_NAMESPACE }}/${{ env.IMAGE_NAME }}:latest
            docker-compose down
            docker-compose up -d
            docker system prune -f
```

### 5.2 阿里云ECS部署方案

| 维度 | 配置 |
|------|------|
| **实例规格** | 初期：ecs.t6-c1m2.large（2核4G，突发性能）<br>成长期：ecs.c7.large（2核4G，计算型）<br>高峰期：ecs.c7.xlarge（4核8G）+ SLB |
| **操作系统** | Alibaba Cloud Linux 3 / CentOS Stream 9 |
| **存储** | 系统盘：40GB ESSD Entry<br>数据盘：100GB ESSD（数据库+日志） |
| **网络** | 专有网络VPC，公网带宽5Mbps（按流量计费） |
| **安全组** | 入站：80/443（HTTP/HTTPS）、22（SSH，限制IP）<br>出站：全部允许 |
| **费用预估** | 初期：约¥150-200/月（含带宽）；高峰期按需扩容 |

### 5.3 Nginx 配置

```nginx
# /etc/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    '$request_time $upstream_response_time';

    access_log /var/log/nginx/access.log main;

    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # 限流配置
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=chat:10m rate=30r/m;

    # 上游：Node.js应用
    upstream app_server {
        server 127.0.0.1:3000;
        keepalive 32;
    }

    # HTTP -> HTTPS 重定向
    server {
        listen 80;
        server_name shaking-chole.com www.shaking-chole.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS 主站
    server {
        listen 443 ssl http2;
        server_name shaking-chole.com www.shaking-chole.com;

        # SSL证书（阿里云SSL/Let's Encrypt）
        ssl_certificate /etc/nginx/ssl/shaking-chole.com.crt;
        ssl_certificate_key /etc/nginx/ssl/shaking-chole.com.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # 安全响应头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # 静态资源（React构建产物）
        location / {
            root /opt/shaking-web/dist;
            index index.html;
            try_files $uri $uri/ /index.html;

            # 静态资源缓存
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
                access_log off;
            }
        }

        # API代理
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app_server/;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            proxy_read_timeout 30s;
        }

        # 问答API限流
        location /api/chat {
            limit_req zone=chat burst=10 nodelay;
            proxy_pass http://app_server/chat;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### 5.4 Docker 化方案

```dockerfile
# Dockerfile (多阶段构建)
# ============================================
# 阶段1：构建前端
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 复制源码并构建
COPY . .
RUN npm run build

# ============================================
# 阶段2：生产运行环境
# ============================================
FROM node:20-alpine AS production

# 安装PM2
RUN npm install -g pm2

WORKDIR /app

# 仅复制生产依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制构建产物和服务器代码
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY ecosystem.config.js ./

# 非root用户运行
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

# PM2启动
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
```

```javascript
// ecosystem.config.js (PM2配置)
module.exports = {
  apps: [{
    name: 'shaking-web',
    script: './server/index.js',
    instances: 'max',        // 根据CPU核心数启动多实例
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
    },
    // 日志
    log_file: '/var/log/pm2/combined.log',
    out_file: '/var/log/pm2/out.log',
    error_file: '/var/log/pm2/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // 自动重启
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    // 内存限制
    max_memory_restart: '512M',
    // 健康检查
    health_check_grace_period: 30000,
  }],
};
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: registry.cn-hangzhou.aliyuncs.com/your-namespace/shaking-web:latest
    container_name: shaking-web
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - MOI_API_KEY=${MOI_API_KEY}
      - MOI_API_BASE_URL=${MOI_API_BASE_URL}
      - SENTRY_DSN=${SENTRY_DSN}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - /var/log/shaking-web:/app/logs
    networks:
      - shaking-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # 可选：Redis缓存（问答会话、热点数据）
  redis:
    image: redis:7-alpine
    container_name: shaking-redis
    restart: always
    volumes:
      - redis-data:/data
    networks:
      - shaking-network

networks:
  shaking-network:
    driver: bridge

volumes:
  redis-data:
```

---

## 6. 监控体系

### 6.1 Sentry 错误监控（前端）

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/browser';

// SDK版本: @sentry/react@8.13.0
export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    
    // 采样率
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,  // 生产环境10%采样
    replaysSessionSampleRate: 0.01,  // 1%会话录制
    replaysOnErrorSampleRate: 1.0,   // 错误发生时100%录制
    
    integrations: [
      new BrowserTracing({
        // 路由追踪
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        ),
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: true,
      }),
    ],
    
    // 过滤敏感信息
    beforeSend(event) {
      // 过滤掉非生产环境错误
      if (import.meta.env.DEV) return null;
      
      // 过滤已知无害错误
      const ignoreErrors = [
        'ResizeObserver loop limit exceeded',
        'Network request failed',
      ];
      if (ignoreErrors.some(e => event.exception?.values?.[0]?.value?.includes(e))) {
        return null;
      }
      
      return event;
    },
  });
}

// React错误边界
export const SentryErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => children,
  { fallback: <ErrorFallback /> }
);
```

### 6.2 阿里云ARMS前端监控

```typescript
// src/utils/arms.ts
// SDK版本: @arms/js-sdk@1.0.0 (通过CDN引入)

export function initARMS() {
  if (import.meta.env.DEV) return;

  // 在index.html中引入CDN脚本
  // <script src="https://sdk.rum.aliyuncs.com/v2/browser-sdk.js" crossorigin></script>

  (window as any).Bl && (window as any).Bl.config({
    pid: import.meta.env.VITE_ARMS_PID,        // ARMS项目ID
    appType: 'web',
    imgUrl: 'https://arms-retcode.aliyuncs.com/r.png',
    sendResource: true,                          // 资源加载监控
    enableLinkTrace: true,                       // 链路追踪
    enableApiCors: true,
    enableSPA: true,                             // SPA页面监控
    useFmp: true,                                // 首屏时间
    sample: 10,                                  // 10%采样率
    // 过滤敏感API
    ignore: {
      ignoreUrls: ['/api/health'],
      ignoreApis: ['/api/chat'],
    },
  });
}
```

```html
<!-- index.html -->
<script>
  (function(w, d, s, q, i) {
    w[q] = w[q] || [];
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
    j.async = true;
    j.id = 'beacon-aplus';
    j.src = 'https://sdk.rum.aliyuncs.com/v2/browser-sdk.js';
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'aplus_queue');

  aplus_queue.push({
    action: 'aplus.setConfig',
    arguments: [{ appKey: 'YOUR_ARMS_APPKEY' }]
  });
</script>
```

### 6.3 阿里云云监控（服务器监控）

```bash
# 安装云监控插件（ECS已预装）
# 配置告警规则（通过阿里云控制台或CLI）

# 告警规则配置示例（CLI）
aliyun cms PutResourceMetricRule \
  --RuleName "CPU-High-Usage" \
  --Namespace "acs_ecs_dashboard" \
  --MetricName "CPUUtilization" \
  --EscalationsCriticalStatistics "Average" \
  --EscalationsCriticalComparisonOperator ">=" \
  --EscalationsCriticalThreshold 80 \
  --EscalationsCriticalTimes 3 \
  --ContactGroupId "shaking-web-ops"
```

| 监控项 | 告警阈值 | 通知方式 | 级别 |
|--------|---------|---------|------|
| CPU使用率 | >= 80% 持续3周期 | 钉钉+短信 | 警告 |
| 内存使用率 | >= 85% 持续3周期 | 钉钉+短信 | 警告 |
| 磁盘使用率 | >= 90% | 钉钉+短信 | 紧急 |
| 网络入带宽 | >= 40Mbps | 钉钉 | 警告 |
| 网络出带宽 | >= 40Mbps | 钉钉 | 警告 |
| 5xx错误率 | >= 1% | 钉钉+短信 | 紧急 |
| 平均响应时间 | >= 500ms | 钉钉 | 警告 |

### 6.4 阿里云SLS日志服务

```typescript
// src/utils/logger.ts
// SDK版本: @alicloud/sls-webtrack@0.3.0 (前端)
// 后端使用 @alicloud/log@2.0.0

import SLSLogger from '@alicloud/sls-webtrack';

const slsLogger = new SLSLogger({
  endpoint: 'cn-hangzhou.log.aliyuncs.com',
  project: 'shaking-web-logs',
  logstore: 'app-logs',
  accessKeyId: import.meta.env.VITE_SLS_ACCESS_KEY_ID,
  accessKeySecret: import.meta.env.VITE_SLS_ACCESS_KEY_SECRET,
});

export function logEvent(topic: string, data: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.log('[SLS]', topic, data);
    return;
  }

  slsLogger.send({
    __topic__: topic,
    __logs__: [{
      level: data.level || 'INFO',
      message: typeof data.message === 'string' ? data.message : JSON.stringify(data.message),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      ...data,
    }],
  });
}

// 使用示例
logEvent('user_behavior', {
  action: 'page_view',
  page: '/works',
  referrer: document.referrer,
});

logEvent('api_request', {
  action: 'api_call',
  endpoint: '/api/works',
  duration: 120,
  status: 200,
});
```

```javascript
// server/utils/logger.js (后端日志)
const Log = require('@alicloud/log');

const slsClient = new Log({
  endpoint: process.env.SLS_ENDPOINT,
  accessKeyId: process.env.SLS_ACCESS_KEY_ID,
  accessKeySecret: process.env.SLS_ACCESS_KEY_SECRET,
});

async function logToSLS(topic, logs) {
  try {
    await slsClient.postLogs('shaking-web-logs', 'server-logs', {
      __topic__: topic,
      __logs__: logs.map(log => ({
        time: Math.floor(Date.now() / 1000),
        contents: Object.entries(log).map(([key, value]) => ({
          key,
          value: String(value),
        })),
      })),
    });
  } catch (err) {
    console.error('SLS log failed:', err);
  }
}

module.exports = { logToSLS };
```

### 6.5 监控配置汇总

| 监控工具 | SDK版本 | 采样率 | 初始化位置 | 月费用 |
|---------|---------|--------|-----------|--------|
| **Sentry** | `@sentry/react@8.13.0` | 错误100%，性能10% | `main.tsx` (生产环境) | 免费（5k事件/月） |
| **ARMS** | CDN v2 | 10% | `index.html` (生产环境) | 免费（100万PV/月） |
| **云监控** | 阿里云插件 | 100% | ECS预装 | 免费 |
| **SLS** | `@alicloud/sls-webtrack@0.3.0` | 100%日志，采样上报 | `logger.ts` | ~¥10/月（按量） |

---

## 7. 项目目录结构

```
shaking-web/
├── .github/
│   └── workflows/
│       ├── ci.yml              # PR检查：lint + type-check + test
│       └── deploy.yml          # 主分支部署流水线
├── .husky/                     # Git hooks
│   ├── pre-commit
│   └── commit-msg
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── main.tsx                # 应用入口
│   ├── App.tsx                 # 根组件
│   ├── routes.tsx              # 路由配置
│   ├── index.css               # 全局样式 + Tailwind指令
│   │
│   ├── api/                    # API客户端
│   │   ├── client.ts           # Axios/Fetch封装
│   │   ├── works.ts
│   │   ├── timeline.ts
│   │   ├── photos.ts
│   │   └── chat.ts
│   │
│   ├── components/             # 公共组件
│   │   ├── ui/                 # 基础UI组件（Button/Card/Modal）
│   │   ├── layout/             # 布局组件（Header/Sidebar/Footer）
│   │   ├── common/             # 业务通用组件（Loading/ErrorBoundary）
│   │   └── chat/               # 问答机器人组件
│   │       ├── ChatWidget.tsx
│   │       ├── ChatWindow.tsx
│   │       └── ChatMessage.tsx
│   │
│   ├── hooks/                  # 自定义Hooks
│   │   ├── useWorks.ts
│   │   ├── useTimeline.ts
│   │   ├── usePhotos.ts
│   │   └── useChat.ts
│   │
│   ├── pages/                  # 页面组件
│   │   ├── Home/
│   │   │   ├── index.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── QuickLinks.tsx
│   │   ├── Works/
│   │   ├── Music/
│   │   ├── FilmTV/
│   │   ├── Stage/
│   │   ├── Gallery/
│   │   ├── Timeline/
│   │   └── About/
│   │
│   ├── stores/                 # Zustand状态管理
│   │   ├── uiStore.ts          # UI状态（主题/侧边栏/搜索）
│   │   └── authStore.ts        # 认证状态（后台管理）
│   │
│   ├── types/                  # TypeScript类型定义
│   │   ├── work.ts
│   │   ├── timeline.ts
│   │   ├── photo.ts
│   │   └── chat.ts
│   │
│   ├── utils/                  # 工具函数
│   │   ├── sentry.ts           # Sentry初始化
│   │   ├── arms.ts             # ARMS初始化
│   │   ├── logger.ts           # SLS日志
│   │   ├── format.ts           # 日期/数字格式化
│   │   └── constants.ts        # 常量定义
│   │
│   └── styles/                 # 样式文件
│       └── tailwind.config.js  # Tailwind配置
│
├── server/                     # 后端服务（Node.js + Express）
│   ├── index.ts                # 服务入口
│   ├── app.ts                  # Express应用配置
│   ├── config/
│   │   └── database.ts         # 数据库配置
│   ├── middleware/
│   │   ├── auth.ts             # JWT认证
│   │   ├── errorHandler.ts     # 全局错误处理
│   │   ├── rateLimiter.ts      # 限流
│   │   └── requestValidator.ts # 请求验证
│   ├── routes/
│   │   ├── works.ts
│   │   ├── timeline.ts
│   │   ├── photos.ts
│   │   ├── chat.ts
│   │   ├── admin.ts
│   │   └── health.ts
│   ├── controllers/
│   │   ├── worksController.ts
│   │   ├── timelineController.ts
│   │   ├── photosController.ts
│   │   ├── chatController.ts
│   │   └── adminController.ts
│   ├── services/
│   │   ├── worksService.ts
│   │   ├── timelineService.ts
│   │   ├── photosService.ts
│   │   ├── moiChatService.ts   # MOI问答服务
│   │   └── adminService.ts
│   ├── repositories/
│   │   ├── worksRepository.ts
│   │   ├── timelineRepository.ts
│   │   ├── photosRepository.ts
│   │   └── qaRepository.ts
│   ├── db/
│   │   ├── connection.ts         # 数据库连接池
│   │   └── migrations/           # 数据库迁移脚本
│   ├── utils/
│   │   ├── logger.ts             # 服务端日志
│   │   ├── response.ts           # 统一响应格式
│   │   └── oss.ts                # 阿里云OSS客户端
│   └── types/
│       └── express.d.ts          # Express类型扩展
│
├── scripts/
│   ├── db-migrate.sh             # 数据库迁移脚本
│   └── deploy.sh                 # 本地部署脚本
│
├── tests/
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # E2E测试（Playwright）
│
├── .env.example                  # 环境变量模板
├── .env.local                    # 本地环境变量（不提交Git）
├── .eslintrc.cjs                 # ESLint配置
├── .prettierrc                   # Prettier配置
├── tsconfig.json                 # TypeScript配置
├── tsconfig.server.json          # 服务端TypeScript配置
├── vite.config.ts                # Vite配置
├── tailwind.config.js            # Tailwind配置
├── postcss.config.js             # PostCSS配置
├── jest.config.js                # Jest测试配置
├── playwright.config.ts          # Playwright E2E配置
├── package.json
├── package-lock.json
└── README.md
```

---

## 8. 关键配置文件模板

### 8.1 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({ open: true, gzipSize: true }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@server': resolve(__dirname, 'server'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          query: ['@tanstack/react-query'],
        },
      },
    },
    // 图片压缩
    assetsInlineLimit: 4096,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // 环境变量前缀
  envPrefix: 'VITE_',
}));
```

### 8.2 Tailwind 配置

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 项目配色规范
        background: {
          DEFAULT: '#0a0a0a',
          secondary: '#121212',
          card: '#1a1a1a',
        },
        foreground: {
          DEFAULT: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#6b6b6b',
        },
        accent: {
          DEFAULT: '#f5c518',
          hover: '#ffd700',
        },
        border: {
          DEFAULT: '#2a2a2a',
          light: '#333333',
        },
        error: '#ff4d4f',
        success: '#52c41a',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Noto Sans SC',
          'sans-serif',
        ],
      },
      fontSize: {
        'hero': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
        'h3': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.5' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
```

### 8.3 TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@server/*": ["server/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@stores/*": ["src/stores/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist", "server"]
}
```

```json
// tsconfig.server.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2020",
    "outDir": "./dist-server",
    "rootDir": "./server",
    "moduleResolution": "node"
  },
  "include": ["server/**/*"],
  "exclude": ["node_modules", "dist", "dist-server", "src"]
}
```

### 8.4 ESLint + Prettier 配置

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', '@typescript-eslint', 'jsx-a11y'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
  },
  settings: {
    react: { version: 'detect' },
  },
};
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 8.5 环境变量模板

```bash
# .env.example

# ===== 应用配置 =====
NODE_ENV=development
PORT=3000
VITE_APP_VERSION=1.0.0

# ===== 数据库配置 (MatrixOne) =====
DB_HOST=localhost
DB_PORT=6001
DB_USER=shaking_user
DB_PASSWORD=your_password
DB_NAME=shaking_web

# ===== MOI 智能问答 =====
MOI_API_BASE_URL=https://moi.matrixorigin.cn/api/v1
MOI_API_KEY=your_moi_api_key
MOI_API_TIMEOUT=30000

# ===== 阿里云 OSS =====
OSS_REGION=oss-cn-hangzhou
OSS_BUCKET=shaking-web-assets
OSS_ACCESS_KEY_ID=your_access_key
OSS_ACCESS_KEY_SECRET=your_secret
OSS_CDN_DOMAIN=https://cdn.shaking-chole.com

# ===== 监控配置 =====
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_ARMS_PID=your_arms_pid
SLS_ENDPOINT=cn-hangzhou.log.aliyuncs.com
SLS_ACCESS_KEY_ID=your_sls_key
SLS_ACCESS_KEY_SECRET=your_sls_secret

# ===== JWT 认证 =====
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# ===== 其他 =====
ADMIN_DEFAULT_PASSWORD=change_me_immediately
```

---

## 9. package.json 完整示例

```json
{
  "name": "shaking-web",
  "version": "1.0.0",
  "description": "Shaking Chloe 谢可寅个人展示网站",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\" \"server/**/*.{ts,js}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage --reporters=default --reporters=jest-junit",
    "test:e2e": "playwright test",
    "server:dev": "tsx watch server/index.ts",
    "server:build": "tsc -p tsconfig.server.json",
    "server:start": "node dist-server/index.js",
    "db:migrate": "bash scripts/db-migrate.sh",
    "db:seed": "tsx scripts/seed.ts",
    "prepare": "husky"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.24.1",
    "@tanstack/react-query": "^5.51.1",
    "zustand": "^4.5.4",
    "framer-motion": "^11.2.12",
    "lucide-react": "^0.400.0",
    "axios": "^1.7.2",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.14.10",
    "@typescript-eslint/eslint-plugin": "^7.16.0",
    "@typescript-eslint/parser": "^7.16.0",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.3.3",
    "typescript": "^5.5.4",
    "tailwindcss": "^3.4.6",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.19",
    "@tailwindcss/line-clamp": "^0.4.4",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.34.3",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "eslint-plugin-jsx-a11y": "^6.9.0",
    "prettier": "^3.3.2",
    "prettier-plugin-tailwindcss": "^0.6.5",
    "@sentry/react": "^8.13.0",
    "@sentry/browser": "^8.13.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "ts-jest": "^29.2.2",
    "jest-junit": "^16.0.0",
    "@playwright/test": "^1.45.1",
    "tsx": "^4.16.2",
    "rollup-plugin-visualizer": "^5.12.0",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.7"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,json,md}": [
      "prettier --write"
    ]
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

---

## 10. 风险矩阵与应对策略

| 风险项 | 影响 | 概率 | 应对策略 | 责任人 |
|--------|------|------|---------|--------|
| **MatrixOne兼容性** | 高 | 中 | ① 开发初期搭建MatrixOne测试环境验证所有SQL；② 准备MySQL 8.0降级方案；③ 与MatrixOne技术支持建立沟通渠道 | 后端负责人 |
| **MOI服务稳定性** | 中 | 低 | ① 多层级兜底策略（MOI→本地FAQ→通用回答）；② 问答模块独立部署，故障不影响主站；③ 监控MOI API可用性，异常自动切换 | 后端负责人 |
| **前端性能瓶颈** | 中 | 中 | ① 图片WebP+懒加载+CDN；② 路由懒加载+代码分割；③ 骨架屏优先；④ 定期Lighthouse评分检查 | 前端负责人 |
| **安全漏洞** | 高 | 低 | ① 依赖自动扫描（Dependabot）；② XSS输入过滤；③ CSP策略；④ 后台强密码+JWT过期；⑤ 定期安全审计 | 全团队 |
| **部署故障** | 中 | 低 | ① 蓝绿部署/滚动更新；② 健康检查自动回滚；③ 数据库迁移前备份；④ 部署窗口期低流量时段 | DevOps |
| **监控成本超支** | 低 | 低 | ① 严格采样率控制；② 每月监控费用审查；③ SLS日志定期清理；④ 流量增长后评估Sentry付费升级 | DevOps |
| **版权合规** | 高 | 中 | ① 所有音视频仅跳转外部平台；② 图片使用公开活动照/官方物料；③ 法律顾问审核；④ 用户上传内容审核机制 | 产品经理 |
| **React 19升级** | 低 | 高 | ① 关注React 19 RFC和迁移指南；② 避免使用实验性API；③ 升级前在 staging 环境充分测试 | 前端负责人 |

---

## 附录

### A. 技术栈版本锁定汇总

| 技术 | 版本 | 包名 |
|------|------|------|
| React | 18.3.1 | `react`, `react-dom` |
| TypeScript | 5.5.4 | `typescript` |
| Vite | 5.3.3 | `vite` |
| Tailwind CSS | 3.4.6 | `tailwindcss` |
| React Router | 6.24.1 | `react-router-dom` |
| Zustand | 4.5.4 | `zustand` |
| React Query | 5.51.1 | `@tanstack/react-query` |
| Framer Motion | 11.2.12 | `framer-motion` |
| Lucide React | 0.400.0 | `lucide-react` |
| Sentry SDK | 8.13.0 | `@sentry/react` |
| Node.js | 20.x LTS | - |
| Express | 4.x | `express` |
| MatrixOne | 1.2.x | - |

### B. 参考文档

- React 18 官方文档: https://react.dev
- Vite 官方文档: https://vitejs.dev
- Tailwind CSS 官方文档: https://tailwindcss.com
- MatrixOne 官方文档: https://docs.matrixorigin.cn
- MatrixOne Intelligence: https://moi.matrixorigin.cn
- Sentry 官方文档: https://docs.sentry.io
- 阿里云ARMS: https://www.aliyun.com/product/arms

---

> **文档结束**  
> 本技术选型文档基于需求分析文档 v1.0 编写，随项目进展持续更新。  
> 如有疑问或需调整，请联系技术负责人。
