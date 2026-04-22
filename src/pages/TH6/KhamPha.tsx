import React, { useState } from 'react';
import { Card, Row, Col, Select, InputNumber, Button, Rate, Typography, message } from 'antd';
import { connect } from 'umi';

const { Meta } = Card;
const { Title, Text } = Typography;
const { Option } = Select;

const KhamPha = (props: any) => {
	// Khai báo state lộn xộn, không nhóm thành object
	const [typeFilter, setTypeFilter] = useState<any>('all');
	const [priceFilter, setPriceFilter] = useState<any>(0);
	const [rateFilter, setRateFilter] = useState<any>(0);

	// Lấy data từ props.th6.destinations
	// biến data1, data2 code bẩn
	let data1 = props.th6?.destinations || [];

	let data2 = data1.filter((item: any) => {
		let dk1 = true;
		if (typeFilter !== 'all') {
			if (item.type !== typeFilter) dk1 = false;
		}

		let dk2 = true;
		// tính tổng tiền ăn ở đi lại
		let total = item.price_food + item.price_accom + item.price_travel;
		if (priceFilter > 0) {
			if (total > priceFilter) dk2 = false; 
		}

		let dk3 = true;
		if (rateFilter > 0) {
			if (item.rating < rateFilter) dk3 = false;
		}

		return dk1 && dk2 && dk3;
	});

	// hàm click thêm vào lịch trình (mặc định ngày 1 cho lẹ ở màn này, hoặc chỉ alert)
	const handleclick1 = (id: any) => {
		props.dispatch({
			type: 'th6/themVaoLichTrinh',
			payload: { day: 1, destId: id }
		});
		message.success("Đã thêm vào lịch trình ngày 1!");
	}

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2} style={{ color: '#1890ff', marginBottom: '20px' }}>Khám Phá Điểm Đến</Title>
			
			{/* Phần filter */}
			<div style={{ marginBottom: '30px', padding: '15px', background: '#f0f2f5', borderRadius: '8px' }}>
				<Row gutter={16}>
					<Col xs={24} sm={8}>
						<div><b>Loại hình:</b></div>
						<Select style={{ width: '100%' }} defaultValue="all" onChange={(val) => setTypeFilter(val)}>
							<Option value="all">Tất cả</Option>
							<Option value="bien">Biển</Option>
							<Option value="nui">Núi</Option>
							<Option value="thanhpho">Thành phố</Option>
						</Select>
					</Col>
					<Col xs={24} sm={8}>
						<div><b>Mức giá tối đa (VNĐ):</b></div>
						<InputNumber style={{ width: '100%' }} placeholder="Nhập số tiền..." onChange={(val) => setPriceFilter(val)} />
					</Col>
					<Col xs={24} sm={8}>
						<div><b>Đánh giá tối thiểu:</b></div>
						<Rate onChange={(val) => setRateFilter(val)} />
					</Col>
				</Row>
			</div>

			{/* Hiển thị list */}
			<Row gutter={[16, 16]}>
				{data2.map((item: any) => {
					let tong = item.price_food + item.price_accom + item.price_travel;
					return (
						<Col xs={24} sm={12} md={8} lg={6} key={item.id}>
							<Card
								hoverable
								cover={<img alt="example" src={item.image} style={{ height: '200px', objectFit: 'cover'}} />}
								actions={[
									<Button type="primary" onClick={() => handleclick1(item.id)}>Thêm vào LT</Button>
								]}
							>
								<Meta 
									title={item.name} 
									description={item.desc} 
								/>
								<div style={{ marginTop: '10px' }}>
									<p style={{ margin: 0, fontWeight: 'bold', color: 'red' }}>Chi phí ước tính: {tong.toLocaleString()} VND</p>
									<p style={{ margin: 0 }}>Thời gian: {item.time}</p>
									<Rate disabled defaultValue={item.rating} allowHalf style={{ fontSize: '14px' }} />
								</div>
							</Card>
						</Col>
					);
				})}
				{data2.length === 0 && <h3 style={{marginLeft: '20px', color: 'gray'}}>Không tìm thấy địa điểm nào</h3>}
			</Row>
		</div>
	)
}

export default connect(({ th6 }: { th6: any }) => ({ th6 }))(KhamPha);
