# PRD - Website Nhà Xe Thanh Tuấn

**Phiên bản:** 1.0
**Ngày:** 2026-09-05
**Trạng thái:** Draft

---

## 1. Tổng Quan (Overview)

### 1.1. Bối cảnh
Nhà Xe Thanh Tuấn cần một website chuyển đổi cao (conversion-focused) để phục vụ 3 nhóm khách hàng mục tiêu: Gia đình, Khách du lịch, Khách công tác/Doanh nghiệp. Website đóng vai trò là kênh giới thiệu dịch vụ, bảng giá, và thúc đẩy khách liên hệ trực tiếp (gọi điện/Zalo/form) — giao dịch thực tế vẫn chốt qua điện thoại/trực tiếp.

Tài liệu Kiến trúc thông tin (`information_architecture.md`) đã hoàn thành và là nguồn tham chiếu chính cho sitemap, navigation, page hierarchy, và nội dung mẫu.

### 1.2. Vấn đề cần giải quyết
- Hiện tại chưa có website hoàn chỉnh (chỉ có khung header/footer/sticky-bar tĩnh, chưa có nội dung).
- Khách hàng tiềm năng không có kênh trực tuyến để tra cứu dịch vụ, bảng giá, thủ tục trước khi quyết định gọi điện.

### 1.3. Mục tiêu (Goals)
- **G1 — Tăng số cuộc gọi Hotline**: Đo bằng số lượt click vào các link `tel:` trên toàn site (header, hero, sticky bar, footer).
- **G2 — Tăng lead qua Form/Zalo**: Đo bằng số lượt submit form báo giá và số lượt click "Chat Zalo".

