import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Input, Select, Tag, Space, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DonHang } from '@/services/Order/order';
import { TrangThaiDonHang } from '@/services/Order/order';
import OrderForm from './components/OrderForm';

const { confirm } = Modal;

const QuanLyDonHang: React.FC = () => {
	const {
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
	} = useModel('order');

	const [searchText, setSearchText] = useState<string>('');
	const [filterTrangThai, setFilterTrangThai] = useState<string | undefined>(undefined);

	useEffect(() => {
		loadDonHang();
		loadSanPham();
		loadKhachHang();
	}, []);

	const getTrangThaiColor = (trangThai: string) => {
		switch (trangThai) {
			case TrangThaiDonHang.CHO_XAC_NHAN:
				return 'orange';
			case TrangThaiDonHang.DANG_GIAO:
				return 'blue';
			case TrangThaiDonHang.HOAN_THANH:
				return 'green';
			case TrangThaiDonHang.HUY:
				return 'red';
			default:
				return 'default';
		}
	};

	const handleHuyDonHang = (record: DonHang) => {
		if (record.trangThai !== TrangThaiDonHang.CHO_XAC_NHAN) {
			message.error('Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"!');
			return;
		}
		confirm({
			title: 'Xác nhận hủy đơn hàng',
			icon: <ExclamationCircleOutlined />,
			content: `Bạn có chắc chắn muốn hủy đơn hàng ${record.maDonHang}?`,
			okText: 'Hủy đơn',
			okType: 'danger',
			cancelText: 'Không',
			onOk() {
				const result = huy(record.maDonHang);
				if (result) {
					message.success('Hủy đơn hàng thành công!');
				} else {
					message.error('Hủy đơn hàng thất bại!');
				}
			},
		});
	};

	const handleSubmit = (donHang: DonHang) => {
		if (isEdit) {
			capNhat(donHang);
			message.success('Cập nhật đơn hàng thành công!');
		} else {
			const result = themMoi(donHang);
			if (result) {
				message.success('Thêm đơn hàng thành công!');
			} else {
				message.error('Mã đơn hàng đã tồn tại!');
				return;
			}
		}
		setVisible(false);
		setRow(undefined);
	};

	const danhSachHienThi = danhSachDonHang.filter((donHang: DonHang) => {
		const matchSearch =
			!searchText ||
			donHang.maDonHang.toLowerCase().includes(searchText.toLowerCase()) ||
			donHang.tenKhachHang.toLowerCase().includes(searchText.toLowerCase());

		const matchTrangThai = !filterTrangThai || donHang.trangThai === filterTrangThai;

		return matchSearch && matchTrangThai;
	});

	const columns = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'maDonHang',
			key: 'maDonHang',
			width: 140,
		},
		{
			title: 'Khách hàng',
			dataIndex: 'tenKhachHang',
			key: 'tenKhachHang',
			width: 160,
		},
		{
			title: 'Ngày đặt hàng',
			dataIndex: 'ngayDatHang',
			key: 'ngayDatHang',
			width: 160,
			sorter: (a: DonHang, b: DonHang) =>
				new Date(a.ngayDatHang).getTime() - new Date(b.ngayDatHang).getTime(),
			render: (val: string) => new Date(val).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'tongTien',
			key: 'tongTien',
			width: 140,
			sorter: (a: DonHang, b: DonHang) => a.tongTien - b.tongTien,
			render: (val: number) => `${val.toLocaleString()}đ`,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 140,
			render: (val: string) => <Tag color={getTrangThaiColor(val)}>{val}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 200,
			render: (_: any, record: DonHang) => (
				<Space>
					<Button
						type="primary"
						size="small"
						onClick={() => {
							setRow(record);
							setIsEdit(true);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Button
						danger
						size="small"
						disabled={record.trangThai !== TrangThaiDonHang.CHO_XAC_NHAN}
						onClick={() => handleHuyDonHang(record)}
					>
						Hủy đơn
					</Button>
				</Space>
			),
		},
	];

	return (
		<Card title="Quản lý đơn hàng">
			<Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
				<Space>
					<Input
						placeholder="Tìm theo mã đơn hoặc khách hàng"
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 280 }}
						allowClear
					/>
					<Select
						placeholder="Lọc trạng thái"
						value={filterTrangThai}
						onChange={(value) => setFilterTrangThai(value)}
						style={{ width: 180 }}
						allowClear
					>
						{Object.values(TrangThaiDonHang).map((tt) => (
							<Select.Option key={tt} value={tt}>
								{tt}
							</Select.Option>
						))}
					</Select>
				</Space>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => {
						setIsEdit(false);
						setRow(undefined);
						setVisible(true);
					}}
				>
					Thêm đơn hàng
				</Button>
			</Space>

			<Table
				dataSource={danhSachHienThi}
				columns={columns}
				rowKey="maDonHang"
				pagination={{ pageSize: 10 }}
			/>

			<OrderForm
				visible={visible}
				isEdit={isEdit}
				row={row}
				danhSachSanPham={danhSachSanPham}
				danhSachKhachHang={danhSachKhachHang}
				danhSachDonHang={danhSachDonHang}
				onCancel={() => {
					setVisible(false);
					setRow(undefined);
				}}
				onSubmit={handleSubmit}
			/>
		</Card>
	);
};

export default QuanLyDonHang;
