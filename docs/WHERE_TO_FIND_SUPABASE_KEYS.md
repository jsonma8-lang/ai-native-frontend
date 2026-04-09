# 🔑 如何找到 Supabase API 凭证

## 方法一：通过 Dashboard 查找（推荐）

### 第 1 步：登录 Supabase
1. 打开浏览器访问：https://supabase.com
2. 点击右上角 "Sign in"
3. 使用 GitHub 账号登录（或邮箱登录）

### 第 2 步：选择你的项目
1. 登录后会看到项目列表
2. 点击你刚创建的项目（例如：`ai-native-ecommerce`）

### 第 3 步：进入 API 设置页面
1. 在左侧菜单栏找到 **⚙️ Settings**（齿轮图标）
2. 点击 Settings
3. 在 Settings 子菜单中点击 **API**

### 第 4 步：复制凭证

你会看到一个页面，包含以下信息：

```
┌─────────────────────────────────────────────────────────┐
│  Project API keys                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Project URL                                             │
│  https://abcdefghijklmn.supabase.co                     │
│  [📋 Copy]                                               │
│                                                          │
│  anon public                                             │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX... │
│  [📋 Copy] [👁️ Reveal]                                   │
│                                                          │
│  service_role secret                                     │
│  (不要使用这个！这是服务端密钥)                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 第 5 步：复制到 .env.local

**复制 Project URL：**
1. 点击 "Project URL" 右侧的 📋 Copy 按钮
2. 粘贴到 `.env.local` 文件中

**复制 anon public key：**
1. 点击 "anon public" 右侧的 📋 Copy 按钮
2. 粘贴到 `.env.local` 文件中

### 最终的 .env.local 文件应该是这样：

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 方法二：通过项目首页查找

### 更快的方式：

1. 登录 Supabase
2. 点击你的项目
3. 在项目首页（Home）就能看到 "Connect to your project" 部分
4. 点击 "API Settings" 链接
5. 直接跳转到 API 设置页面

---

## 🎯 关键位置总结

```
Supabase Dashboard
  └── 选择项目
      └── Settings (左侧菜单)
          └── API
              ├── Project URL ← 复制这个
              └── anon public ← 复制这个
```

---

## ⚠️ 重要提示

### ✅ 要复制的（安全）：
- **Project URL**: 以 `https://` 开头，以 `.supabase.co` 结尾
- **anon public**: 以 `eyJ` 开头的长字符串（约 200+ 字符）

### ❌ 不要复制的（危险）：
- **service_role secret**: 这是服务端密钥，不要在前端使用！
- **JWT Secret**: 这是签名密钥，永远不要泄露！

---

## 🔍 如何验证凭证是否正确

### 检查 Project URL：
```
✅ 正确格式：https://abcdefghijklmn.supabase.co
❌ 错误格式：https://placeholder.supabase.co
❌ 错误格式：https://你的项目.supabase.co
```

### 检查 anon public key：
```
✅ 正确格式：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...（很长）
❌ 错误格式：eyJhbGci...你的完整key
❌ 错误格式：eyJhbGci...placeholder
```

---

## 📝 完整操作步骤

1. **打开浏览器**
   ```
   https://supabase.com
   ```

2. **登录并选择项目**

3. **导航到 API 设置**
   ```
   Settings → API
   ```

4. **复制 Project URL**
   - 点击 Copy 按钮
   - 粘贴到 `.env.local` 的第一行

5. **复制 anon public key**
   - 点击 Copy 按钮
   - 粘贴到 `.env.local` 的第二行

6. **保存文件**
   - 按 Cmd+S (Mac) 或 Ctrl+S (Windows)

7. **重启开发服务器**
   ```bash
   # 按 Ctrl+C 停止
   pnpm dev
   ```

8. **测试**
   ```
   访问 http://localhost:3000/products
   ```

---

## 🆘 还是找不到？

### 如果你还没有创建项目：

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 点击 "New Project"
4. 填写项目信息并创建
5. 等待 2-3 分钟
6. 然后按照上面的步骤查找凭证

### 如果你已经创建了项目但找不到：

1. 确认你已经登录
2. 在 Dashboard 首页应该能看到项目列表
3. 点击项目名称进入
4. 左侧菜单 → Settings → API

---

## 📸 关键界面截图说明

你应该看到的界面：

```
┌─────────────────────────────────────────────────────────┐
│  Supabase Dashboard                                      │
├─────────────────────────────────────────────────────────┤
│  左侧菜单：                                               │
│    🏠 Home                                               │
│    📊 Table Editor                                       │
│    🔐 Authentication                                     │
│    📦 Storage                                            │
│    ⚙️ Settings  ← 点击这里                               │
│       ├── General                                        │
│       ├── Database                                       │
│       ├── API  ← 再点击这里                              │
│       └── ...                                            │
└─────────────────────────────────────────────────────────┘
```

现在你知道在哪里找了！去 Supabase Dashboard 复制你的凭证吧！🚀
