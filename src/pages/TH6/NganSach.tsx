import React, { useState } from 'react';
import { Card, Button, InputNumber, Row, Col, Typography, message, Alert, Statistic } from 'antd';
import { connect } from 'umi';
import ReactApexChart from 'react-apexcharts';

const { Title } = Typography;

const NganSach = (props: any) => {
	// Khai báo state ngân sách mới
	const [newBudget, setNewBudget] = useState<any>(props.th6.budgetLimit);

	// Lấy data
	let lTrinh = props.th6.itinerary || [];
	let dsDiemDen = props.th6.destinations || [];

	// Tính chi phí các hạng mục
	let totalFood = 0;
	let totalAccom = 0;
	let totalTravel = 0;

	for(let i = 0; i < lTrinh.length; i++) {
		let item = lTrinh[i];
		let dest = dsDiemDen.find((d: any) => d.id === item.destId);
		if(dest) {
			totalFood += dest.price_food;
			totalAccom += dest.price_accom;
			totalTravel += dest.price_travel;
		}
	}

	let totalAll = totalFood + totalAccom + totalTravel;
	let budgetLimit = props.th6.budgetLimit;
	let exceed = totalAll > budgetLimit;

	// Cấu hình chart bẩn
	const chartOptions: any = {
		chart: { type: 'pie' },
		labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
		colors: ['#00E396', '#FEB019', '#FF4560'],
		legend: { position: 'bottom' }
	};
	const chartSeries = [totalFood, totalAccom, totalTravel];

	const thayDoiNganSach = () => {
		props.dispatch({
			type: 'th6/setNganSach',
			payload: newBudget
		});
		message.success("Cập nhật lại ngân sách ok");
	}

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2} style={{ color: '#13c2c2' }}>Quản Lý Ngân Sách</Title>
			
			<div style={{ marginBottom: '20px' }}>
				<Card>
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<p style={{ margin: 0, fontWeight: 'bold' }}>Ngân sách cho phép hiện hành:</p>
						<InputNumber 
							style={{ width: 200 }} 
							value={newBudget} 
							onChange={(v) => setNewBudget(v)} 
						/>
						<Button type="primary" onClick={thayDoiNganSach}>Cập Nhật Ngân Sách</Button>
					</div>
				</Card>
			</div>

			{exceed ? (
				<Alert 
					message="CẢNH BÁO: BẠN ĐÃ TIÊU VƯỢT QUÁ NGÂN SÁCH ĐỀ RA!" 
					description={`Tổng tiền: ${totalAll.toLocaleString()} đ > Ngân sách: ${budgetLimit.toLocaleString()} đ. Khuyên bạn nên xoá bớt lịch trình.`}
					type="error" 
					showIcon 
					style={{ marginBottom: 20 }}
				/>
			) : (
				<Alert 
					message="Bạn tiêu tiền như này là hợp lý" 
					description={`Vẫn còn dư: ${(budgetLimit - totalAll).toLocaleString()} đ`}
					type="success" 
					showIcon 
					style={{ marginBottom: 20 }}
				/>
			)}

			<Row gutter={16}>
				<Col xs={24} md={12}>
					<Card title="Thống Kê Con Số" bordered={false}>
						<Statistic title="Tổng Tiền Ăn Uống" value={totalFood} suffix="VND" />
						<Statistic title="Tổng Tiền Lưu Trú" value={totalAccom} suffix="VND" style={{ marginTop: 10 }} />
						<Statistic title="Tổng Tiền Di Chuyển" value={totalTravel} suffix="VND" style={{ marginTop: 10 }} />
						<Statistic title="TỔNG CHI PHÍ" value={totalAll} suffix="VND" valueStyle={{ color: 'red', fontWeight: 'bold' }} style={{ marginTop: 10 }} />
					</Card>
				</Col>
				<Col xs={24} md={12}>
					<Card title="Biểu Đồ Phân Bổ Ngân Sách" bordered={false}>
						{totalAll > 0 ? (
							<ReactApexChart options={chartOptions} series={chartSeries} type="pie" height={350} />
						) : (
							<center style={{ padding: '50px 0' }}>Chưa có gì, sao vẽ chart?</center>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	)
}

export default connect(({ th6 }: { th6: any }) => ({ th6 }))(NganSach);
