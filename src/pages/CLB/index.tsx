import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ClubTable from './components/ClubTable';
import RegistrationTable from './components/RegistrationTable';
import MemberTable from './components/MemberTable';
import Statistics from './components/Statistics';

const CLBPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState('clubs');

	return (
		<PageContainer title="Hệ thống quản lý câu lạc bộ">
			<Card>
				<Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
					<Tabs.TabPane tab="Danh sách câu lạc bộ" key="clubs">
						<ClubTable />
					</Tabs.TabPane>
					<Tabs.TabPane tab="Quản lý đơn đăng ký" key="registrations">
						<RegistrationTable />
					</Tabs.TabPane>
					<Tabs.TabPane tab="Quản lý thành viên" key="members">
						<MemberTable />
					</Tabs.TabPane>
					<Tabs.TabPane tab="Báo cáo & Thống kê" key="stats">
						<Statistics />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</PageContainer>
	);
};

export default CLBPage;
