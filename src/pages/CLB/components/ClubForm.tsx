import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Switch, message } from 'antd';
import moment from 'moment';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { Club } from '@/models/clb';

interface ClubFormProps {
	visible: boolean;
	onCancel: () => void;
	onSave: (values: Club) => void;
	editingClub?: Club | null;
}

const ClubForm: React.FC<ClubFormProps> = ({ visible, onCancel, onSave, editingClub }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		if (editingClub) {
			form.setFieldsValue({
				...editingClub,
				foundedDate: editingClub.foundedDate ? moment(editingClub.foundedDate) : null,
				avatar: editingClub.avatar ? { fileList: [{ url: editingClub.avatar, status: 'done', uid: '-1', name: 'avatar' }] } : null,
			});
		} else {
			form.resetFields();
		}
	}, [editingClub, visible]);

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			const clubData: Club = {
				...values,
				id: editingClub?.id || Math.random().toString(36).substr(2, 9),
				foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : '',
				avatar: values.avatar?.fileList?.[0]?.url || values.avatar?.fileList?.[0]?.thumbUrl || '',
			};
			onSave(clubData);
			form.resetFields();
		} catch (error) {
			console.error('Validate Failed:', error);
		}
	};

	return (
		<Modal
			title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
			visible={visible}
			onOk={handleOk}
			onCancel={onCancel}
			width={800}
			okText="Lưu"
			cancelText="Hủy"
		>
			<Form form={form} layout="vertical">
				<Form.Item name="avatar" label="Ảnh đại diện">
					<UploadFile isAvatar buttonDescription="Tải ảnh lên" />
				</Form.Item>
				<Form.Item name="name" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}>
					<Input />
				</Form.Item>
				<Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}>
					<DatePicker style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name="chairman" label="Chủ nhiệm CLB" rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}>
					<Input />
				</Form.Item>
				<Form.Item name="isActive" label="Hoạt động" valuePropName="checked" initialValue={true}>
					<Switch />
				</Form.Item>
				<Form.Item name="description" label="Mô tả">
					<TinyEditor height={300} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ClubForm;
