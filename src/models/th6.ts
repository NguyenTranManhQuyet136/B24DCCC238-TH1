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
				image: 'https://images.unsplash.com/photo-1596711516024-5d5e56e4c767?auto=format&fit=crop&q=80&w=400',
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
				image: 'https://images.unsplash.com/photo-1549488344-c711a196e811?auto=format&fit=crop&q=80&w=400',
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
				image: 'https://images.unsplash.com/photo-1559404221-db9b09a96ea8?auto=format&fit=crop&q=80&w=400',
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
				image: 'https://images.unsplash.com/photo-1601633512217-4ac9f90be0d8?auto=format&fit=crop&q=80&w=400',
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
