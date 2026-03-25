import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Input, Avatar } from 'antd';
import { useModel } from 'umi';
import { EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import ClubForm from './ClubForm';
import { Club } from '@/models/clb';

const ClubTable: React.FC = () => {
	const { clubs, setClubs } = useModel('clb' as any);
	const [visible, setVisible] = useState(false);
	const [editingClub, setEditingClub] = useState<Club | null>(null);
	const [searchText, setSearchText] = useState('');

	const handleAdd = () => {
		setEditingClub(null);
		setVisible(true);
	};

	const handleEdit = (record: Club) => {
		setEditingClub(record);
		setVisible(true);
	};

	const handleDelete = (id: string) => {
		setClubs(clubs.filter((club) => club.id !== id));
		message.success('Xóa câu lạc bộ thành công');
	};

	const handleSave = (club: Club) => {
		if (editingClub) {
			setClubs(clubs.map((c) => (c.id === club.id ? club : c)));
			message.success('Cập nhật câu lạc bộ thành công');
		} else {
			setClubs([...clubs, club]);
			message.success('Thêm mới câu lạc bộ thành công');
		}
		setVisible(false);
	};

	const filteredClubs = clubs.filter((club) =>
		club.name.toLowerCase().includes(searchText.toLowerCase()) ||
		club.chairman.toLowerCase().includes(searchText.toLowerCase())
	);

	const columns = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'avatar',
			render: (text: string) => <Avatar src={text} shape="square" size={64} icon={<UserOutlined />} />,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'name',
			sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'foundedDate',
			sorter: (a: Club, b: Club) => a.foundedDate.localeCompare(b.foundedDate),
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chairman',
			sorter: (a: Club, b: Club) => a.chairman.localeCompare(b.chairman),
		},
		{
			title: 'Hoạt động',
			dataIndex: 'isActive',
			render: (val: boolean) => (val ? 'Có' : 'Không'),
		},
		{
			title: 'Thao tác',
			render: (_: any, record: Club) => (
				<Space>
					<Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
					<Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
						<Button icon={<DeleteOutlined />} danger>Xóa</Button>
					</Popconfirm>
					<Button icon={<UserOutlined />}>Xem thành viên</Button>
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
				<Button type="primary" onClick={handleAdd}>Thêm mới</Button>
				<Input
					placeholder="Tìm kiếm theo tên CLB hoặc chủ nhiệm"
					style={{ width: 300 }}
					prefix={<SearchOutlined />}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>
			<Table
				columns={columns}
				dataSource={filteredClubs}
				rowKey="id"
				pagination={{ pageSize: 5 }}
			/>
			<ClubForm
				visible={visible}
				onCancel={() => setVisible(false)}
				onSave={handleSave}
				editingClub={editingClub}
			/>
		</div>
	);
};

export default ClubTable;
