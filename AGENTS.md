# AI-Native 电商平台开发指南

## 项目概述
这是一个基于 AI-Native 技术栈构建的现代电商平台，使用 Monorepo 架构。

## 技术栈
- **框架**: Next.js 14 (App Router)
- **UI**: shadcn/ui + Radix UI + Tailwind CSS v4
- **数据层**: Supabase (PostgreSQL + Auth + Realtime)
- **Monorepo**: Turborepo + pnpm workspace
- **部署**: Vercel

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
└── package.json          # 根 package.json
```

## 开发规范

### 代码组织
1. **功能切片（Feature Slicing）**: 按业务功能组织代码，而非技术层次
2. **Monorepo 包划分**:
   - `apps/web`: 主应用，包含页面和业务逻辑
   - `packages/ui`: 纯 UI 组件，无业务逻辑
   - `packages/config`: 共享配置和常量

### 命名约定
- **组件**: PascalCase (例: `ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (例: `useAuth.ts`)
- **工具函数**: camelCase (例: `formatPrice.ts`)
- **类型**: PascalCase with `Type` suffix (例: `ProductType`)

### 组件开发
- 使用 shadcn/ui 组件作为基础
- 所有组件必须支持 TypeScript
- 使用 Tailwind CSS 进行样式开发
- 组件应该是可复用和可组合的

### 数据库设计
- 使用 Supabase PostgreSQL
- 表命名使用 snake_case
- 启用 Row Level Security (RLS)
- 使用 Supabase Auth 进行用户认证

### 实时功能
- 使用 Supabase Realtime 进行实时数据同步
- 订阅相关表的变化
- 处理连接状态和错误

## AI 辅助开发指南

### 使用 Cursor/Claude 时的最佳实践
1. **明确上下文**: 告诉 AI 你在哪个包/功能模块工作
2. **引用现有代码**: 让 AI 参考已有的组件和模式
3. **增量开发**: 一次只实现一个功能，逐步迭代
4. **代码审查**: AI 生成的代码需要人工审查

### 常见任务提示词
- "在 packages/ui 中创建一个新的 ProductCard 组件"
- "为 apps/web 添加用户认证页面，使用 Supabase Auth"
- "实现产品列表的实时更新功能"
- "添加 Supabase RLS 策略以保护用户数据"

## 开发流程

### 1. 本地开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test
```

### 2. 添加新功能
1. 在 `apps/web/src/app` 中创建新页面
2. 在 `packages/ui` 中创建可复用组件
3. 在 Supabase 中设计数据表
4. 实现 API 路由和数据获取逻辑
5. 添加实时订阅（如需要）

### 3. 环境变量
在 `apps/web/.env.local` 中配置:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase 配置

### 数据库表结构
```sql
-- 产品表
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 用户收藏表
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references products not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- 启用 RLS
alter table products enable row level security;
alter table favorites enable row level security;

-- RLS 策略
create policy "Products are viewable by everyone"
  on products for select
  using (true);

create policy "Users can view their own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);
```

## 部署

### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量
3. 配置构建命令: `cd apps/web && pnpm build`
4. 配置输出目录: `apps/web/.next`

## 注意事项
- 始终使用 TypeScript
- 遵循 ESLint 和 Prettier 规则
- 提交前运行 `pnpm lint` 和 `pnpm build`
- 使用 workspace 协议引用内部包: `"@myapp/ui": "workspace:*"`
- 不要在 packages 中引入业务逻辑