### 1.4. Phi mục tiêu (Non-goals, cho Phase 1)
- Không xây dựng hệ thống đặt xe/thanh toán online.
- Không xây dựng admin dashboard/CMS quản trị nội dung — xem [Phase 2](#7-phase-2-định-hướng-tương-lai).
- Không tích hợp tài khoản người dùng/đăng nhập phía khách hàng.

---

## 2. Đối Tượng Người Dùng (User Segments)

| Nhóm | Nhu cầu chính | Ưu tiên hiển thị |
| :--- | :--- | :--- |
| **Gia đình** | An toàn, tiện nghi, chống say xe | Ghế trẻ em, tài xế điềm đạm, xe rộng rãi |
| **Khách du lịch** | Linh hoạt lộ trình, trải nghiệm | Tài xế kiêm hướng dẫn viên, tự do lịch trình |
| **Doanh nghiệp/Công tác** | Đúng giờ, chuyên nghiệp, hóa đơn VAT | Tài xế lịch sự, xe sang, xuất hóa đơn nhanh |

---

## 3. Phạm Vi (Scope) — Phiên Bản 1

Build đầy đủ theo sitemap đã thiết kế trong `information_architecture.md`:

- **Trang chủ**: Hero + booking widget nhanh, Service Selector, Value Propositions, Bảng giá tham khảo, Góc khách hàng theo 3 phân khúc, Quy trình 3 bước, Đánh giá khách hàng, Bottom CTA.
- **Dịch vụ**: Thuê xe có tài xế (đưa đón sân bay, xe đi tỉnh/du lịch, xe công tác/VIP), Thuê xe tự lái (theo ngày, theo tháng/dài hạn, thủ tục & quy định).
- **Bảng giá & Dòng xe**: Xe 4 chỗ, 7 chỗ, 16 chỗ kèm bảng giá theo tuyến.
- **Dành cho khách hàng**: 3 trang phân khúc (Gia đình / Du lịch / Doanh nghiệp).
- **Cẩm nang & Tin tức (Blog)**.
- **Liên hệ & Đặt xe**: Thông tin liên hệ, bản đồ, form đặt xe.
- **Trang chi tiết dịch vụ**: theo template mục 3.2 của IA (bảng giá tuyến, thủ tục thuê tự lái, form báo giá, cẩm nang liên quan).

Nội dung/tài sản (ảnh xe thật, giá chính xác, giấy phép kinh doanh...) đã có sẵn — do khách hàng (owner) cung cấp trong quá trình build, cần lên kế hoạch thu thập theo từng trang.

---

## 4. Yêu Cầu Chức Năng (Functional Requirements)

### 4.1. Điều hướng & Layout
- Header sticky với dropdown menu (Dịch vụ, Bảng giá & Xe, Góc khách hàng), CTA Hotline nổi bật.
- Mobile sticky bar: Gọi ngay / Chat Zalo / Nhận báo giá.
- Footer 4 cột theo cấu trúc đã định trong IA §2.3.

### 4.2. Form & Lead Capture
- Booking widget nhanh ở Hero (loại dịch vụ, điểm đi/đến, ngày giờ, SĐT).
- Form "Nhận báo giá chi tiết" ở cuối trang chi tiết dịch vụ (cho lộ trình nhiều ngày).
- Toàn bộ submit event phải được track được (phục vụ đo KPI G2, và làm nền cho Phase 2 dashboard).

### 4.3. Nội dung động cần hiển thị
- Bảng giá theo tuyến (dữ liệu dạng bảng, dễ cập nhật thủ công trong Phase 1).
- Danh sách xe theo hạng (4/7/16 chỗ) với ảnh + giá/ngày.
- Bài viết Blog/Cẩm nang.

### 4.4. Tracking & Đo lường KPI
- Track click-to-call (`tel:` links) trên toàn site.
- Track click Chat Zalo.
- Track form submit (booking widget + form báo giá).
- **Quyết định**: Phase 1 không tích hợp GA4/Facebook Pixel/GTM của bên thứ 3 — vì Nhà Xe Thanh Tuấn muốn hệ thống tracking/dashboard tự xây (xem Phase 2). Ở Phase 1, các sự kiện trên cần được thiết kế sẵn hook/event layer (ví dụ custom `data-track` attributes + một hàm gửi event tối giản) để Phase 2 cắm dashboard vào mà không phải sửa lại toàn bộ frontend.

---

## 5. Yêu Cầu Phi Chức Năng (Non-functional Requirements)

- **Responsive/Mobile-first**: bắt buộc, vì phần lớn traffic dịch vụ vận tải đến từ mobile.
- **Hiệu năng/SEO**: ưu tiên tốc độ tải trang và khả năng index (ảnh hưởng trực tiếp đến traffic organic → lead).
- **Ảnh thực tế**: không dùng stock photo cho hình xe/tài xế, theo khuyến nghị IA §5.
- **Ngôn ngữ**: Tiếng Việt (chưa có yêu cầu đa ngôn ngữ).

---

## 6. Kỹ Thuật (Technical Approach)

| Hạng mục | Quyết định |
| :--- | :--- |
| **Framework** | Astro + TypeScript |
| **Styling** | Tailwind CSS |
| **Hosting** | Chưa xác định — open item, cần quyết định trước khi launch (ứng viên: Vercel/Netlify do tương thích tốt với Astro) |
| **Timeline** | Không gấp — ưu tiên chất lượng hơn tốc độ |

**Ghi chú kỹ thuật:**
- Cấu trúc hiện tại (`index.html`, `style.css` thuần) sẽ được **migrate sang Astro + Tailwind + TS**, không tiếp tục phát triển thêm trên nền HTML/CSS thuần.
- File `script.js` hiện đang bị tham chiếu trong `index.html` nhưng không tồn tại — sẽ được thay thế bằng logic TypeScript trong quá trình migrate.
- Cần thiết kế lại bảng màu trong biến CSS/Tailwind config (hiện tại nhiều biến màu đang là placeholder `black`).

---

## 7. Phase 2 (Định Hướng Tương Lai)

Không thuộc phạm vi PRD này, ghi nhận để thiết kế kiến trúc Phase 1 tương thích:

**Admin Dashboard riêng** để chủ nhà xe/nhân viên tự quản lý:
- Ghi nhận lead từ mọi form/click (gọi, Zalo, form báo giá) vào database riêng.
- Thống kê/biểu đồ KPI theo thời gian (số cuộc gọi, lead, nguồn truy cập) theo ngày/tuần/tháng.
- Quản lý nội dung: chỉnh sửa giá xe, dòng xe, bài blog không cần sửa code.
- Đăng nhập/phân quyền admin (bảo mật, chỉ nhân viên/chủ nhà xe truy cập).

→ Sẽ cần backend + database riêng, lập PRD riêng khi bắt đầu Phase 2.

---

## 8. Open Items / Cần Quyết Định Thêm

- [ ] Nền tảng hosting cụ thể.
- [ ] Domain chính thức.
- [ ] Timeline chi tiết cho từng milestone (do "không gấp" nên chưa chốt mốc).
- [ ] Bảng màu thương hiệu chính thức (thay thế placeholder `black`).
- [ ] Danh sách ảnh/tài sản cụ thể cần khách hàng cung cấp theo từng trang.

---

## 9. Tiêu Chí Chấp Nhận (Acceptance Criteria) — Phase 1

- Toàn bộ trang trong sitemap IA được build và có nội dung thật (không còn placeholder).
- Mobile sticky bar hoạt động đúng trên các breakpoint di động.
- Mọi CTA gọi/Zalo/form đều hoạt động và có thể track được sự kiện.
- Bảng giá và thông tin dịch vụ khớp với dữ liệu thật do khách hàng cung cấp.
- Không còn broken reference (như `script.js` hiện tại).
