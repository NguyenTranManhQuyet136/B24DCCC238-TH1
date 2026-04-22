export interface SanPham {
	id: string;
	ten: string;
	gia: number;
}

export interface KhachHang {
	id: string;
	ten: string;
	sdt: string;
}

export interface ChiTietDonHang {
	sanPhamId: string;
	tenSanPham: string;
	soLuong: number;
	donGia: number;
	thanhTien: number;
}

export enum TrangThaiDonHang {
	CHO_XAC_NHAN = 'Chờ xác nhận',
	DANG_GIAO = 'Đang giao',
	HOAN_THANH = 'Hoàn thành',
	HUY = 'Hủy',
}

export interface DonHang {
	maDonHang: string;
	khachHangId: string;
	tenKhachHang: string;
	ngayDatHang: string;
	danhSachSanPham: ChiTietDonHang[];
	tongTien: number;
	trangThai: TrangThaiDonHang;
}

const ORDERS_KEY = 'danhSachDonHang';
const PRODUCTS_KEY = 'danhSachSanPham';
const CUSTOMERS_KEY = 'danhSachKhachHang';

const danhSachSanPhamMacDinh: SanPham[] = [
	{ id: 'SP001', ten: 'Áo thun nam', gia: 150000 },
	{ id: 'SP002', ten: 'Quần jeans', gia: 350000 },
	{ id: 'SP003', ten: 'Giày sneaker', gia: 800000 },
	{ id: 'SP004', ten: 'Balo laptop', gia: 450000 },
	{ id: 'SP005', ten: 'Mũ lưỡi trai', gia: 120000 },
	{ id: 'SP006', ten: 'Áo khoác gió', gia: 280000 },
	{ id: 'SP007', ten: 'Đồng hồ thời trang', gia: 550000 },
	{ id: 'SP008', ten: 'Kính mát', gia: 200000 },
];

const danhSachKhachHangMacDinh: KhachHang[] = [
	{ id: 'KH001', ten: 'Nguyễn Văn A', sdt: '0901234567' },
	{ id: 'KH002', ten: 'Trần Thị B', sdt: '0912345678' },
	{ id: 'KH003', ten: 'Lê Văn C', sdt: '0923456789' },
	{ id: 'KH004', ten: 'Phạm Thị D', sdt: '0934567890' },
	{ id: 'KH005', ten: 'Hoàng Văn E', sdt: '0945678901' },
];

export const layDanhSachSanPham = (): SanPham[] => {
	const data = localStorage.getItem(PRODUCTS_KEY);
	if (!data) {
		localStorage.setItem(PRODUCTS_KEY, JSON.stringify(danhSachSanPhamMacDinh));
		return danhSachSanPhamMacDinh;
	}
	return JSON.parse(data);
};

export const layDanhSachKhachHang = (): KhachHang[] => {
	const data = localStorage.getItem(CUSTOMERS_KEY);
	if (!data) {
		localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(danhSachKhachHangMacDinh));
		return danhSachKhachHangMacDinh;
	}
	return JSON.parse(data);
};

export const layDanhSachDonHang = (): DonHang[] => {
	const data = localStorage.getItem(ORDERS_KEY);
	if (!data) {
		return [];
	}
	return JSON.parse(data);
};

export const luuDanhSachDonHang = (danhSach: DonHang[]): void => {
	localStorage.setItem(ORDERS_KEY, JSON.stringify(danhSach));
};

export const themDonHang = (donHang: DonHang): boolean => {
	const danhSach = layDanhSachDonHang();
	const trung = danhSach.find((item) => item.maDonHang === donHang.maDonHang);
	if (trung) {
		return false;
	}
	danhSach.push(donHang);
	luuDanhSachDonHang(danhSach);
	return true;
};

export const capNhatDonHang = (donHang: DonHang): void => {
	const danhSach = layDanhSachDonHang();
	const index = danhSach.findIndex((item) => item.maDonHang === donHang.maDonHang);
	if (index !== -1) {
		danhSach[index] = donHang;
		luuDanhSachDonHang(danhSach);
	}
};

export const huyDonHang = (maDonHang: string): boolean => {
	const danhSach = layDanhSachDonHang();
	const index = danhSach.findIndex((item) => item.maDonHang === maDonHang);
	if (index === -1) {
		return false;
	}
	if (danhSach[index].trangThai !== TrangThaiDonHang.CHO_XAC_NHAN) {
		return false;
	}
	danhSach[index].trangThai = TrangThaiDonHang.HUY;
	luuDanhSachDonHang(danhSach);
	return true;
};
