import { useModel } from 'umi';

export default () => {
    const lhModel = useModel('lichhen');
    const dvModel = useModel('dichvu');
    const nvModel = useModel('nhanvien');

    const doanhThuDichVu: any = {};
    const doanhThuNhanVien: any = {};
    const slNgay: any = {};

    lhModel.lh.forEach((x: any) => {
        if (x.tt === 'Hoàn thành') {
            const d = dvModel.a1.find((v: any) => v.id === x.dv);
            if (d) {
                if (!doanhThuDichVu[d.ten]) doanhThuDichVu[d.ten] = 0;
                doanhThuDichVu[d.ten] += d.gia;

                const n = nvModel.d.find((q: any) => q.id === x.nv);
                if (n) {
                    if (!doanhThuNhanVien[n.ten]) doanhThuNhanVien[n.ten] = 0;
                    doanhThuNhanVien[n.ten] += d.gia;
                }
            }
        }

        if (!slNgay[x.ngay]) slNgay[x.ngay] = 0;
        slNgay[x.ngay]++;
    });

    const dtdv = Object.keys(doanhThuDichVu).map(k => <li key={k}>{k}: {doanhThuDichVu[k]} VND</li>);
    const dtnv = Object.keys(doanhThuNhanVien).map(k => <li key={k}>{k}: {doanhThuNhanVien[k]} VND</li>);
    const chart = Object.keys(slNgay).map(k => (
        <div key={k} style={{marginBottom: 10, display: 'flex', alignItems: 'center'}}>
            <span style={{width: 100}}>{k}</span>
            <div style={{width: slNgay[k] * 50, height: 20, backgroundColor: 'blue'}}></div>
            <span style={{marginLeft: 10}}>{slNgay[k]} lh</span>
        </div>
    ));

    return (
        <div>
            <h1>Thong Ke</h1>

            <div style={{border: '1px solid black', padding: 20}}>
                <h3>So luong lich hen theo ngay</h3>
                {chart}
            </div>

            <br/>
            <div style={{border: '1px solid black', padding: 20}}>
                <h3>Doanh thu theo dich vu (chỉ tính Hoàn thành)</h3>
                <ul>{dtdv.length ? dtdv : 'Chua co du lieu'}</ul>
            </div>

            <br/>
            <div style={{border: '1px solid black', padding: 20}}>
                <h3>Doanh thu theo nhan vien (chỉ tính Hoàn thành)</h3>
                <ul>{dtnv.length ? dtnv : 'Chua co du lieu'}</ul>
            </div>
        </div>
    );
};
