# AI-Native 电商平台

基于 AI-Native 技术栈构建的现代电商平台，使用 Monorepo 架构。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **数据层**: Supabase (PostgreSQL + Auth + Realtime)
- **Monorepo**: Turborepo + pnpm workspace
- **部署**: GitHub Pages

## 项目结构

```
ai-native-frontend/
├── apps/
│   └── web/              # Next.js 主应用
├── packages/
│   ├── ui/               # 共享 UI 组件库
│   ├── config/           # 共享配置
│   └── types/            # 共享类型定义
├── turbo.json            # Turborepo 配置
├── pnpm-workspace.yaml   # pnpm workspace 配置
├── AGENTS.md             # AI 开发指南
└── .cursorrules          # Cursor AI 规则
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

在 `apps/web/.env.local` 中添加:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 开发命令

```bash
# 启动所有应用的开发服务器
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 清理构建产物
pnpm clean
```

## Monorepo 架构

### 为什么使用 Monorepo？

1. **代码共享更简单**: 直接引用，无需发布 npm 包
2. **原子性修改**: 一次 commit 可以修改多个包
3. **统一工具链**: 共享配置和依赖
4. **对 AI 友好**: AI 可以看到完整的上下文

### 包说明

- **apps/web**: 主应用，包含所有页面和业务逻辑
- **packages/ui**: 可复用的 UI 组件库
- **packages/config**: 共享配置和常量
- **packages/types**: 共享 TypeScript 类型定义

## Supabase 配置

### 数据库表

```sql
-- 产品表
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 用户收藏表
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references products not null,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);
```

### RLS 策略

```sql
-- 启用 RLS
alter table products enable row level security;
alter table favorites enable row level security;

-- 产品表策略
create policy "Products are viewable by everyone"
  on products for select using (true);

-- 收藏表策略
create policy "Users can view their own favorites"
  on favorites for select using (auth.uid() = user_id);

create policy "Users can manage their own favorites"
  on favorites for all using (auth.uid() = user_id);
```

## 功能特性

- ✅ Monorepo 架构（Turborepo + pnpm）
- ✅ Next.js 14 App Router
- ✅ shadcn/ui 组件库
- ✅ Tailwind CSS v4
- ⏳ Supabase 认证
- ⏳ 产品展示页面
- ⏳ 实时协作功能
- ✅ GitHub Pages 部署

## AI 辅助开发

本项目针对 AI 辅助开发进行了优化:

- **AGENTS.md**: 包含项目架构和开发规范
- **.cursorrules**: Cursor AI 的代码生成规则
- **功能切片**: 相关代码聚合在一起
- **清晰的模块边界**: 便于 AI 理解上下文

### 使用 Cursor 开发

1. 打开项目后，Cursor 会自动加载 `.cursorrules`
2. 参考 `AGENTS.md` 了解项目结构
3. 使用自然语言描述需求，AI 会生成符合规范的代码

## 部署

### GitHub Pages 部署

项目使用 GitHub Pages 部署静态站点。

#### 自动部署

推送到 `main` 分支会自动触发 GitHub Pages 部署。

#### 配置步骤

1. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 `GitHub Actions`

2. **配置 GitHub Secrets**

在 GitHub 仓库设置中添加以下 Secrets：

```bash
# Supabase 环境变量
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **访问部署的站点**

部署完成后，访问：
```
https://jsonma8-lang.github.io/ai-native-frontend/
```

### GitHub Actions CI/CD

项目已配置自动化 CI/CD 流程：

#### 工作流说明

1. **CI 检查** (`.github/workflows/ci.yml`)
   - 触发时机：Push 到 main/develop 分支或 PR
   - 执行内容：代码检查、类型检查、测试

2. **GitHub Pages 部署** (`.github/workflows/deploy-github-pages.yml`)
   - 触发时机：Push 到 main 分支
   - 执行内容：构建静态站点并部署到 GitHub Pages

详细配置请查看 [CI/CD 文档](docs/CICD.md)

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT
