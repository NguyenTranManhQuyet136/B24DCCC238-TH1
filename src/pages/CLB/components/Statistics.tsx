import React from 'react';
import { Card, Row, Col, Statistic, Button, message } from 'antd';
import { useModel } from 'umi';
import Chart from 'react-apexcharts';
import * as XLSX from 'xlsx';
import { DownloadOutlined, ClubOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RegistrationStatus } from '@/models/clb';

const Statistics: React.FC = () => {
	const { registrations, clubs } = useModel('clb');

	const pendingCount = registrations.filter((r) => r.status === RegistrationStatus.PENDING).length;
	const approvedCount = registrations.filter((r) => r.status === RegistrationStatus.APPROVED).length;
	const rejectedCount = registrations.filter((r) => r.status === RegistrationStatus.REJECTED).length;

	const exportToExcel = () => {
		const approvedMembers = registrations.filter((r) => r.status === RegistrationStatus.APPROVED);
		
		const data = approvedMembers.map((m) => ({
			'Họ tên': m.fullName,
			'Email': m.email,
			'SĐT': m.phone,
			'Giới tính': m.gender,
			'Địa chỉ': m.address,
			'Câu lạc bộ': clubs.find((c) => c.id === m.clubId)?.name || 'N/A',
			'Sở trường': m.talent,
		}));

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Thành viên');
		XLSX.writeFile(workbook, 'DanhSachThanhVien.xlsx');
		message.success('Xuất file Excel thành công');
	};

	// Chuẩn bị dữ liệu cho biểu đồ
	const chartOptions: any = {
		chart: {
			type: 'bar',
			height: 350,
			stacked: false,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
				endingShape: 'rounded',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		xaxis: {
			categories: clubs.map((c) => c.name),
		},
		yaxis: {
			title: {
				text: 'Số lượng đơn',
			},
		},
		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter: (val: number) => val + ' đơn',
			},
		},
	};

	const chartSeries = [
		{
			name: 'Pending',
			data: clubs.map((club) => registrations.filter((r) => r.clubId === club.id && r.status === RegistrationStatus.PENDING).length),
			color: '#1890ff',
		},
		{
			name: 'Approved',
			data: clubs.map((club) => registrations.filter((r) => r.clubId === club.id && r.status === RegistrationStatus.APPROVED).length),
			color: '#52c41a',
		},
		{
			name: 'Rejected',
			data: clubs.map((club) => registrations.filter((r) => r.clubId === club.id && r.status === RegistrationStatus.REJECTED).length),
			color: '#ff4d4f',
		},
	];

	return (
		<div>
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic title="Số câu lạc bộ" value={clubs.length} prefix={<span style={{marginRight: 8}}>🏢</span>} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đang chờ duyệt" value={pendingCount} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đã duyệt" value={approvedCount} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Đã từ chối" value={rejectedCount} valueStyle={{ color: '#ff4d4f' }} prefix={<CloseCircleOutlined />} />
					</Card>
				</Col>
			</Row>

			<Card title="Thống kê đơn đăng ký theo từng CLB" extra={<Button type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>Xuất XLSX</Button>}>
				<Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
			</Card>
		</div>
	);
};

export default Statistics;
