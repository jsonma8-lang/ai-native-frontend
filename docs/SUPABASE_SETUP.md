# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写项目信息并创建

## 2. 获取 API 密钥

在项目设置中找到:
- Project URL: `https://xxxxx.supabase.co`
- Anon/Public Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

将这些信息添加到 `apps/web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 创建数据库表

在 Supabase SQL Editor 中执行以下 SQL:

```sql
-- 创建产品表
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 创建用户收藏表
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

-- 产品表 RLS 策略（所有人可查看）
create policy "Products are viewable by everyone"
  on products for select
  using (true);

-- 收藏表 RLS 策略（用户只能查看自己的收藏）
create policy "Users can view their own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- 创建更新时间触发器
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
```

## 4. 插入示例数据

```sql
insert into products (name, description, price, image_url) values
  ('MacBook Pro 16"', '强大的专业笔记本电脑', 19999.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'),
  ('iPhone 15 Pro', '最新款智能手机', 7999.00, 'https://images.unsplash.com/photo-1592286927505-c0d5e9d6e87c'),
  ('AirPods Pro', '主动降噪无线耳机', 1999.00, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7'),
  ('iPad Air', '轻薄便携的平板电脑', 4799.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'),
  ('Apple Watch', '智能手表', 2999.00, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a');
```

## 5. 配置认证

在 Supabase Dashboard > Authentication > Providers 中启用:
- Email (默认已启用)
- Google (可选)
- GitHub (可选)

## 6. 启用 Realtime

在 Supabase Dashboard > Database > Replication 中:
1. 找到 `products` 和 `favorites` 表
2. 启用 Realtime

## 7. 测试连接

运行项目后访问 http://localhost:3000，检查是否能正常连接 Supabase。
