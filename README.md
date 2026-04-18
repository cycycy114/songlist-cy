# VTuber Songboard

一个基于 `SvelteKit + Svelte 5 + TypeScript + Tailwind CSS v4 + Supabase` 的单主播歌单站 MVP，适合 VTuber / 直播场景下的歌曲展示、搜索筛选、愿望单收集和后台管理。

## 功能

- 公开歌单展示
- 按歌名、原唱、标签搜索
- 按语言、标签、状态筛选
- 愿望单提交
- 后台歌曲管理
- 后台愿望单状态管理
- 未配置 Supabase 时自动回退到内存 demo 数据

## 开发

```bash
npm install
npm run dev
```

## 环境变量

复制 `.env.example` 到 `.env` 后按需填写：

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `ENABLE_DEMO_AUTH`

未配置 Supabase 时，非生产环境会使用演示账号：

- 邮箱：`admin@example.com`
- 密码：`demo-admin`

生产环境必须配置 Supabase 鉴权；只有临时演示部署才应显式设置 `ENABLE_DEMO_AUTH=true`。

## Supabase

数据库初始化 SQL 位于：

`supabase/schema.sql`
