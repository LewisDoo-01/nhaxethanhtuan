# PRD Phase 2 - Admin Dashboard (Nhà Xe Thanh Tuấn)

**Phiên bản:** 1.0
**Ngày:** 2026-09-09
**Trạng thái:** Draft
**Phụ thuộc:** `docs/PRD.md` (Phase 1 — website chính), `docs/db/schema-phase2.sql` (thiết kế schema tham khảo)

---

## 1. Tổng Quan (Overview)

### 1.1. Bối cảnh
Website Phase 1 (`docs/PRD.md`) đã chạy với 1 route lead-capture (`/api/leads`) ghi vào Neon Postgres. Chủ nhà xe/nhân viên hiện không có cách nào xem lead, theo dõi KPI, hay chỉnh sửa giá/dòng xe/bài blog ngoài việc nhờ dev sửa code.

### 1.2. Vấn đề cần giải quyết
- Lead nằm trong DB nhưng không ai xem/xử lý được (không có giao diện).
- Không đo được KPI (số cuộc gọi, lead, nguồn traffic) theo thời gian.
- Đổi giá tuyến, thêm dòng xe, viết bài Cẩm nang đều phải qua dev sửa code + deploy.

### 1.3. Mục tiêu (Goals)
- **G1**: Nhân viên/chủ nhà xe xem và xử lý được lead ngay khi phát sinh (giảm thời gian phản hồi khách).
- **G2**: Có số liệu KPI theo thời gian để đánh giá hiệu quả website (đối chiếu G1/G2 của Phase 1).
- **G3**: Chủ nhà xe tự cập nhật giá/dòng xe/bài blog mà không cần dev.

### 1.4. Phi mục tiêu (Non-goals)
- Không xây tính năng đặt xe/thanh toán online (vẫn là phi mục tiêu chung, theo PRD Phase 1 §1.4).
- Không làm app mobile riêng cho admin — chỉ web, responsive đủ dùng trên desktop (nhân viên vận hành thường dùng máy tính).
- Không đồng bộ 2 chiều real-time phức tạp — cập nhật nội dung có thể có độ trễ vài giây/refresh trang là chấp nhận được.

---

## 2. Đối Tượng Người Dùng

| Vai trò | Quyền |
| :--- | :--- |
| **admin** | Toàn quyền: xem/xử lý lead, xem KPI, quản lý nội dung (giá/xe/blog), quản lý tài khoản nhân viên (`staff`) |
| **staff** | Xem/xử lý lead, xem KPI — **không** được sửa nội dung site hay quản lý tài khoản khác |

(Khớp `role` enum `admin`/`staff` đã thiết kế ở `docs/db/schema-phase2.sql`.)

---

## 3. Kiến Trúc & Quan Hệ Với Website Chính (Phase 1)

**Quyết định**: Dashboard là **1 web app riêng biệt** (repo/deploy độc lập với website marketing Phase 1), kết nối chung tới **cùng 1 Neon database**.

```
website chính (Astro, Vercel)  ──POST──▶  /api/leads  ──▶  Neon DB (bảng leads)
dashboard admin (app riêng)    ──────────────────────────▶  Neon DB (đọc/ghi leads, events, routes, fleet_classes, blog_posts, users, sessions)
```

**Quyết định (2026-09-11)**: website chính (Phase 1) **sẽ được sửa** để đọc `routes`/`fleet_classes`/`blog_posts` từ Neon thay vì hard-code `src/data/routes.ts` — để "admin sửa trên dashboard → website chính hiển thị ngay" hoạt động thật. Đây là công việc thực hiện trên **repo Phase 1** (không phải trong PRD này), tracked ở `docs/ROADMAP.md`. Cho tới khi việc này xong, phần "Quản lý nội dung" ở dashboard ghi đúng vào DB nhưng website chính vẫn hiển thị dữ liệu hard-code cũ.

Bài Cẩm nang (`blog_posts`) tương tự: `/cam-nang` ở website chính hiện là `PendingNote` tĩnh — cần sửa để đọc từ DB mới hiển thị được bài viết thật (cùng đợt migrate nói trên).

---

## 4. Yêu Cầu Chức Năng

### 4.1. Đăng nhập & Phân quyền
- Trang đăng nhập (email + password) cho `users`.
- Session tự xây: sinh token ngẫu nhiên lưu bảng `sessions`, cookie `httpOnly` + `secure`, có `expires_at` (đề xuất 7 ngày, có thể chỉnh).
- Middleware chặn mọi route dashboard nếu chưa đăng nhập; chặn route quản lý nội dung/tài khoản nếu `role != admin`.
- Đăng xuất: xóa session hiện tại khỏi DB.
- Không có "quên mật khẩu" tự động ở bản đầu (admin đầu tiên tạo qua seed script/SQL trực tiếp; reset mật khẩu do admin thao tác thủ công trong DB hoặc qua màn hình admin đổi mật khẩu cho staff).

