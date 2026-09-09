# Roadmap Phát Triển - Website Nhà Xe Thanh Tuấn

**Ngày lập:** 2026-09-08
Tài liệu này bổ sung cho `PRD.md` (yêu cầu) và `information_architecture.md` (nội dung) — tập trung vào **thứ tự làm việc tiếp theo**.

---

## Trạng thái hiện tại (baseline)

- ✅ Migrate xong sang Astro + TypeScript + Tailwind CSS.
- ✅ 17/17 trang trong sitemap Phase 1 đã có khung + nội dung thật (nơi có dữ liệu) hoặc placeholder rõ ràng (nơi thiếu dữ liệu).
- ✅ Unit test cho phần logic (tracking, mobile menu, dữ liệu tuyến/giá) — 17 test pass.
- ⚠️ Repo local có 1 commit, **chưa có remote** — chưa đẩy lên GitHub/GitLab.
- ⚠️ Form "Nhận báo giá" hiện **không gửi lead đi đâu cả** — chỉ log ra console trình duyệt rồi mất (xem PRD §1.4: không backend ở Phase 1).

---

## Giai đoạn 1 — Thu thập dữ liệu thật (blocking, cần bạn cung cấp)

Đây là việc **không thể code thay được**, và đang chặn nhiều phần nội dung:

| Hạng mục | Đang thiếu | Vị trí trong code |
| :--- | :--- | :--- |
| Ảnh xe/tài xế thật | Không dùng stock photo | 7 chỗ `PlaceholderImage`/`FleetGrid` trên toàn site |
| Đánh giá khách hàng thật | Không tự tạo review giả | `src/components/home/Testimonials.astro` |
| Địa chỉ văn phòng chính xác | Đang dùng khu vực chung "Bình Thạnh" | Footer, `/lien-he` (bản đồ), `chinh-sach.astro` |
| Mã số thuế, giấy phép KD vận tải | Chưa có | Footer (`docs/PRD.md` §8) |
| Chính sách hoàn hủy/bồi thường (xe có tài xế) | Chưa xác nhận | `/chinh-sach` |
| Phương thức thanh toán chi tiết | Chỉ có phần tự lái | `/thanh-toan` |
| Bài viết Cẩm nang (ít nhất 3-5 bài mở đầu) | Chưa có | `/cam-nang` |
| Bảng màu thương hiệu chính thức | Đang tạm dùng đỏ/cam từ bản cũ | `src/styles/global.css` |
| Domain + quyết định hosting | Chưa chốt | — |

**Đề xuất**: bạn gửi dần theo mức ưu tiên (ảnh xe + hotline/Zalo xác nhận trước, vì xuất hiện nhiều nhất), mình cập nhật ngay khi có.

---

## Giai đoạn 2 — Làm cho form "sống" (lead thực sự đi đâu đó)

✅ **Đã triển khai (2026-09-08)**: chọn phương án Neon Postgres + 1 API route server-side (`/api/leads`), deploy trên Vercel (`@astrojs/vercel` adapter). Site vẫn tĩnh ngoại trừ route này. Xem `CLAUDE.md` và `docs/PRD.md` §4.4/§6 để biết chi tiết ngoại lệ so với ràng buộc "không backend Phase 1" ban đầu.

**Còn thiếu để chạy thật trên production**:
- [ ] Tạo project Neon thật, chạy `docs/db/schema.sql` để tạo bảng `leads`.
- [ ] Cấu hình `DATABASE_URL` trong Vercel Environment Variables (không chỉ `.env` local).
- [ ] Test end-to-end trên môi trường deploy thật (local dev server không chạy Vercel functions y hệt production).
- [ ] Quyết định ai xem/xử lý lead trong bảng `leads` trước khi có dashboard Phase 2 (Neon có SQL editor xem tạm được, nhưng không phải giao diện cho nhân viên nhà xe).

---

## Giai đoạn 3 — QA & Hoàn thiện trước khi launch

Đối chiếu tiêu chí chấp nhận PRD §9:

- [ ] Test mobile sticky bar trên các breakpoint thực tế (375px, 390px, 414px...).
- [ ] Test toàn bộ CTA gọi/Zalo/form trên thiết bị thật (không chỉ dev server).
- [ ] Kiểm tra SEO cơ bản: meta title/description mỗi trang (đã có), sitemap.xml, robots.txt (chưa có).
- [ ] Kiểm tra tốc độ tải (Lighthouse) sau khi có ảnh thật (ảnh thật thường là nguyên nhân chính làm chậm site).
- [ ] Kiểm tra hiển thị trên Safari/iOS (thường lệch CSS nhiều nhất).
- [ ] Rà lại toàn bộ nội dung tiếng Việt (chính tả, dấu câu) sau khi có dữ liệu thật thay placeholder.

---

## Giai đoạn 4 — Git & Deploy

1. Tạo remote (GitHub) — cần bạn xác nhận có muốn public hay private repo.
2. Push code hiện tại.
3. Chốt nền tảng hosting (Vercel/Netlify phù hợp nhất với Astro — xem PRD §6) và domain.
4. Cấu hình deploy tự động từ nhánh chính.

---

## Giai đoạn 5 — Sau khi launch (không thuộc scope hiện tại)

Chỉ bắt đầu khi Phase 1 đã chạy ổn định và có nhu cầu rõ ràng:

- **Phase 2 — Admin Dashboard** (PRD §7): ghi nhận lead, thống kê KPI, quản lý nội dung, đăng nhập. Cần PRD riêng.
- Mở rộng Cẩm nang thành kênh SEO thật sự (viết bài định kỳ).
- Đánh giá lại nhu cầu đa ngôn ngữ nếu có khách quốc tế đáng kể.

---

## Đề xuất thứ tự làm ngay (nếu không có input gì thêm từ bạn)

1. Push code lên git remote (kỹ thuật thuần, không cần chờ bạn) — *có thể làm ngay*.
2. Chốt phương án Giai đoạn 2 (form) — *cần bạn quyết định*.
3. Nhận ảnh/thông tin thật theo bảng Giai đoạn 1 — *cần bạn cung cấp, có thể làm song song*.
4. QA Giai đoạn 3 sau khi có nội dung thật.
