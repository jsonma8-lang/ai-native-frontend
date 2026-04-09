# Supabase 配置完整指南

## 📋 第一步：创建 Supabase 项目

### 1.1 注册/登录 Supabase

1. 访问 https://supabase.com
2. 点击右上角 "Start your project"
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 1.2 创建新项目

1. 登录后，点击 "New Project"
2. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Name**: `ai-native-ecommerce`（或你喜欢的名字）
   - **Database Password**: 设置一个强密码（保存好！）
   - **Region**: 选择 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`（离中国近）
   - **Pricing Plan**: 选择 `Free` (免费版足够开发使用)

3. 点击 "Create new project"
4. 等待 2-3 分钟，项目创建中...

---

## 📋 第二步：获取 API 凭证

### 2.1 找到 API 设置

1. 项目创建完成后，进入项目
2. 点击左侧菜单 **Settings** (齿轮图标)
3. 点击 **API**

### 2.2 复制凭证

你会看到两个重要的值：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...（很长的字符串）
```

### 2.3 更新本地环境变量

1. 打开文件：`apps/web/.env.local`
2. 替换为你的真实凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.你的完整key
```

3. 保存文件

---

## 📋 第三步：创建数据库表

### 3.1 打开 SQL Editor

1. 在 Supabase Dashboard 左侧菜单
2. 点击 **SQL Editor**
3. 点击 **New query**

### 3.2 执行以下 SQL（复制全部）

```sql
-- ============================================
-- 创建产品表
-- ============================================
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  stock integer default 0,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 创建用户收藏表
-- ============================================
create table favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references products not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- ============================================
-- 启用 Row Level Security (RLS)
-- ============================================
alter table products enable row level security;
alter table favorites enable row level security;

-- ============================================
-- 产品表 RLS 策略
-- ============================================

-- 所有人可以查看产品
create policy "Products are viewable by everyone"
  on products for select
  using (true);

-- 只有认证用户可以插入产品（可选，根据需求调整）
create policy "Authenticated users can insert products"
  on products for insert
  with check (auth.role() = 'authenticated');

-- 只有认证用户可以更新产品（可选）
create policy "Authenticated users can update products"
  on products for update
  using (auth.role() = 'authenticated');

-- ============================================
-- 收藏表 RLS 策略
-- ============================================

-- 用户只能查看自己的收藏
create policy "Users can view their own favorites"
  on favorites for select
  using (auth.uid() = user_id);

-- 用户可以添加自己的收藏
create policy "Users can insert their own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

-- 用户可以删除自己的收藏
create policy "Users can delete their own favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- ============================================
-- 创建更新时间触发器
-- ============================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

-- ============================================
-- 插入示例产品数据
-- ============================================
insert into products (name, description, price, image_url, stock, category) values
  ('MacBook Pro 16"', '强大的专业笔记本电脑，配备 M3 Max 芯片', 19999.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 10, '电脑'),
  ('iPhone 15 Pro', '最新款智能手机，钛金属设计', 7999.00, 'https://images.unsplash.com/photo-1592286927505-c0d5e9d6e87c?w=800', 25, '手机'),
  ('AirPods Pro', '主动降噪无线耳机，空间音频', 1999.00, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', 50, '配件'),
  ('iPad Air', '轻薄便携的平板电脑，M2 芯片', 4799.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', 15, '平板'),
  ('Apple Watch Series 9', '健康和健身的终极设备', 2999.00, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', 30, '手表'),
  ('Magic Keyboard', '无线键盘，触控 ID', 999.00, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 40, '配件'),
  ('Magic Mouse', '多点触控无线鼠标', 699.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', 45, '配件'),
  ('HomePod mini', '智能音箱，空间音频', 749.00, 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800', 20, '音频');
```

3. 点击右下角 **Run** 按钮
4. 看到 "Success. No rows returned" 表示成功！

---

## 📋 第四步：启用 Realtime（实时功能）

### 4.1 启用表的 Realtime

1. 在左侧菜单点击 **Database**
2. 点击 **Replication**
3. 找到 `products` 表，点击右侧开关启用
4. 找到 `favorites` 表，点击右侧开关启用

现在你的表支持实时订阅了！

---

## 📋 第五步：配置认证（可选但推荐）

### 5.1 配置邮箱认证

1. 左侧菜单点击 **Authentication**
2. 点击 **Providers**
3. 确保 **Email** 已启用（默认启用）

### 5.2 配置 URL（重要！）

1. 点击 **URL Configuration**
2. 设置：
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: 添加 `http://localhost:3000/auth/callback`

3. 点击 **Save**

### 5.3 配置社交登录（可选）

如果想支持 Google/GitHub 登录：

1. 在 **Providers** 中启用 Google 或 GitHub
2. 按照提示配置 OAuth 应用
3. 填入 Client ID 和 Secret

---

## 📋 第六步：验证配置

### 6.1 重启开发服务器

```bash
# 在终端中按 Ctrl+C 停止服务器
# 然后重新启动
pnpm dev
```

### 6.2 测试功能

1. **访问首页**: http://localhost:3000
   - 应该正常显示

2. **测试注册**:
   - 访问 http://localhost:3000/auth/login
   - 输入邮箱和密码
   - 点击"注册新账号"
   - 检查邮箱确认邮件

3. **测试产品列表**:
   - 访问 http://localhost:3000/products
   - 应该看到 8 个示例产品

4. **测试实时更新**:
   - 打开两个浏览器窗口，都访问产品列表
   - 在 Supabase Dashboard 的 Table Editor 中修改产品
   - 两个窗口应该同时更新！

---

## 🎉 完成！

你的 Supabase 已经完全配置好了！

### ✅ 已启用的功能

- ✅ 用户认证（邮箱注册/登录）
- ✅ 产品数据库
- ✅ 用户收藏功能
- ✅ 实时数据同步
- ✅ Row Level Security（数据安全）
- ✅ 8 个示例产品

### 🔧 常见问题

**Q: 注册后没收到确认邮件？**
A: 检查垃圾邮件，或在 Supabase Dashboard > Authentication > Users 中手动确认用户

**Q: 产品列表显示空白？**
A: 检查浏览器控制台错误，确认环境变量正确

**Q: 实时更新不工作？**
A: 确认在 Database > Replication 中启用了表的 Realtime

**Q: 如何查看数据库数据？**
A: Supabase Dashboard > Table Editor > 选择表

---

## 📚 下一步

现在你可以：
1. 添加更多产品数据
2. 实现购物车功能
3. 添加订单管理
4. 集成支付系统
5. 部署到 Vercel

参考 `QUICKSTART.md` 了解更多开发建议！
