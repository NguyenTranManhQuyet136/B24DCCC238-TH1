import React, { useState } from 'react';
import { Table, Button, Modal, Select, message } from 'antd';
import { useModel } from 'umi';
import { SwapOutlined } from '@ant-design/icons';
import { RegistrationStatus } from '@/models/clb';

const MemberTable: React.FC = () => {
	const { registrations, setRegistrations, clubs } = useModel('clb' as any);
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [targetClubId, setTargetClubId] = useState<string>('');

	const members = registrations.filter((r: any) => r.status === RegistrationStatus.APPROVED);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleChangeClub = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn thành viên cần chuyển CLB');
			return;
		}
		setIsModalVisible(true);
	};

	const processChange = () => {
		if (!targetClubId) {
			message.error('Vui lòng chọn câu lạc bộ đích');
			return;
		}

		const updatedRegistrations = registrations.map((reg: any) => {
			if (selectedRowKeys.includes(reg.id)) {
				return { ...reg, clubId: targetClubId };
			}
			return reg;
		});

		setRegistrations(updatedRegistrations);
		message.success(`Đã chuyển ${selectedRowKeys.length} thành viên sang câu lạc bộ mới`);
		setIsModalVisible(false);
		setSelectedRowKeys([]);
		setTargetClubId('');
	};

	const columns = [
		{ title: 'Họ tên', dataIndex: 'fullName' },
		{ title: 'Email', dataIndex: 'email' },
		{ title: 'SĐT', dataIndex: 'phone' },
		{ title: 'Giới tính', dataIndex: 'gender' },
		{ title: 'Địa chỉ', dataIndex: 'address' },
		{
			title: 'Câu lạc bộ hiện tại',
			dataIndex: 'clubId',
			render: (clubId: string) => clubs.find((c: any) => c.id === clubId)?.name || 'N/A',
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Button
					type="primary"
					icon={<SwapOutlined />}
					onClick={handleChangeClub}
					disabled={selectedRowKeys.length === 0}
				>
					Chuyển CLB cho {selectedRowKeys.length} thành viên
				</Button>
			</div>
			<Table
				rowSelection={rowSelection}
				columns={columns}
				dataSource={members}
				rowKey="id"
			/>

			<Modal
				title="Chuyển câu lạc bộ"
				visible={isModalVisible}
				onOk={processChange}
				onCancel={() => setIsModalVisible(false)}
			>
				<p>Bạn đang thực hiện chuyển câu lạc bộ cho {selectedRowKeys.length} thành viên.</p>
				<p>Chọn câu lạc bộ muốn chuyển đến:</p>
				<Select
					style={{ width: '100%' }}
					placeholder="Chọn câu lạc bộ"
					value={targetClubId}
					onChange={setTargetClubId}
				>
					{clubs.map((club: any) => (
						<Select.Option key={club.id} value={club.id}>{club.name}</Select.Option>
					))}
				</Select>
			</Modal>
		</div>
	);
};

export default MemberTable;