### 4.2. Quản lý Lead
- Danh sách lead: lọc theo `status`, tìm theo số điện thoại, sắp xếp theo `created_at`.
- Xem chi tiết 1 lead: đầy đủ thông tin đã gửi (tên, SĐT, loại dịch vụ, điểm đi/đến, ngày giờ, ghi chú, trang nguồn).
- **Xác minh điểm đón/trả trên bản đồ (Mapbox)**: `from_location`/`to_location` là text tự do khách nhập (vd "TP.HCM", "Vũng Tàu", có thể ghi thiếu/sai). Ở màn chi tiết lead, geocode 2 địa chỉ này sang tọa độ (Mapbox Geocoding API) và hiển thị pin trên bản đồ (Mapbox GL) để admin/staff xác minh nhanh bằng mắt xem địa chỉ khách nhập có hợp lý không, trước khi gọi lại tư vấn.
  - Đây là **công cụ hỗ trợ xác minh trực quan**, không phải nguồn dữ liệu địa lý chính xác tuyệt đối — text tự do có thể geocode sai/mơ hồ (trùng tên địa danh, viết tắt...); admin vẫn cần xác nhận lại với khách qua điện thoại khi cần.
  - Geocode theo yêu cầu (khi admin mở chi tiết lead), kết quả lưu cache vào `leads` (xem cột mới trong schema) để tránh gọi lại API mỗi lần xem, và giữ được bản ghi lịch sử ngay cả khi sau này đổi/mất Mapbox token.
- Đổi `status` (new → contacted → quoted → won/lost), gán `assigned_to` cho staff xử lý.
- Không cần thông báo real-time (push/email) ở bản đầu — nhân viên chủ động vào xem.

### 4.3. Thống Kê KPI
- Biểu đồ/số liệu theo ngày/tuần/tháng: số lead mới, số cuộc gọi (`events` where `event_type='call'`), số click Zalo (`event_type='zalo'`).
- Bộ lọc khoảng thời gian (7 ngày / 30 ngày / tùy chọn).
- Không cần phân tích nguồn traffic (UTM, referrer) ở bản đầu — `events.source_page` chỉ là trang gửi sự kiện, không phải nguồn traffic đầy đủ; nếu cần, đây là hạng mục mở rộng sau.

### 4.4. Quản Lý Nội Dung
- **Bảng giá tuyến** (`routes`): CRUD tuyến, giá 4/7/16 chỗ (numeric), thứ tự hiển thị, publish/unpublish.
- **Dòng xe** (`fleet_classes`): CRUD tên hạng xe, ghi chú, thứ tự.
  - **Ảnh xe (quyết định 2026-09-11)**: lưu **trong source code như static asset** (vd `public/images/fleet/4-cho.jpg` trong repo dashboard hoặc repo website chính), **không có tính năng upload runtime**. DB chỉ lưu `photo_asset_path` (đường dẫn file), không lưu file nhị phân. Thêm/đổi ảnh = dev commit file mới + deploy — chấp nhận được vì chỉ có vài ảnh xe, không đổi thường xuyên. Cách này loại bỏ hoàn toàn rủi ro ổ đĩa ephemeral trên serverless đã nêu ở bản trước, và **không còn ràng buộc "phải có ổ đĩa persistent"** khi chọn nền tảng host dashboard.
- **Bài Cẩm nang** (`blog_posts`): CRUD bài viết (tiêu đề, mô tả ngắn, nội dung, ảnh cover), trạng thái draft/published. Ảnh cover áp dụng cùng cơ chế asset tĩnh như trên cho MVP; nếu sau này cần đăng bài thường xuyên và thấy bất tiện, cân nhắc lại cơ chế upload thật (ngoài phạm vi PRD này).

### 4.5. Quản Lý Tài Khoản (chỉ admin)
- Tạo/khóa tài khoản `staff`.
- Đổi mật khẩu cho tài khoản khác (admin) hoặc chính mình.

---

## 5. Yêu Cầu Phi Chức Năng

- **Bảo mật**: mật khẩu hash (bcrypt/argon2), session cookie `httpOnly`/`secure`/`sameSite=strict`, không lộ `DATABASE_URL` hay bất kỳ secret nào ra client.
- **Responsive**: ưu tiên desktop, tối thiểu dùng được trên tablet — không bắt buộc tối ưu mobile như website chính.
- **Ngôn ngữ**: Tiếng Việt, nhất quán với website chính.
- **Không phụ thuộc dịch vụ auth/storage bên thứ 3** (theo 2 quyết định đã chốt: tự xây auth, lưu ảnh local).

