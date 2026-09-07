# Nhà Xe Thanh Tuấn

Website dịch vụ cho thuê xe (có tài xế & tự lái) — Astro + TypeScript + Tailwind CSS.

## Tài liệu tham chiếu

- [`docs/PRD.md`](docs/PRD.md) — Yêu cầu sản phẩm (mục tiêu, phạm vi, KPI, kỹ thuật, open items).
- [`docs/information_architecture.md`](docs/information_architecture.md) — Sitemap, navigation, page hierarchy, nội dung mẫu.
- [`CLAUDE.md`](CLAUDE.md) — Ràng buộc kỹ thuật/nội dung khi phát triển thêm.

## Yêu cầu môi trường

- Node.js >= 22.12.0

## Bắt đầu

```bash
npm install
npm run dev       # chạy dev server tại http://localhost:4321
```

## Scripts

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Chạy dev server |
| `npm run build` | Build production ra `dist/` |
| `npm run preview` | Preview bản build |
| `npm test` | Chạy unit test (Vitest) |
| `npm run test:watch` | Chạy test ở chế độ watch |
| `npm run test:coverage` | Chạy test kèm báo cáo coverage |
| `npx astro check` | Kiểm tra type/diagnostics cho `.astro` |

## Cấu trúc thư mục

```
src/
  components/       Component dùng chung (Header, Footer, MobileStickyBar, QuoteForm, RoutePriceTable, FleetGrid, PendingNote, PlaceholderImage...)
  components/home/  Component riêng cho Trang chủ (Hero, ValueProps, CustomerSegments...)
  data/              Dữ liệu tuyến/giá tham khảo (routes.ts)
  layouts/           Layout dùng chung (Layout.astro)
  pages/             Route tĩnh theo sitemap (xem docs/information_architecture.md)
  scripts/           Logic TypeScript phía client (tracking, mobile-menu) + unit test đi kèm
  styles/            Design tokens & global CSS (Tailwind v4 @theme)
legacy/              Bản HTML/CSS thuần cũ trước khi migrate — chỉ để tham chiếu, không chỉnh sửa
```

## Trạng thái dự án

Xem chi tiết ở `CLAUDE.md` (mục "Việc đang dang dở cần biết") và `docs/PRD.md` §8 (Open Items).

Tóm tắt nhanh:
- Đã build đầy đủ 17 trang theo sitemap Phase 1.
- Site tĩnh, chưa có backend — form nhận báo giá hiện chỉ ghi log phía client, chưa gửi lead đi đâu.
- Ảnh xe/tài xế, đánh giá khách hàng, một số chính sách (hoàn hủy, thanh toán chi tiết) đang chờ dữ liệu thật từ nhà xe — đã đánh dấu rõ trong code, không tự bịa.
