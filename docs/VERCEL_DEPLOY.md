# Vercel 部署指南

## 1. 准备工作

确保你已经:
- 创建了 Supabase 项目
- 获取了 Supabase URL 和 Anon Key
- 代码已推送到 GitHub

## 2. 连接 Vercel

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 选择 `ai-native-frontend` 仓库

## 3. 配置构建设置

Vercel 会自动检测到 `vercel.json` 配置，但你也可以手动设置:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (保持默认)
- **Build Command**: `cd apps/web && pnpm build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install`

## 4. 配置环境变量

在 Vercel 项目设置中添加环境变量:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. 部署

点击 "Deploy" 按钮，Vercel 会自动:
1. 安装依赖（使用 pnpm）
2. 构建项目（使用 Turborepo）
3. 部署到全球 CDN

## 6. 配置自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 7. 自动部署

Vercel 会自动监听 GitHub 仓库的变化:
- Push 到 `main` 分支 → 生产环境部署
- Push 到其他分支 → 预览环境部署
- Pull Request → 自动创建预览链接

## 8. 性能优化

Vercel 自动提供:
- ✅ 全球 CDN
- ✅ 自动 HTTPS
- ✅ 图片优化
- ✅ 边缘函数
- ✅ 分析和监控

## 9. Supabase 回调 URL 配置

在 Supabase Dashboard > Authentication > URL Configuration 中添加:

```
Site URL: https://your-domain.vercel.app
Redirect URLs: https://your-domain.vercel.app/auth/callback
```

## 10. 验证部署

访问你的 Vercel 域名，测试:
- ✅ 首页加载
- ✅ 用户登录/注册
- ✅ 产品列表显示
- ✅ 实时更新功能

## 常见问题

### Q: 构建失败怎么办？
A: 检查 Vercel 构建日志，确保:
- pnpm 版本正确
- 环境变量已设置
- 所有依赖都已安装

### Q: 如何查看构建日志？
A: 在 Vercel Dashboard > Deployments > 点击具体部署 > 查看 Build Logs

### Q: 如何回滚到之前的版本？
A: 在 Vercel Dashboard > Deployments > 找到之前的部署 > 点击 "Promote to Production"
