# CLAUDE.md — Nhà Xe Thanh Tuấn

Tài liệu tham chiếu bắt buộc: `PRD.md` (yêu cầu sản phẩm) và `information_architecture.md` (sitemap, navigation, page hierarchy, nội dung mẫu). Luôn đối chiếu hai file này trước khi thêm/sửa trang hoặc tính năng.

## Stack & Ràng buộc kỹ thuật

- **Framework**: Astro + TypeScript. Không dùng React/Vue/Next.js trừ khi PRD được cập nhật.
- **Styling**: Tailwind CSS. Không viết CSS thuần mới, không quay lại `style.css`/`index.html` cũ (đang chờ migrate).
- **Không backend/database ở Phase 1**: Đây là site tĩnh. Không thêm API routes, không kết nối DB, không xây admin/CMS — các hạng mục đó thuộc Phase 2 (xem PRD §7) và cần PRD riêng trước khi động vào.
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
