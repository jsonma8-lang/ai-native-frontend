# Supabase 数据库设置

## 步骤 1：创建数据库表

1. 打开 Supabase Dashboard: https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query**
5. 复制粘贴以下 SQL 并点击 **Run**

```sql
-- 创建产品表
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 启用 Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取产品（公开访问）
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- 只允许认证用户创建产品
CREATE POLICY "Allow authenticated users to insert" ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 只允许认证用户更新产品
CREATE POLICY "Allow authenticated users to update" ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 插入示例数据
INSERT INTO products (name, description, price, image_url) VALUES
  ('MacBook Pro', '16-inch, M3 Max chip', 3999.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
  ('iPhone 15 Pro', 'Titanium design, A17 Pro chip', 1199.00, 'https://images.unsplash.com/photo-1592286927505-c0d6c9c24e5c?w=400'),
  ('AirPods Pro', 'Active Noise Cancellation', 249.00, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400'),
  ('iPad Air', '11-inch, M2 chip', 799.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400');
```

## 步骤 2：启用 Realtime

**方法 1：通过 SQL 启用（推荐，更简单）**

在 SQL Editor 中执行：
```sql
-- 为 products 表启用 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;
```

**方法 2：通过界面启用**

如果找不到 Replication 选项，说明你的 Supabase 版本可能不同。使用方法 1 的 SQL 命令即可。

旧版界面路径：
1. Database → Tables → products 表
2. 点击表名进入详情
3. 找到 "Enable Realtime" 开关

## 步骤 3：配置认证 Redirect URLs

1. 点击左侧菜单的 **Authentication**
2. 点击 **URL Configuration**
3. 在 **Redirect URLs** 中添加：
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback` (部署后添加)

## 步骤 4：启用 Email 认证

1. 在 **Authentication** > **Providers** 中
2. 确保 **Email** provider 已启用
3. 可选：配置 Google/GitHub OAuth

## 验证设置

完成后，访问 http://localhost:3000/products 应该能看到产品列表。

尝试在 Supabase SQL Editor 中运行：
```sql
UPDATE products SET price = 999.00 WHERE name = 'iPhone 15 Pro';
```

页面应该会实时更新价格！
