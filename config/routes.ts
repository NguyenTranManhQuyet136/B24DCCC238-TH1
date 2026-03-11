export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/bai-tap/guess-number',
		name: 'Guess Number',
		component: './BaiTap/GuessNumber',
		icon: 'NumberOutlined',
	},
	{
		path: '/bai-tap/todo-list',
		name: 'Todo List',
		component: './BaiTap/TodoList',
		icon: 'OrderedListOutlined',
	},
	{
		path: '/oan-tu-ti',
		name: 'Oẳn Tù Tì',
		component: './OanTuTi',
		icon: 'ScissorOutlined',
	},
	{
		path: '/bai-2',
		name: 'Bài 2',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-2/khoi-kien-thuc',
				name: 'Khối Kiến Thức',
				component: './KhoiKienThuc',
			},
			{
				path: '/bai-2/mon-hoc',
				name: 'Môn Học',
				component: './MonHoc',
			},
			{
				path: '/bai-2/cau-hoi',
				name: 'Câu Hỏi',
				component: './CauHoi',
			},
			{
				path: '/bai-2/de-thi',
				name: 'Đề Thi',
				component: './DeThi',
			},
		],
	},
	{
		path: '/bai-3',
		name: 'Bài 3',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/bai-3/nhan-vien',
				name: 'Nhân Viên',
				component: './NhanVien',
			},
			{
				path: '/bai-3/dich-vu',
				name: 'Dịch Vụ',
				component: './DichVu',
			},
			{
				path: '/bai-3/lich-hen',
				name: 'Lịch Hẹn',
				component: './LichHen',
			},
			{
				path: '/bai-3/danh-gia',
				name: 'Đánh Giá',
				component: './DanhGia',
			},
			{
				path: '/bai-3/thong-ke',
				name: 'Thống Kê',
				component: './ThongKe',
			},
		],
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
