// Dữ liệu tham khảo từ docs/information_architecture.md §3.2 (tuyến phổ biến từ TP.HCM)
// Giá đã bao gồm tài xế, xăng dầu, cầu đường cơ bản — không tự bịa thêm tuyến/giá khác.
export interface Route {
  name: string;
  distance: string;
  p4: string;
  p7: string;
  p16: string;
}

export const routes: Route[] = [
  { name: "Biên Hòa / Long Thành (Đồng Nai)", distance: "~35 - 50 km", p4: "800.000 - 1.000.000", p7: "1.000.000 - 1.200.000", p16: "1.700.000 - 2.000.000" },
  { name: "Thủ Dầu Một / Thuận An (Bình Dương)", distance: "~30 - 45 km", p4: "800.000 - 1.000.000", p7: "1.000.000 - 1.200.000", p16: "1.700.000 - 2.000.000" },
  { name: "Vũng Tàu (Bà Rịa - Vũng Tàu)", distance: "~120 km", p4: "1.200.000 - 1.400.000", p7: "1.400.000 - 1.600.000", p16: "2.200.000 - 2.500.000" },
  { name: "Mỹ Tho (Tiền Giang)", distance: "~70 km", p4: "1.100.000 - 1.300.000", p7: "1.300.000 - 1.500.000", p16: "2.100.000 - 2.400.000" },
  { name: "Bến Tre", distance: "~85 km", p4: "1.300.000 - 1.500.000", p7: "1.500.000 - 1.700.000", p16: "2.300.000 - 2.600.000" },
  { name: "Cần Thơ", distance: "~170 km", p4: "2.000.000 - 2.300.000", p7: "2.300.000 - 2.600.000", p16: "3.500.000 - 3.900.000" },
  { name: "Long Xuyên (An Giang)", distance: "~190 km", p4: "2.200.000 - 2.500.000", p7: "2.500.000 - 2.800.000", p16: "3.800.000 - 4.200.000" },
  { name: "Rạch Giá (Kiên Giang)", distance: "~250 km", p4: "2.700.000 - 3.000.000", p7: "3.000.000 - 3.300.000", p16: "4.500.000 - 5.000.000" },
];

export interface FleetClass {
  seats: string;
  note: string;
}

export const fleetClasses: FleetClass[] = [
  { seats: "4 Chỗ", note: "Sedan/Hatchback — gọn, tiết kiệm nhiên liệu" },
  { seats: "7 Chỗ", note: "SUV/MPV — rộng rãi cho gia đình, nhóm bạn" },
  { seats: "16 Chỗ", note: "Transit/Solati — phù hợp đoàn, công ty" },
];
