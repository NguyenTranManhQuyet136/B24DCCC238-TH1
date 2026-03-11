import { Button, Modal, Table, Input, Select, message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
    const l1 = useModel('lichhen');
    const n1 = useModel('nhanvien');
    const d1 = useModel('dichvu');
    const [a, b] = useState('');
    const [c, d] = useState('');
    const [e, f] = useState('');
    const [g, h] = useState('');
    const [i, j] = useState('');
    const [k, l] = useState('');

    const cols = [
        { title: 'Khach Hang', dataIndex: 'khach' },
        { title: 'Ngay', dataIndex: 'ngay' },
        { title: 'Gio', dataIndex: 'gio' },
        { title: 'Nhan Vien', render: (r: any) => n1.d.find((x: any) => x.id === r.nv)?.ten },
        { title: 'Dich Vu', render: (r: any) => d1.a1.find((x: any) => x.id === r.dv)?.ten },
        { title: 'Trang Thai', dataIndex: 'tt' },
        {
            title: 'Hanh Dong',
            render: (r: any) => (
                <div>
                    <Select value={r.tt} onChange={(v) => l1.capnhat(r.id, { tt: v })}>
                        <Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
                        <Select.Option value="Xác nhận">Xác nhận</Select.Option>
                        <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
                        <Select.Option value="Hủy">Hủy</Select.Option>
                    </Select>
                    <Button onClick={() => l1.xoa(r.id)} type="primary" danger style={{marginLeft: 10}}>Xoa</Button>
                </div>
            )
        }
    ];

    return (
        <div>
            <h1>Dat Lich Hen</h1>
            <Button type="primary" onClick={() => l1.setModal(true)}>Them</Button>
            <br/><br/>
            <Table dataSource={l1.lh} columns={cols} rowKey="id" />

            <Modal 
                visible={l1.modal} 
                onCancel={() => l1.setModal(false)}
                onOk={() => {
                    const chk1 = l1.lh.find((x: any) => x.nv === a && x.ngay === k && x.gio === e);
                    if (chk1) {
                        message.error('Trung lich nhan vien roi!');
                        return;
                    }
                    const nv = n1.d.find((x: any) => x.id === a);
                    if (nv) {
                        const cnt = l1.lh.filter((x: any) => x.nv === a && x.ngay === k).length;
                        if (cnt >= nv.max) {
                            message.error('Nhan vien nay da full khach trong ngay dang chon!');
                            return;
                        }
                    }
                    l1.them({ nv: a, dv: c, ngay: k, gio: e, khach: g, sdt: i });
                    l1.setModal(false);
                }}
            >
                <Input placeholder="Ten khach" value={g} onChange={x => h(x.target.value)} /><br/><br/>
                <Input placeholder="SDT" value={i} onChange={x => j(x.target.value)} /><br/><br/>
                <Select placeholder="Nhan vien" value={a} onChange={v => b(v)} style={{width: '100%'}}>
                    {n1.d.map((x: any) => <Select.Option key={x.id} value={x.id}>{x.ten}</Select.Option>)}
                </Select><br/><br/>
                <Select placeholder="Dich vu" value={c} onChange={v => d(v)} style={{width: '100%'}}>
                    {d1.a1.map((x: any) => <Select.Option key={x.id} value={x.id}>{x.ten}</Select.Option>)}
                </Select><br/><br/>
                <Input type="date" placeholder="Ngay" value={k} onChange={x => l(x.target.value)} /><br/><br/>
                <Input type="time" placeholder="Gio" value={e} onChange={x => f(x.target.value)} />
            </Modal>
        </div>
    );
};
