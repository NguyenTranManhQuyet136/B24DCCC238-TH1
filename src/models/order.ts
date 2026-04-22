import { useState } from 'react';
import {
	layDanhSachDonHang,
	layDanhSachSanPham,
	layDanhSachKhachHang,
	themDonHang,
	capNhatDonHang,
	huyDonHang,
} from '@/services/Order/order';
import type { DonHang, SanPham, KhachHang } from '@/services/Order/order';

export default () => {
	const [danhSachDonHang, setDanhSachDonHang] = useState<DonHang[]>([]);
	const [danhSachSanPham, setDanhSachSanPham] = useState<SanPham[]>([]);
	const [danhSachKhachHang, setDanhSachKhachHang] = useState<KhachHang[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<DonHang | undefined>(undefined);

	const loadDonHang = () => {
		const data = layDanhSachDonHang();
		setDanhSachDonHang(data);
	};

	const loadSanPham = () => {
		const data = layDanhSachSanPham();
		setDanhSachSanPham(data);
	};

	const loadKhachHang = () => {
		const data = layDanhSachKhachHang();
		setDanhSachKhachHang(data);
	};

	const themMoi = (donHang: DonHang): boolean => {
		const result = themDonHang(donHang);
		if (result) {
			loadDonHang();
		}
		return result;
	};

	const capNhat = (donHang: DonHang) => {
		capNhatDonHang(donHang);
		loadDonHang();
	};

	const huy = (maDonHang: string): boolean => {
		const result = huyDonHang(maDonHang);
		if (result) {
			loadDonHang();
		}
		return result;
	};

	return {
		danhSachDonHang,
		danhSachSanPham,
		danhSachKhachHang,
		visible,
		setVisible,
		isEdit,
		setIsEdit,
		row,
		setRow,
		loadDonHang,
		loadSanPham,
		loadKhachHang,
		themMoi,
		capNhat,
		huy,
	};
};
