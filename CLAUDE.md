# CLAUDE.md — Nhà Xe Thanh Tuấn

Tài liệu tham chiếu bắt buộc: `PRD.md` (yêu cầu sản phẩm) và `information_architecture.md` (sitemap, navigation, page hierarchy, nội dung mẫu). Luôn đối chiếu hai file này trước khi thêm/sửa trang hoặc tính năng.

## Stack & Ràng buộc kỹ thuật

- **Framework**: Astro + TypeScript. Không dùng React/Vue/Next.js trừ khi PRD được cập nhật.
- **Styling**: Tailwind CSS. Không viết CSS thuần mới, không quay lại `style.css`/`index.html` cũ (đang chờ migrate).
- **Backend tối thiểu cho lead capture (đã điều chỉnh so với PRD gốc)**: site vẫn tĩnh (`output` mặc định) ngoại trừ **duy nhất 1 route** `src/pages/api/leads.ts` (`prerender = false`) ghi lead vào Neon Postgres qua `@neondatabase/serverless`, deploy trên **Vercel** (adapter `@astrojs/vercel` đã cấu hình trong `astro.config.mjs`). Đây là ngoại lệ có chủ đích cho mục tiêu G2 (tăng lead) — không mở rộng thêm route server-side nào khác ngoài mục đích này nếu chưa xác nhận với user. Không xây admin/CMS/dashboard — vẫn thuộc Phase 2 (PRD §7), cần PRD riêng.
  - Schema DB: `docs/db/schema.sql` (bảng `leads`, chạy 1 lần trong Neon SQL editor).
  - Kết nối: `.env` (đã gitignore) chứa `DATABASE_URL`, xem mẫu ở `.env.example`. Không bao giờ commit giá trị thật.
- **Tracking**: Không tích hợp GA4, Facebook Pixel, hay Google Tag Manager. Mọi CTA gọi điện/Zalo/form phải có event layer riêng tối giản (ví dụ `data-track` attribute + hàm gửi event nội bộ) để tương thích dashboard Phase 2 sau này — không cắm thẳng script bên thứ ba.
- **Hosting/domain**: chưa chốt — đừng giả định nền tảng cụ thể trong code (tránh hard-code cấu hình riêng của Vercel/Netlify nếu chưa được xác nhận).

## Nội dung & Nội dung hình ảnh

- **Không dùng stock photo** cho ảnh xe/tài xế — chỉ dùng ảnh thật do chủ nhà xe cung cấp. Nếu ảnh thật chưa có, dùng placeholder rõ ràng (ví dụ khung xám có chú thích "Ảnh cần bổ sung") thay vì ảnh internet.
- Giá cả, thông tin pháp lý (giấy phép kinh doanh, mã số thuế), số hotline: chỉ dùng dữ liệu thật do khách hàng cung cấp. Không tự bịa số liệu — nếu thiếu, để placeholder và ghi vào PRD §8 (Open Items).
- Ngôn ngữ nội dung: tiếng Việt. Không thêm đa ngôn ngữ trừ khi được yêu cầu.

## Đối tượng người dùng — luôn cân nhắc khi viết nội dung/UI

3 phân khúc chính, mỗi trang/section liên quan cần nói đúng ngôn ngữ của từng nhóm (chi tiết ở PRD §2):

- **Gia đình**: an toàn, tiện nghi, chống say xe.
- **Khách du lịch**: linh hoạt lộ trình, trải nghiệm.
- **Doanh nghiệp/Công tác**: đúng giờ, chuyên nghiệp, hóa đơn VAT.

## Mobile-first bắt buộc

Phần lớn traffic đến từ mobile. Mobile sticky bar (Gọi ngay / Chat Zalo / Nhận báo giá) là bắt buộc trên mọi trang và phải test trên các breakpoint di động trước khi coi là hoàn thành.

## Quy trình khi thêm trang/tính năng mới

1. Kiểm tra trang/tính năng đã có trong sitemap `information_architecture.md` chưa. Nếu chưa có, hỏi user trước khi tự ý mở rộng scope.
2. Đối chiếu tiêu chí chấp nhận ở PRD §9 trước khi báo "hoàn thành".
3. Không tự thêm tính năng ngoài phạm vi Phase 1 (đặt xe online, thanh toán, tài khoản khách hàng, CMS) — đó là phi mục tiêu rõ ràng trong PRD §1.4.
