import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Input, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import { CheckOutlined, CloseOutlined, EditOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Registration, RegistrationStatus } from '@/models/clb';

const RegistrationTable: React.FC = () => {
	const { registrations, setRegistrations, clubs } = useModel('clb' as any);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [actionType, setActionType] = useState<'Approve' | 'Reject'>('Approve');
	const [rejectReason, setRejectReason] = useState('');
	const [historyVisible, setHistoryVisible] = useState(false);
	const [currentHistory, setCurrentHistory] = useState<any[]>([]);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleBulkAction = (type: 'Approve' | 'Reject') => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
			return;
		}
		setActionType(type);
		setIsModalVisible(true);
	};

	const processAction = () => {
		if (actionType === 'Reject' && !rejectReason) {
			message.error('Vui lòng nhập lý do từ chối');
			return;
		}

		const now = moment().format('HH:mm DD/MM/YYYY');
		const updatedRegistrations = registrations.map((reg: any) => {
			if (selectedRowKeys.includes(reg.id)) {
				const newHistory = [
					...reg.history,
					{
						action: actionType === 'Approve' ? 'Approved' : 'Rejected',
						timestamp: now,
						admin: 'Admin',
						reason: actionType === 'Reject' ? rejectReason : undefined,
					},
				];
				return {
					...reg,
					status: actionType === 'Approve' ? RegistrationStatus.APPROVED : RegistrationStatus.REJECTED,
					history: newHistory,
					note: actionType === 'Reject' ? rejectReason : reg.note,
				};
			}
			return reg;
		});

		setRegistrations(updatedRegistrations);
		message.success(`${actionType === 'Approve' ? 'Duyệt' : 'Từ chối'} ${selectedRowKeys.length} đơn thành công`);
		setIsModalVisible(false);
		setSelectedRowKeys([]);
		setRejectReason('');
	};

	const showHistory = (history: any[]) => {
		setCurrentHistory(history);
		setHistoryVisible(true);
	};

	const columns = [
		{ title: 'Họ tên', dataIndex: 'fullName' },
		{ title: 'Email', dataIndex: 'email' },
		{ title: 'SĐT', dataIndex: 'phone' },
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubId',
			render: (clubId: string) => clubs.find((c: any) => c.id === clubId)?.name || 'N/A',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (status: RegistrationStatus) => {
				let color = 'blue';
				if (status === RegistrationStatus.APPROVED) color = 'green';
				if (status === RegistrationStatus.REJECTED) color = 'red';
				return <Tag color={color}>{status}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			render: (_: any, record: Registration) => (
				<Space>
					<Tooltip title="Xem lịch sử">
						<Button icon={<HistoryOutlined />} onClick={() => showHistory(record.history)} />
					</Tooltip>
					<Button icon={<EditOutlined />}>Sửa</Button>
					<Popconfirm title="Xóa đơn này?" onConfirm={() => {
						setRegistrations(registrations.filter((r: any) => r.id !== record.id));
						message.success('Đã xóa đơn đăng ký');
					}}>
						<Button icon={<DeleteOutlined />} danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Space>
					<Button
						type="primary"
						icon={<CheckOutlined />}
						onClick={() => handleBulkAction('Approve')}
						disabled={selectedRowKeys.length === 0}
					>
						Duyệt {selectedRowKeys.length} đơn đã chọn
					</Button>
					<Button
						danger
						icon={<CloseOutlined />}
						onClick={() => handleBulkAction('Reject')}
						disabled={selectedRowKeys.length === 0}
					>
						Từ chối {selectedRowKeys.length} đơn đã chọn
					</Button>
				</Space>
			</div>
			<Table
				rowSelection={rowSelection}
				columns={columns}
				dataSource={registrations}
				rowKey="id"
			/>

			<Modal
				title={actionType === 'Approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
				visible={isModalVisible}
				onOk={processAction}
				onCancel={() => setIsModalVisible(false)}
			>
				<p>Bạn có chắc chắn muốn {actionType === 'Approve' ? 'duyệt' : 'từ chối'} {selectedRowKeys.length} đơn đã chọn?</p>
				{actionType === 'Reject' && (
					<Input.TextArea
						placeholder="Nhập lý do từ chối (bắt buộc)"
						value={rejectReason}
						onChange={(e) => setRejectReason(e.target.value)}
						rows={4}
					/>
				)}
			</Modal>

			<Modal
				title="Lịch sử thao tác"
				visible={historyVisible}
				onCancel={() => setHistoryVisible(false)}
				footer={null}
			>
				<ul style={{ padding: 0 }}>
					{currentHistory.map((item, index) => (
						<li key={index} style={{ marginBottom: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
							<div><strong>Action:</strong> {item.action}</div>
							<div><strong>Time:</strong> {item.timestamp}</div>
							<div><strong>Admin:</strong> {item.admin}</div>
							{item.reason && <div><strong>Reason:</strong> {item.reason}</div>}
						</li>
					))}
					{currentHistory.length === 0 && <p>Chưa có lịch sử thao tác.</p>}
				</ul>
			</Modal>
		</div>
	);
};

export default RegistrationTable;
