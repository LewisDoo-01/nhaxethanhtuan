-- Nhà Xe Thanh Tuấn — bảng ghi nhận lead từ form "Nhận báo giá"
-- Chạy 1 lần trong Neon SQL editor (hoặc `psql "$DATABASE_URL" -f docs/db/schema.sql`)
-- trước khi dùng API route src/pages/api/leads.ts.

create table if not exists leads (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  source_page   text,          -- trang gửi form, vd '/' hoặc '/lien-he'
  form_id       text,          -- id form trong QuoteForm.astro
  name          text,
  phone         text not null,
  service_type  text,          -- 'driver' | 'self-drive'
  from_location text,
  to_location   text,
  travel_at     text,          -- giữ dạng text thô từ input datetime-local
  note          text
);

create index if not exists leads_created_at_idx on leads (created_at desc);
