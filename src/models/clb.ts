import { useState } from 'react';

export enum RegistrationStatus {
	PENDING = 'Pending',
	APPROVED = 'Approved',
	REJECTED = 'Rejected',
}

export interface HistoryItem {
	action: string;
	timestamp: string;
	admin: string;
	reason?: string;
}

export interface Club {
	id: string;
	avatar?: string;
	name: string;
	foundedDate: string;
	description: string;
	chairman: string;
	isActive: boolean;
}

export interface Registration {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	gender: 'Male' | 'Female' | 'Other';
	address: string;
	talent: string;
	clubId: string;
	reason: string;
	status: RegistrationStatus;
	note?: string;
	history: HistoryItem[];
}

export default () => {
	const [clubs, setClubs] = useState<Club[]>([
		{
			id: '1',
			name: 'CLB Guitar',
			foundedDate: '2020-01-01',
			description: '<p>Câu lạc bộ dành cho những người yêu thích Guitar.</p>',
			chairman: 'Nguyễn Văn A',
			isActive: true,
			avatar: 'https://via.placeholder.com/150',
		},
		{
			id: '2',
			name: 'CLB Bóng Đá',
			foundedDate: '2019-05-20',
			description: '<p>Câu lạc bộ bóng đá sinh viên.</p>',
			chairman: 'Trần Thị B',
			isActive: true,
			avatar: 'https://via.placeholder.com/150',
		},
	]);

	const [registrations, setRegistrations] = useState<Registration[]>([
		{
			id: 'r1',
			fullName: 'Lê Văn C',
			email: 'levanc@example.com',
			phone: '0987654321',
			gender: 'Male',
			address: 'Hà Nội',
			talent: 'Chơi đàn',
			clubId: '1',
			reason: 'Em rất thích âm nhạc.',
			status: RegistrationStatus.PENDING,
			history: [],
		},
		{
			id: 'r2',
			fullName: 'Phạm Thị D',
			email: 'phamthid@example.com',
			phone: '0123456789',
			gender: 'Female',
			address: 'TP.HCM',
			talent: 'Đá bóng',
			clubId: '2',
			reason: 'Em muốn rèn luyện thể lực.',
			status: RegistrationStatus.APPROVED,
			history: [
				{
					action: 'Approved',
					timestamp: '2025-04-09 17:00',
					admin: 'Admin',
				},
			],
		},
	]);

	return {
		clubs,
		setClubs,
		registrations,
		setRegistrations,
	};
};
