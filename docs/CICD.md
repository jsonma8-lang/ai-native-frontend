# GitHub Actions CI/CD 配置说明

本项目使用 GitHub Actions 实现自动化 CI/CD 流程。

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

### 2. 生产部署 (`deploy.yml`)

**触发条件：**
- Push 到 `main` 分支

**执行步骤：**
1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到 Vercel 生产环境

### 3. 预览部署 (`preview.yml`)

**触发条件：**
- 创建 PR 到 `main` 分支

**执行步骤：**
1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到 Vercel 预览环境
5. 在 PR 中评论预览链接

## 配置步骤

### 1. 获取 Vercel 配置信息

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 关联项目（在项目根目录执行）
vercel link

# 查看项目配置
cat .vercel/project.json
```

输出示例：
```json
{
  "orgId": "team_xxxxx",
  "projectId": "prj_xxxxx"
}
```

### 2. 获取 Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 输入 Token 名称（如：github-actions）
4. 选择 Scope（建议选择特定项目）
5. 复制生成的 Token

### 3. 配置 GitHub Secrets

在 GitHub 仓库中配置 Secrets：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下 Secrets：

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel API Token | 从 Vercel 账户设置获取 |
| `VERCEL_ORG_ID` | Vercel 组织 ID | 从 `.vercel/project.json` 获取 |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | 从 `.vercel/project.json` 获取 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 从 Supabase 项目设置获取 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 从 Supabase 项目设置获取 |

### 4. 验证配置

1. 提交代码到 `main` 分支，触发生产部署
2. 创建 PR 到 `main` 分支，触发预览部署
3. 在 GitHub Actions 页面查看工作流执行状态

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
# - 自动部署预览环境
# - PR 中会显示预览链接

# 4. Code Review 通过后合并到 main
# - 自动触发生产部署
# - 部署到 Vercel 生产环境
```

### 分支策略

- `main`: 生产分支，自动部署到生产环境
- `develop`: 开发分支（可选）
- `feature/*`: 功能分支
- `fix/*`: 修复分支

## 故障排查

### 构建失败

1. 检查 GitHub Actions 日志
2. 确认所有 Secrets 已正确配置
3. 本地运行 `pnpm build` 验证构建

### 部署失败

1. 检查 Vercel Token 是否有效
2. 确认 `VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID` 正确
3. 检查 Vercel 项目配置

### 环境变量问题

1. 确认所有必需的环境变量已在 GitHub Secrets 中配置
2. 检查环境变量名称是否正确（区分大小写）
3. 验证 Supabase 配置是否有效

## 优化建议

### 1. 添加缓存

工作流已配置 pnpm 缓存，加速依赖安装。

### 2. 并行执行

可以将 lint、test、build 拆分为并行任务：

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    steps: [...]
  
  build:
    runs-on: ubuntu-latest
    steps: [...]
```

### 3. 条件部署

可以添加条件判断，只在特定情况下部署：

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

## 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [pnpm Action](https://github.com/pnpm/action-setup)
