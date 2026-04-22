import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Table, InputNumber, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DonHang, ChiTietDonHang } from '@/services/Order/order';
import { TrangThaiDonHang } from '@/services/Order/order';
import type { SanPham, KhachHang } from '@/services/Order/order';

interface Props {
	visible: boolean;
	isEdit: boolean;
	row?: DonHang;
	danhSachSanPham: SanPham[];
	danhSachKhachHang: KhachHang[];
	danhSachDonHang: DonHang[];
	onCancel: () => void;
	onSubmit: (donHang: DonHang) => void;
}

const OrderForm: React.FC<Props> = ({
	visible,
	isEdit,
	row,
	danhSachSanPham,
	danhSachKhachHang,
	danhSachDonHang,
	onCancel,
	onSubmit,
}) => {
	const [form] = Form.useForm();
	const [chiTiet, setChiTiet] = useState<ChiTietDonHang[]>([]);
	const [tongTien, setTongTien] = useState<number>(0);

	useEffect(() => {
		if (visible) {
			if (isEdit && row) {
				form.setFieldsValue({
					maDonHang: row.maDonHang,
					khachHangId: row.khachHangId,
					trangThai: row.trangThai,
				});
				setChiTiet(row.danhSachSanPham);
			} else {
				form.resetFields();
				setChiTiet([]);
			}
		}
	}, [visible, isEdit, row]);

	useEffect(() => {
		const tong = chiTiet.reduce((sum, item) => sum + item.thanhTien, 0);
		setTongTien(tong);
	}, [chiTiet]);

	const themSanPham = () => {
		setChiTiet([
			...chiTiet,
			{
				sanPhamId: '',
				tenSanPham: '',
				soLuong: 1,
				donGia: 0,
				thanhTien: 0,
			},
		]);
	};

	const xoaSanPham = (index: number) => {
		const newList = chiTiet.filter((_, i) => i !== index);
		setChiTiet(newList);
	};

	const chonSanPham = (index: number, sanPhamId: string) => {
		const sp = danhSachSanPham.find((item) => item.id === sanPhamId);
		if (!sp) return;
		const newList = [...chiTiet];
		newList[index] = {
			sanPhamId: sp.id,
			tenSanPham: sp.ten,
			soLuong: newList[index].soLuong,
			donGia: sp.gia,
			thanhTien: sp.gia * newList[index].soLuong,
		};
		setChiTiet(newList);
	};

	const doiSoLuong = (index: number, soLuong: number) => {
		const newList = [...chiTiet];
		newList[index] = {
			...newList[index],
			soLuong: soLuong,
			thanhTien: newList[index].donGia * soLuong,
		};
		setChiTiet(newList);
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			if (chiTiet.length === 0) {
				message.error('Vui lòng thêm ít nhất một sản phẩm!');
				return;
			}

			const sanPhamChuaChon = chiTiet.find((item) => !item.sanPhamId);
			if (sanPhamChuaChon) {
				message.error('Vui lòng chọn sản phẩm cho tất cả các dòng!');
				return;
			}

			if (!isEdit) {
				const trung = danhSachDonHang.find((item) => item.maDonHang === values.maDonHang);
				if (trung) {
					message.error('Mã đơn hàng đã tồn tại!');
					return;
				}
			}

			const khachHang = danhSachKhachHang.find((item) => item.id === values.khachHangId);

			const donHang: DonHang = {
				maDonHang: values.maDonHang,
				khachHangId: values.khachHangId,
				tenKhachHang: khachHang?.ten || '',
				ngayDatHang: isEdit && row ? row.ngayDatHang : new Date().toISOString(),
				danhSachSanPham: chiTiet,
				tongTien: tongTien,
				trangThai: values.trangThai || TrangThaiDonHang.CHO_XAC_NHAN,
			};

			onSubmit(donHang);
		});
	};

	const columns = [
		{
			title: 'Sản phẩm',
			dataIndex: 'sanPhamId',
			render: (_: any, record: ChiTietDonHang, index: number) => (
				<Select
					style={{ width: '100%' }}
					placeholder="Chọn sản phẩm"
					value={record.sanPhamId || undefined}
					onChange={(value) => chonSanPham(index, value)}
				>
					{danhSachSanPham.map((sp) => (
						<Select.Option key={sp.id} value={sp.id}>
							{sp.ten} - {sp.gia.toLocaleString()}đ
						</Select.Option>
					))}
				</Select>
			),
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			width: 100,
			render: (_: any, record: ChiTietDonHang, index: number) => (
				<InputNumber
					min={1}
					value={record.soLuong}
					onChange={(value) => doiSoLuong(index, value || 1)}
				/>
			),
		},
		{
			title: 'Đơn giá',
			dataIndex: 'donGia',
			width: 120,
			render: (val: number) => `${val.toLocaleString()}đ`,
		},
		{
			title: 'Thành tiền',
			dataIndex: 'thanhTien',
			width: 120,
			render: (val: number) => `${val.toLocaleString()}đ`,
		},
		{
			title: '',
			width: 50,
			render: (_: any, __: any, index: number) => (
				<Button
					type="text"
					danger
					icon={<DeleteOutlined />}
					onClick={() => xoaSanPham(index)}
				/>
			),
		},
	];

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
			visible={visible}
			onCancel={onCancel}
			width={700}
			footer={[
				<Button key="cancel" onClick={onCancel}>
					Hủy
				</Button>,
				<Button key="submit" type="primary" onClick={handleSubmit}>
					{isEdit ? 'Cập nhật' : 'Thêm mới'}
				</Button>,
			]}
			destroyOnClose
		>
			<Form form={form} layout="vertical">
				<Form.Item
					name="maDonHang"
					label="Mã đơn hàng"
					rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng!' }]}
				>
					<Input placeholder="Nhập mã đơn hàng" disabled={isEdit} />
				</Form.Item>

				<Form.Item
					name="khachHangId"
					label="Khách hàng"
					rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
				>
					<Select placeholder="Chọn khách hàng">
						{danhSachKhachHang.map((kh) => (
							<Select.Option key={kh.id} value={kh.id}>
								{kh.ten} - {kh.sdt}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{isEdit && (
					<Form.Item
						name="trangThai"
						label="Trạng thái"
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
					>
						<Select placeholder="Chọn trạng thái">
							{Object.values(TrangThaiDonHang).map((tt) => (
								<Select.Option key={tt} value={tt}>
									{tt}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				)}
			</Form>

			<div style={{ marginBottom: 8 }}>
				<Space>
					<strong>Danh sách sản phẩm</strong>
					<Button type="dashed" icon={<PlusOutlined />} onClick={themSanPham} size="small">
						Thêm sản phẩm
					</Button>
				</Space>
			</div>

			<Table
				dataSource={chiTiet}
				columns={columns}
				pagination={false}
				rowKey={(_, index) => String(index)}
				size="small"
			/>

			<div style={{ marginTop: 12, textAlign: 'right' }}>
				<strong>Tổng tiền: {tongTien.toLocaleString()}đ</strong>
			</div>
		</Modal>
	);
};

export default OrderForm;
