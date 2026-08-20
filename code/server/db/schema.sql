-- ============================================
-- shaking-web-site 数据库 Schema (MatrixOne)
-- 目标库: shaking_web (utf8mb4)
-- 设计基准: requirements/tech-spec.md §3.2
-- 与 tech-spec 的差异（因产品已扩展页面，按实际产品建模）:
--   * music / film_tv 扩展表 → 独立 music_works 表（音乐专区独立数据）
--   * 新增 variety_shows / stage_events / interviews 表（综艺/舞台/采访专区）
--   * 各表补充 gradient 占位渐变列（无真实素材时的视觉降级，后台可维护）
--   * qa_knowledge 暂用关键词匹配（vector_embedding 留待 MOI 语义检索接入）
-- ============================================

-- 1. 作品表（作品合集页：综艺/电视剧/电影/音乐/舞台）
CREATE TABLE IF NOT EXISTS works (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title           VARCHAR(255) NOT NULL COMMENT '作品名称',
    type            ENUM('综艺', '电视剧', '电影', '音乐', '舞台') NOT NULL COMMENT '作品大类',
    category        VARCHAR(50) COMMENT '细分分类（如选秀/单曲/EP）',
    release_date    VARCHAR(20) COMMENT '发布/播出日期（YYYY 或 YYYY-MM）',
    cover_image     VARCHAR(500) COMMENT '封面图片URL（OSS地址）',
    gradient        VARCHAR(255) COMMENT '封面占位渐变',
    description     TEXT COMMENT '作品简介',
    role            VARCHAR(100) COMMENT '谢可寅角色/身份',
    platform        VARCHAR(100) COMMENT '播出/发行平台',
    external_link   VARCHAR(500) COMMENT '外部跳转链接（正版平台）',
    status          ENUM('已播出', '即将上线', '热播中', '筹备中', '待官宣') NOT NULL DEFAULT '已播出',
    tags            JSON COMMENT '标签数组',
    sort_order      INT DEFAULT 0 COMMENT '排序权重',
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_release_date (release_date)
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '作品信息表';

-- 2. 成长时间线事件表
CREATE TABLE IF NOT EXISTS timeline_events (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_date      DATE NOT NULL COMMENT '事件日期',
    title           VARCHAR(255) NOT NULL COMMENT '事件标题',
    description     TEXT COMMENT '事件描述',
    category        ENUM('选秀', '出道', '影视', '音乐', '舞台', '获奖', '其他') NOT NULL,
    related_works   JSON COMMENT '关联作品ID数组',
    image           VARCHAR(500) COMMENT '配图URL',
    gradient        VARCHAR(255) COMMENT '占位渐变',
    importance      TINYINT DEFAULT 3 COMMENT '重要程度 1-5',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_category (category),
    INDEX idx_importance (importance)
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '成长时间线事件表';

-- 3. 相册图片表
CREATE TABLE IF NOT EXISTS photos (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    url             VARCHAR(500) NOT NULL DEFAULT '' COMMENT '原图URL（OSS）',
    thumbnail_url   VARCHAR(500) COMMENT '缩略图URL',
    webp_url        VARCHAR(500) COMMENT 'WebP格式URL',
    album           VARCHAR(50) NOT NULL COMMENT '相册分类（舞台照/写真/路透/饭拍）',
    title           VARCHAR(255) COMMENT '图片标题',
    description     TEXT COMMENT '图片描述',
    tags            JSON COMMENT '标签数组',
    taken_date      DATE COMMENT '拍摄日期',
    source          VARCHAR(100) COMMENT '图片来源/摄影师',
    gradient        VARCHAR(255) COMMENT '占位渐变（无图时）',
    file_size       INT COMMENT '文件大小（字节）',
    width           INT COMMENT '图片宽度',
    height          INT COMMENT '图片高度',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_album (album),
    INDEX idx_taken_date (taken_date)
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '相册图片表';

-- 4. 音乐作品表（音乐专区）
CREATE TABLE IF NOT EXISTS music_works (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title           VARCHAR(255) NOT NULL COMMENT '歌曲名',
    artist          VARCHAR(100) NOT NULL COMMENT '艺人（谢可寅/THE9/合作）',
    album           VARCHAR(100) COMMENT '所属专辑/EP',
    release_date    VARCHAR(20) COMMENT '发行日期（YYYY-MM-DD）',
    category        ENUM('原创单曲', '合作曲', 'EP', 'THE9时期', '舞台Live') NOT NULL,
    tags            JSON COMMENT '标签数组',
    gradient        VARCHAR(255) COMMENT '占位渐变',
    external_link   VARCHAR(500) COMMENT '音乐平台链接（QQ音乐/网易云）',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '音乐作品表';

-- 5. 综艺节目表（综艺专区）
CREATE TABLE IF NOT EXISTS variety_shows (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name            VARCHAR(255) NOT NULL COMMENT '节目名',
    year            VARCHAR(10) NOT NULL COMMENT '年份',
    platform        VARCHAR(100) COMMENT '播出平台',
    role            VARCHAR(100) COMMENT '谢可寅身份',
    category        ENUM('选秀', '真人秀', '音综', '晚会') NOT NULL,
    gradient        VARCHAR(255) COMMENT '占位渐变',
    external_link   VARCHAR(500) COMMENT '节目链接',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '综艺节目表';

-- 6. 舞台活动表（舞台专区）
CREATE TABLE IF NOT EXISTS stage_events (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_date      DATE NOT NULL COMMENT '活动日期',
    name            VARCHAR(255) NOT NULL COMMENT '活动名',
    location        VARCHAR(100) COMMENT '地点',
    performance     VARCHAR(500) COMMENT '表演内容',
    category        ENUM('晚会', '音乐节', '团体活动', '选秀历程', '颁奖典礼') NOT NULL,
    gradient        VARCHAR(255) COMMENT '占位渐变',
    photos          JSON COMMENT '现场图集URL数组',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date)
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '舞台活动表';

-- 7. 采访表（采访专区）
CREATE TABLE IF NOT EXISTS interviews (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title           VARCHAR(255) NOT NULL COMMENT '采访标题',
    media           VARCHAR(100) NOT NULL COMMENT '来源媒体',
    event_date      DATE NOT NULL COMMENT '发布日期',
    format          ENUM('视频专访', '文字专访', '杂志', '电台') NOT NULL,
    gradient        VARCHAR(255) COMMENT '占位渐变',
    external_link   VARCHAR(500) COMMENT '采访链接',
    quotes          JSON COMMENT '金句数组 [{text,source}]',
    sort_order      INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '采访表';

-- 8. 问答知识库表（聊天机器人本地 FAQ 兜底）
CREATE TABLE IF NOT EXISTS qa_knowledge (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    question        VARCHAR(500) COMMENT '标准问题（预留 MOI 语义检索）',
    keywords        JSON COMMENT '触发关键词数组',
    answer          TEXT NOT NULL COMMENT '答案',
    category        VARCHAR(50) COMMENT '分类',
    source          VARCHAR(100) COMMENT '来源',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '本地FAQ知识库';

-- 9. 网站配置表
CREATE TABLE IF NOT EXISTS site_configs (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    config_key      VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value    TEXT COMMENT '配置值（JSON字符串）',
    description     VARCHAR(255) COMMENT '配置说明',
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '网站运行时配置';

-- 10. 管理员账户表
CREATE TABLE IF NOT EXISTS admin_users (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username        VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL COMMENT 'bcrypt哈希',
    email           VARCHAR(100) UNIQUE,
    role            ENUM('super_admin', 'editor') DEFAULT 'editor',
    last_login      TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '后台管理员表';

-- 11. 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id         VARCHAR(36) COMMENT '操作人ID',
    action          VARCHAR(50) NOT NULL COMMENT '操作类型（create/update/delete/login）',
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
) ENGINE = MO_ENGINE DEFAULT CHARSET = utf8mb4 COMMENT = '操作审计日志';
