-- Nhà Xe Thanh Tuấn — SCHEMA THIẾT KẾ CHO PHASE 2 (Admin Dashboard)
--
-- ⚠️ CHƯA TRIỂN KHAI. Đây là bản thiết kế tham khảo, không phải migration
-- đang chạy. Không chạy file này lên Neon project Phase 1 (production) —
-- Phase 1 chỉ dùng docs/db/schema.sql (bảng `leads` tối giản).
--
-- Theo CLAUDE.md: xây dựng Admin Dashboard (routes/fleet_classes/blog_posts/
-- users/sessions/events bên dưới) cần một PRD Phase 2 riêng trước khi triển
-- khai thật. File này chỉ phục vụ mục đích thiết kế/tham khảo trước.
--
-- Đối chiếu với docs/PRD.md §7 (4 nhóm tính năng Phase 2):
--   1. Ghi nhận lead từ mọi form/click            -> leads, events
--   2. Thống kê/biểu đồ KPI theo thời gian         -> events, leads (status)
--   3. Quản lý nội dung (giá xe, dòng xe, blog)    -> routes, fleet_classes, blog_posts
--   4. Đăng nhập/phân quyền admin                  -> users, sessions

-- =============================================================
-- 1. users — tài khoản nhân viên/chủ nhà xe đăng nhập dashboard
-- =============================================================
create table if not exists users (
  id            bigint generated always as identity primary key,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'staff' check (role in ('admin', 'staff')),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- =============================================================
-- 2. sessions — phiên đăng nhập (session token, dễ revoke hơn JWT)
-- =============================================================
create table if not exists sessions (
  id         text primary key,              -- token ngẫu nhiên, sinh phía server
  user_id    bigint not null references users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_id_idx on sessions (user_id);

-- =============================================================
-- 3. leads — mở rộng từ bảng Phase 1 (docs/db/schema.sql), thêm luồng xử lý
-- =============================================================
create table if not exists leads (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  source_page   text,          -- trang gửi form, vd '/' hoặc '/lien-he'
  form_id       text,          -- id form trong QuoteForm.astro
  name          text,
  phone         text not null,
  service_type  text check (service_type in ('driver', 'self-drive')),
  from_location text,
  to_location   text,
  travel_at     text,          -- giữ dạng text thô từ input datetime-local (như Phase 1)
  note          text,
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  assigned_to   bigint references users (id),

  -- Cache kết quả geocode (Mapbox Geocoding API) của from_location/to_location,
  -- để hiển thị pin xác minh vị trí ở màn chi tiết lead (PRD-phase2 §4.2).
  -- Geocode theo yêu cầu (khi admin mở chi tiết lead lần đầu), lưu lại ở đây
  -- để không gọi lại API mỗi lần xem. NULL nghĩa là chưa geocode hoặc geocode
  -- thất bại (địa chỉ tự do, không chuẩn hóa nên không đảm bảo luôn ra kết quả).
  from_lat      double precision,
  from_lng      double precision,
  to_lat        double precision,
  to_lng        double precision,
  geocoded_at   timestamptz
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

-- =============================================================
-- 4. events — log thô cho CTA gọi/Zalo (form_submit đã nằm trong `leads`,
--    không duplicate ở đây). Đây là nơi trackEvent() trong
--    src/scripts/tracking.ts sẽ POST tới khi Phase 2 triển khai thật.
-- =============================================================
create table if not exists events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  event_type  text not null check (event_type in ('call', 'zalo')),
  source_page text,
  detail      jsonb          -- vd { "href": "tel:0909621297" }
);

create index if not exists events_type_created_at_idx on events (event_type, created_at desc);

-- =============================================================
-- 5. routes — bảng giá tuyến, thay cho hard-code src/data/routes.ts
--    (đổi giá/tuyến không cần sửa code + deploy lại)
-- =============================================================
create table if not exists routes (
  id             bigint generated always as identity primary key,
  name           text not null,             -- vd 'Vũng Tàu (Bà Rịa - Vũng Tàu)'
  distance_label text,                       -- vd '~120 km' (giữ dạng text hiển thị)
  price_4_min    bigint,                     -- đơn vị: VNĐ
  price_4_max    bigint,
  price_7_min    bigint,
  price_7_max    bigint,
  price_16_min   bigint,
  price_16_max   bigint,
  sort_order     integer not null default 0,
  is_published   boolean not null default true,
  updated_at     timestamptz not null default now(),
  updated_by     bigint references users (id)
);

create index if not exists routes_sort_order_idx on routes (sort_order);

-- =============================================================
-- 6. fleet_classes — dòng xe (4/7/16 chỗ), thay cho fleetClasses trong
--    src/data/routes.ts
--    Ảnh xe (quyết định 2026-09-11): lưu dạng static asset trong source
--    code (KHÔNG upload runtime, KHÔNG lưu file nhị phân trong DB).
--    photo_asset_path chỉ lưu đường dẫn tới file đã commit sẵn trong repo,
--    vd '/images/fleet/4-cho.jpg'. Đổi ảnh = dev commit file mới + deploy.
-- =============================================================
create table if not exists fleet_classes (
  id                bigint generated always as identity primary key,
  seats_label       text not null,   -- vd '4 Chỗ'
  note              text,
  photo_asset_path  text,            -- đường dẫn asset tĩnh, vd '/images/fleet/4-cho.jpg'
  sort_order        integer not null default 0,
  updated_at        timestamptz not null default now(),
  updated_by        bigint references users (id)
);

create index if not exists fleet_classes_sort_order_idx on fleet_classes (sort_order);

-- =============================================================
-- 7. blog_posts — bài Cẩm nang, thay PendingNote hiện tại ở /cam-nang
-- =============================================================
create table if not exists blog_posts (
  id            bigint generated always as identity primary key,
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  content       text,          -- markdown hoặc rich text, tùy editor chọn sau
  cover_image_url text,        -- đường dẫn asset tĩnh trong repo, cùng quy ước với fleet_classes.photo_asset_path
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  author_id     bigint references users (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index if not exists blog_posts_slug_idx on blog_posts (slug);
create index if not exists blog_posts_status_published_idx on blog_posts (status, published_at desc);
