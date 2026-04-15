export default {
	namespace: 'th6',
	state: {
		destinations: [
			{
				id: 1,
				name: 'Vịnh Hạ Long',
				type: 'bien',
				price_food: 500000,
				price_accom: 1200000,
				price_travel: 300000,
				time: '2 ngày',
				rating: 5,
				image: 'https://cdn-media.sforum.vn/storage/app/media/ctv_seo3/anh-vinh-ha-long-thumbnail.jpg',
				desc: 'Kỳ quan thiên nhiên thế giới'
			},
			{
				id: 2,
				name: 'Sapa',
				type: 'nui',
				price_food: 400000,
				price_accom: 800000,
				price_travel: 500000,
				time: '3 ngày',
				rating: 4.5,
				image: 'https://www.luavietours.com/wp/wp-content/uploads/2024/10/1-canh-dep-sapa-luon-dua-du-khach-tu-bat-ngo-nay-den-bat-ngo-khac-750x499.jpg',
				desc: 'Thành phố mờ sương'
			},
			{
				id: 3,
				name: 'Đà Nẵng',
				type: 'thanhpho',
				price_food: 600000,
				price_accom: 1000000,
				price_travel: 200000,
				time: '4 ngày',
				rating: 4.8,
				image: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Knms/meo-vat/avatar-trai-nghiem-24-dia-diem-du-lich-da-nang.jpg',
				desc: 'Thành phố đáng sống'
			},
			{
				id: 4,
				name: 'Phú Quốc',
				type: 'bien',
				price_food: 800000,
				price_accom: 2000000,
				price_travel: 400000,
				time: '3 ngày',
				rating: 4.9,
				image: 'https://statics.vntrip.vn/data-v2/data-guide/img_content/1470302452_anh-5.jpg',
				desc: 'Đảo ngọc xanh mát'
			}
		],
		itinerary: [], // { day: 1, destId: 1 }
		budgetLimit: 10000000, // 10 triệu
	},
	reducers: {
		// code bẩn: truyền thẳng type thay vì tách const, đặt tên hàm lộn xộn
		capNhatDiemDen(state: any, action: any) {
			let tmp = [...state.destinations]; // dùng let thay vì const
			let isExist = false;
			for (let i = 0; i < tmp.length; i++) {
				if (tmp[i].id === action.payload.id) {
					tmp[i] = action.payload;
					isExist = true;
				}
			}
			if (!isExist) {
				tmp.push(action.payload);
			}
			return {
				...state,
				destinations: tmp,
			};
		},
		xoaDiemDen(state: any, action: any) {
			let arr = state.destinations.filter((item: any) => item.id !== action.payload);
			return {
				...state,
				destinations: arr
			}
		},
		themVaoLichTrinh(state: any, action: any) {
			let newItin = [...state.itinerary];
			newItin.push({ id: Math.random(), day: action.payload.day, destId: action.payload.destId });
			return { ...state, itinerary: newItin };
		},
		xoaKhoiLichTrinh(state: any, action: any) {
			let a = state.itinerary.filter((x: any) => x.id !== action.payload);
			return { ...state, itinerary: a };
		},
		setNganSach(state: any, action: any) {
			return { ...state, budgetLimit: action.payload };
		}
	},
	effects: {
		// Thường năm nhất sinh viên ít dùng effect rườm rà, chủ yếu call api nhưng bài này không có api
	}
};
