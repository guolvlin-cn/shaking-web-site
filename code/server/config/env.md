# 后端环境变量（模板）

复制本表到 `code/.env`（该文件已被 `.gitignore` 忽略，不入库）后按环境填写。
读取逻辑见 `server/config/env.ts`，所有变量均有开发期默认值。

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NODE_ENV` | `development` | `development` / `test` / `production` |
| `PORT` | `3000` | API 服务端口 |
| `CORS_ORIGIN` | `http://localhost:5173` | 允许的前端来源；`*` 表示全部 |
| `DB_HOST` | `127.0.0.1` | MatrixOne 地址（MySQL 协议兼容） |
| `DB_PORT` | `6001` | MatrixOne 端口 |
| `DB_USER` | `root` | 数据库用户 |
| `DB_PASSWORD` | 空 | 数据库口令（用户提供连接串后填写） |
| `DB_NAME` | `shaking_web` | 数据库名 |
| `JWT_SECRET` | dev 默认值 | 管理端签名密钥，生产必须替换为强随机值（`openssl rand -hex 32`） |
| `JWT_EXPIRES_IN` | `12h` | 登录态有效期 |
| `ADMIN_INITIAL_USERNAME` | `admin` | 首次 seed 创建的初始管理员用户名 |
| `ADMIN_INITIAL_PASSWORD` | dev 默认值 | 初始管理员口令，生产必须修改 |
| `OSS_ENDPOINT` | 空 | 阿里云 OSS Endpoint（可选，配置后启用图片上传） |
| `OSS_BUCKET` | 空 | OSS Bucket 名 |
| `OSS_ACCESS_KEY_ID` | 空 | OSS AccessKeyId |
| `OSS_ACCESS_KEY_SECRET` | 空 | OSS AccessKeySecret |
