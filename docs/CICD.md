# GitHub Actions CI/CD 配置说明

本项目使用 GitHub Actions 实现自动化 CI/CD 流程，部署到 GitHub Pages。

## 工作流文件

### 1. CI 检查 (`ci.yml`)

**触发条件：**
- Push 到 `main` 或 `develop` 分支
- 创建 PR 到 `main` 或 `develop` 分支

**执行步骤：**
1. 检出代码
2. 安装 pnpm 和 Node.js
3. 安装依赖
4. 运行 lint 检查
5. 执行类型检查（通过 build）
6. 运行测试

### 2. GitHub Pages 部署 (`deploy-github-pages.yml`)

**触发条件：**
- Push 到 `main` 分支
- 手动触发（workflow_dispatch）

**执行步骤：**
1. 检出代码
2. 安装依赖
3. 构建静态站点（Next.js static export）
4. 上传构建产物到 GitHub Pages
5. 部署到 GitHub Pages

**注意事项：**
- 项目使用 Next.js 静态导出模式（`output: 'export'`）
- 动态路由通过 `generateStaticParams` 预生成
- 所有产品页面在构建时从 Supabase 获取并生成静态 HTML

## 配置步骤

### 1. 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 `GitHub Actions`
3. 保存设置

### 2. 配置 GitHub Secrets

在 GitHub 仓库中配置 Secrets：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下 Secrets：

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 从 Supabase 项目设置获取 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 从 Supabase 项目设置获取 |

### 3. 验证配置

1. 提交代码到 `main` 分支，触发部署
2. 在 GitHub Actions 页面查看工作流执行状态
3. 部署完成后访问：`https://jsonma8-lang.github.io/ai-native-frontend/`

## 工作流程

### 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交代码
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. 创建 PR 到 main 分支
# - 自动触发 CI 检查

# 4. Code Review 通过后合并到 main
# - 自动触发 GitHub Pages 部署
```

### 分支策略

- `main`: 生产分支，自动部署到 GitHub Pages
- `develop`: 开发分支（可选）
- `feature/*`: 功能分支
- `fix/*`: 修复分支

## 故障排查

### 构建失败

1. 检查 GitHub Actions 日志
2. 确认所有 Secrets 已正确配置
3. 本地运行 `pnpm build` 验证构建
4. 检查是否有动态路由未配置 `generateStaticParams`

### 部署失败

1. 确认 GitHub Pages 已启用且 Source 设置为 `GitHub Actions`
2. 检查构建产物是否正确生成在 `apps/web/out` 目录
3. 查看 GitHub Actions 日志中的详细错误信息

### 环境变量问题

1. 确认所有必需的环境变量已在 GitHub Secrets 中配置
2. 检查环境变量名称是否正确（区分大小写）
3. 验证 Supabase 配置是否有效
4. 注意：构建时需要访问 Supabase 来生成静态页面

### 页面 404 错误

1. 检查 `next.config.js` 中的 `basePath` 配置是否正确
2. 确认 `.nojekyll` 文件已生成在 `out` 目录
3. 验证路由路径是否包含正确的 basePath 前缀

## 技术说明

### 静态导出限制

GitHub Pages 只支持静态站点，因此项目使用 Next.js 的静态导出功能：

- ✅ 支持：静态页面、预生成的动态路由、客户端数据获取
- ❌ 不支持：服务器端渲染（SSR）、API Routes、动态 ISR

### 动态路由处理

产品详情页 `/products/[id]` 通过以下方式实现静态生成：

```typescript
export async function generateStaticParams() {
  // 构建时从 Supabase 获取所有产品 ID
  const { data: products } = await supabase.from('products').select('id')
  return products.map((product) => ({ id: product.id }))
}
```

### basePath 配置

由于部署在 `https://jsonma8-lang.github.io/ai-native-frontend/`，需要配置 basePath：

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/ai-native-frontend' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ai-native-frontend/' : '',
}
```

## 优化建议

### 1. 添加缓存

工作流已配置 pnpm 缓存，加速依赖安装。

### 2. 增量构建

可以配置只在相关文件变更时触发构建：

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'apps/**'
      - 'packages/**'
      - 'pnpm-lock.yaml'
```

### 3. 构建优化

- 使用 Turborepo 缓存加速构建
- 优化图片和静态资源
- 启用 Next.js 的增量静态生成

## 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [pnpm Action](https://github.com/pnpm/action-setup)