---

## 6. Kỹ Thuật (Technical Approach)

| Hạng mục | Quyết định |
| :--- | :--- |
| **Kiến trúc** | Web app riêng biệt, tách khỏi website marketing Phase 1 |
| **Database** | Dùng chung Neon Postgres với website chính (schema: `docs/db/schema-phase2.sql`) |
| **Auth** | Tự xây (session token + `password_hash`), không dùng thư viện/dịch vụ ngoài |
| **Lưu trữ ảnh** | Static asset trong source code (không upload runtime) — không còn ràng buộc ổ đĩa persistent, dashboard host serverless được |
| **Framework** | **Next.js + TypeScript** |
| **UI** | **shadcn/ui** + **Tailwind CSS** |
| **Data fetching/state** | **TanStack Query** (server state), **Zustand** (client/UI state) |
| **Bảng dữ liệu** | **TanStack Table** (danh sách lead, routes, fleet_classes, blog_posts) |
| **Form & validate** | **React Hook Form** + **Zod** (form CRUD nội dung, form đăng nhập) |
| **Biểu đồ KPI** | **Recharts** (§4.3) |
| **Bản đồ** | **Mapbox** (GL + Geocoding API) — xác minh điểm đón/trả của lead trên bản đồ, xem §4.2 |
| **Hosting** | Chưa chốt — open item, nhưng **không còn bị ràng buộc bởi yêu cầu ổ đĩa persistent** (đã gỡ sau quyết định lưu ảnh dạng asset) |

---

## 7. Liên Kết Với `docs/db/schema-phase2.sql`

Toàn bộ bảng trong file schema (`users`, `sessions`, `leads` mở rộng, `events`, `routes`, `fleet_classes`, `blog_posts`) là nguồn dữ liệu chính thức cho PRD này. Không thêm bảng mới ngoài phạm vi đã thiết kế mà không cập nhật file schema trước.

---

## 8. Open Items / Cần Quyết Định Thêm

- [x] ~~Framework cụ thể cho dashboard~~ — đã chốt Next.js + TypeScript (2026-09-11).
- [x] ~~Cơ chế lưu ảnh~~ — đã chốt static asset trong source code, không upload runtime (2026-09-11).
- [x] ~~Website chính có cần sửa để đọc từ DB không~~ — đã xác nhận **có**, tracked ở `docs/ROADMAP.md` (2026-09-11).
- [ ] Nền tảng hosting cho dashboard — vẫn open, nhưng không còn ràng buộc ổ đĩa persistent nên có thể cân nhắc cả serverless (Vercel...) lẫn VPS.
- [ ] Domain/subdomain cho dashboard (vd `admin.nhaxethanhtuan.com`).
- [x] ~~Use case cụ thể cho Mapbox~~ — đã chốt: xác minh điểm đón/trả của lead trên bản đồ, xem §4.2 (2026-09-11).
- [ ] Tạo Mapbox account + access token, lưu vào biến môi trường riêng của dashboard (không dùng chung `.env`/secret với Phase 1). Lưu ý free tier Mapbox Geocoding có giới hạn số request/tháng — đủ cho quy mô hiện tại nhưng cần theo dõi nếu lead tăng nhiều.
- [ ] Cách tạo tài khoản admin đầu tiên (seed script, hay chạy SQL insert thủ công qua Neon SQL editor).
- [ ] Có cần audit log (ai sửa gì, khi nào) không — hiện schema chưa có bảng này.

---

## 9. Tiêu Chí Chấp Nhận (Acceptance Criteria)

- Đăng nhập/đăng xuất hoạt động đúng, session hết hạn bị từ chối truy cập.
- `staff` không truy cập được các trang/API quản lý nội dung và quản lý tài khoản (kiểm tra bằng test hoặc thao tác tay).
- Danh sách lead hiển thị đúng dữ liệu từ Neon, đổi `status`/`assigned_to` lưu lại đúng.
- Màn chi tiết lead hiển thị đúng pin điểm đón/trả trên bản đồ Mapbox khi `from_location`/`to_location` geocode được; xử lý hợp lý khi geocode thất bại hoặc mơ hồ (không crash, báo rõ cho admin biết là không xác định được vị trí).
- Biểu đồ KPI phản ánh đúng số liệu trong `events`/`leads` theo khoảng thời gian chọn.
- CRUD `routes`/`fleet_classes`/`blog_posts` hoạt động, ảnh upload lưu và hiển thị lại đúng trên chính dashboard (chưa yêu cầu phản ánh ra website chính — xem §3).
