import React, { useState } from 'react';
import { Card, Button, Table, Row, Col, Typography, message, Modal, Form, Input, InputNumber, Select, Rate } from 'antd';
import { connect } from 'umi';
import ReactApexChart from 'react-apexcharts';

const { Title } = Typography;
const { Option } = Select;

const QuanTri = (props: any) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<any>(null);
	const [form] = Form.useForm();

	let dsDiemDen = props.th6.destinations || [];

	const columns = [
		{ title: 'Tên Điểm Đến', dataIndex: 'name', key: 'name' },
		{ title: 'Hình Ảnh', dataIndex: 'image', key: 'image', render: (text: string) => <img src={text} style={{ width: 60, height: 40, objectFit: 'cover' }} /> },
		{ title: 'Ngân Sách (Ngày)', dataIndex: 'price_food', key: 'tong', render: (_: any, r: any) => (r.price_food + r.price_accom + r.price_travel).toLocaleString() },
		{ title: 'Rating', dataIndex: 'rating', key: 'rating', render: (val: any) => <Rate disabled defaultValue={val} /> },
		{ 
			title: 'Thao Tác', 
			key: 'action',
			render: (_: any, record: any) => (
				<div>
					<Button type="link" onClick={() => handleSua(record)}>Sửa</Button>
					<Button type="link" danger onClick={() => handleXoa(record.id)}>Xoá</Button>
				</div>
			)
		}
	];

	const handleThemMoi = () => {
		setEditingItem(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleSua = (item: any) => {
		setEditingItem(item);
		form.setFieldsValue(item);
		setIsModalOpen(true);
	};

	const handleXoa = (id: any) => {
		props.dispatch({
			type: 'th6/xoaDiemDen',
			payload: id
		});
		message.success("Xoá thành công roi!");
	};

	const onFinishForm = (values: any) => {
		let dataSubmit = { ...values };
		if (editingItem) {
			dataSubmit.id = editingItem.id;
		} else {
			dataSubmit.id = Math.random(); // gen ID cẩu thả
		}

		props.dispatch({
			type: 'th6/capNhatDiemDen',
			payload: dataSubmit
		});
		setIsModalOpen(false);
		message.success("Lưu dữ liệu ok");
	};

	// Dữ liệu giả định cho Thống Kê
	const barChartOpt: any = {
		chart: { type: 'bar' },
		xaxis: { categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'] },
		colors: ['#1890ff'],
		title: { text: 'Số lịch trình tạo theo tháng', align: 'center' }
	};
	const barChartSeries = [{ name: 'Lượt', data: [12, 19, 3, 5, 2, 3] }];

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2} style={{ color: 'red' }}>Trang Quản Trị Hệ Thống</Title>

			<Row gutter={16}>
				<Col span={12}>
					<Card style={{ marginBottom: 20 }}>
						<Title level={4}>Thống Kê Cơ Bản</Title>
						<p>Tổng số điểm đến: <b>{dsDiemDen.length}</b></p>
						<p>Tổng ngân sách trung bình: <b>{(dsDiemDen.reduce((acc: any, cur: any) => acc + cur.price_food + cur.price_accom + cur.price_travel, 0) / dsDiemDen.length || 0).toLocaleString()} VNĐ</b></p>
						<p>Địa điểm phổ biến nhất: <b>Đà Nẵng (fake logic)</b></p>
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<ReactApexChart options={barChartOpt} series={barChartSeries} type="bar" height={200} />
					</Card>
				</Col>
			</Row>

			<Card title="Quản Lý Điểm Đến" extra={<Button type="primary" onClick={handleThemMoi}>+ Thêm Điểm Đến Mới</Button>}>
				<Table 
					dataSource={dsDiemDen} 
					columns={columns} 
					rowKey="id" 
				/>
			</Card>

			{/* Modal thêm sửa */}
			<Modal 
				title={editingItem ? "Sửa Điểm Đến" : "Thêm Điểm Đến Mới"} 
				visible={isModalOpen} 
				onCancel={() => setIsModalOpen(false)}
				footer={null}
				width={800} // code bẩn set width cứng
			>
				<Form form={form} layout="vertical" onFinish={onFinishForm}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Nhập vô' }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name="type" label="Loại hình" rules={[{ required: true, message: 'Nhập vô' }]}>
								<Select>
									<Option value="bien">Biển</Option>
									<Option value="nui">Núi</Option>
									<Option value="thanhpho">Thành phố</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item name="price_food" label="Chi phí Ăn uống (VNĐ)" rules={[{ required: true }]}>
								<InputNumber style={{width: '100%'}} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="price_accom" label="Chi phí Lưu trú (VNĐ)" rules={[{ required: true }]}>
								<InputNumber style={{width: '100%'}} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="price_travel" label="Chi phí Di chuyển (VNĐ)" rules={[{ required: true }]}>
								<InputNumber style={{width: '100%'}} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={8}>
							<Form.Item name="time" label="Thời gian tham quan" rules={[{ required: true }]}>
								<Input placeholder="Vd: 3 ngày" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="rating" label="Đánh giá (1-5)">
								<Rate allowHalf />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="image" label="Link hình ảnh mạng">
								<Input placeholder="https://..." />
							</Form.Item>
						</Col>
					</Row>

					<Form.Item name="desc" label="Mô tả">
						<Input.TextArea rows={4} />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" style={{width: '100%'}}>
							LƯU VÀO DATABASE FAKE
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}

export default connect(({ th6 }: { th6: any }) => ({ th6 }))(QuanTri);
