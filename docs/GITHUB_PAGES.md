# GitHub Pages 部署指南

本项目已配置为部署到 GitHub Pages。

## 部署配置

### 1. Next.js 静态导出配置

项目已配置为静态导出模式（`output: 'export'`），这是 GitHub Pages 部署的必要条件。

**配置文件**: [apps/web/next.config.js](../apps/web/next.config.js)

```javascript
output: 'export',
images: {
  unoptimized: true,
},
basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
```

### 2. GitHub Actions 工作流

**工作流文件**: [.github/workflows/deploy-github-pages.yml](../.github/workflows/deploy-github-pages.yml)

**触发条件**:
- Push 到 `main` 分支
- 手动触发（workflow_dispatch）

**部署步骤**:
1. 检出代码
2. 安装 pnpm 和 Node.js
3. 安装依赖
4. 构建静态文件（输出到 `apps/web/out`）
5. 上传到 GitHub Pages
6. 部署

### 3. 启用 GitHub Pages

在 GitHub 仓库中配置 Pages：

1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择: `GitHub Actions`
3. 保存配置

### 4. 配置 GitHub Secrets（可选）

如果使用 Supabase，需要配置环境变量：

进入 **Settings** → **Secrets and variables** → **Actions**，添加：

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 匿名密钥

### 5. 部署

提交代码到 `main` 分支即可自动触发部署：

```bash
git add .
git commit -m "feat: configure GitHub Pages deployment"
git push origin main
```

部署完成后，访问：
```
https://jsonma8-lang.github.io/ai-native-frontend/
```

## 本地测试静态导出

在推送前，可以本地测试静态导出：

```bash
# 构建静态文件
NEXT_PUBLIC_BASE_PATH=/ai-native-frontend pnpm build

# 查看输出文件
ls -la apps/web/out

# 使用 serve 预览（需要安装 serve）
npx serve apps/web/out
```

## 注意事项

### 1. 图片优化

GitHub Pages 不支持 Next.js 的图片优化功能，因此配置了 `images.unoptimized: true`。

### 2. API Routes

静态导出不支持 Next.js API Routes。如需后端功能，请使用：
- Supabase（已配置）
- 外部 API
- Serverless Functions（Vercel/Netlify）

### 3. 动态路由

使用 `generateStaticParams` 预生成所有动态路由页面：

```typescript
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ]
}
```

### 4. basePath

项目配置了 `basePath: /ai-native-frontend`，所有链接会自动添加此前缀。

如果使用自定义域名，可以移除 basePath：

```javascript
// next.config.js
basePath: '',
assetPrefix: '',
```

## 切换回 Vercel 部署

如需切换回 Vercel：

1. 恢复 [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)
2. 修改 `next.config.js`，移除 `output: 'export'`
3. 配置 Vercel Secrets
4. 推送代码

## 故障排查

### 构建失败

检查 GitHub Actions 日志：
- 仓库 → **Actions** → 选择失败的工作流

### 404 错误

确认：
1. GitHub Pages 已启用
2. Source 设置为 `GitHub Actions`
3. 部署成功完成

### 样式或资源加载失败

检查 `basePath` 配置是否正确：
- 仓库名: `ai-native-frontend`
- basePath: `/ai-native-frontend`

## 相关资源

- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
