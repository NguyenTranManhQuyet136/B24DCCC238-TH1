import React, { useState } from 'react';
import { Card, Button, Select, Table, InputNumber, Row, Col, Typography, message, Alert } from 'antd';
import { connect } from 'umi';

const { Title, Text } = Typography;
const { Option } = Select;

const LichTrinh = (props: any) => {
	const [dayInput, setDayInput] = useState<any>(1);
	const [destSelect, setDestSelect] = useState<any>(null);

	// lấy data từ state chung
	let dsDiemDen = props.th6.destinations || [];
	let lTrinh = props.th6.itinerary || [];

	// group by day để hiển thị
	let byDay: any = {};
	for(let i=0; i < lTrinh.length; i++) {
		let day = lTrinh[i].day;
		if(!byDay[day]) byDay[day] = [];
		byDay[day].push(lTrinh[i]);
	}

	const handleThem = () => {
		if(!destSelect) {
			message.warning('Chọn điểm đến đi đã bạn ơi');
			return;
		}
		props.dispatch({
			type: 'th6/themVaoLichTrinh',
			payload: { day: dayInput, destId: destSelect }
		});
		message.success("Thêm thành công!");
	}

	const handleXoa = (id: any) => {
		props.dispatch({
			type: 'th6/xoaKhoiLichTrinh',
			payload: id
		});
	}

	// mảng chứa các ngày duy nhất để in ra giao diện
	let daysToRender = Object.keys(byDay).sort((a: any, b: any) => a - b);
	
	let tongTatCaTien = 0;
	let tongThoiGian = 0;

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2}>Quản Lý Lịch Trình</Title>

			<Card title="Thêm vào lịch trình" style={{ marginBottom: 20 }}>
				<Row gutter={16}>
					<Col span={8}>
						<Text>Ngày thứ:</Text>
						<InputNumber min={1} defaultValue={1} onChange={(val) => setDayInput(val)} style={{ width: '100%', marginTop: '5px' }} />
					</Col>
					<Col span={10}>
						<Text>Chọn điểm đến:</Text>
						<Select style={{ width: '100%', marginTop: '5px' }} onChange={(val) => setDestSelect(val)} placeholder="Chọn ở đây...">
							{dsDiemDen.map((item: any) => (
								<Option key={item.id} value={item.id}>{item.name}</Option>
							))}
						</Select>
					</Col>
					<Col span={6}>
						<Button type="primary" onClick={handleThem} style={{ marginTop: '25px', width: '100%' }}>THÊM</Button>
					</Col>
				</Row>
			</Card>

			{/* Hiển thị lịch trình từng ngày */}
			{daysToRender.length === 0 ? <p style={{color: 'gray'}}>Chưa có lịch trình, hãy thêm ở trên.</p> : null}

			{daysToRender.map((dayNum: any) => {
				let list = byDay[dayNum];
				let tongTienNgay = 0;
				let thoiGianNgay = 0; // tính bằng số đếm tạm
				
				let rows = list.map((l: any, idx: number) => {
					// tìm thông tin điểm đến
					let dest = dsDiemDen.find((d: any) => d.id === l.destId);
					if(!dest) return null;

					let total = dest.price_food + dest.price_accom + dest.price_travel;
					tongTienNgay += total;
					thoiGianNgay += parseInt(dest.time) || 1; // parse lỗi thì gán = 1, code cẩu thả xíu
					tongTatCaTien += total;
					tongThoiGian += thoiGianNgay;
					
					return {
						key: l.id,
						stt: idx + 1,
						name: dest.name,
						price: total.toLocaleString() + ' đ',
						action: <Button danger size="small" onClick={() => handleXoa(l.id)}>Xóa</Button>
					}
				});

				const cols = [
					{ title: 'STT', dataIndex: 'stt', key: 'stt' },
					{ title: 'Tên Điểm Đến', dataIndex: 'name', key: 'name' },
					{ title: 'Chi phí ước tính', dataIndex: 'price', key: 'price' },
					{ title: 'Thao tác', dataIndex: 'action', key: 'action' },
				]

				return (
					<Card key={dayNum} title={`Lịch trình Ngày ${dayNum}`} style={{ marginBottom: 15 }} type="inner">
						<Table dataSource={rows} columns={cols} pagination={false} />
						<div style={{ marginTop: '10px', fontWeight: 'bold' }}>
							Tổng tiền ngày {dayNum}: <span style={{ color: 'red' }}>{tongTienNgay.toLocaleString()} VNĐ</span>
							{/* giả lập thời gian di chuyển 2 điểm là 2h */}
							<br /> Thời gian tham quan & di chuyển: khoảng {list.length * 2 + thoiGianNgay} giờ
						</div>
					</Card>
				)
			})}

			{daysToRender.length > 0 && (
				<Alert 
					message={`TỔNG CHI PHÍ TẤT CẢ CÁC NGÀY: ${tongTatCaTien.toLocaleString()} VNĐ`} 
					type="info" 
					showIcon 
					style={{ marginTop: 20, fontSize: '16px', fontWeight: 'bold' }} 
				/>
			)}
		</div>
	)
}

export default connect(({ th6 }: { th6: any }) => ({ th6 }))(LichTrinh);
