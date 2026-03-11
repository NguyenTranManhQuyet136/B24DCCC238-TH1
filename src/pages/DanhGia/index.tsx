import { Button, Modal, Table, Input, Select, Rate } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
    const d1 = useModel('danhgia');
    const n1 = useModel('nhanvien');
    const [t1, t2] = useState('');
    const [t3, t4] = useState(5);
    const [t5, t6] = useState('');
    const [t7, t8] = useState('');

    const cols = [
        { title: 'Khach Hang', dataIndex: 'khach' },
        { title: 'Nhan Vien', render: (r: any) => n1.d.find((x: any) => x.id === r.nv)?.ten },
        { title: 'Diem', dataIndex: 'diem' },
        { title: 'Danh gia', dataIndex: 'cmt' },
        { title: 'Phan hoi', dataIndex: 'rep' },
        {
            title: 'Hanh Dong (Cho NV)',
            render: (r: any) => (
                <div>
                    {!r.rep && <Button onClick={() => {
                        d1.setObj(r);
                        d1.setModal(true);
                    }}>Phan hoi</Button>}
                </div>
            )
        }
    ];

    const dsnv = n1.d.map((nv: any) => {
        const danhgias = d1.dg.filter((x: any) => x.nv === nv.id);
        const sum = danhgias.reduce((a: any, b: any) => a + b.diem, 0);
        const avg = danhgias.length ? (sum / danhgias.length).toFixed(1) : 0;
        return {id: nv.id, ten: nv.ten, avg};
    });

    return (
        <div>
            <h1>Danh Gia Nhan Vien</h1>

            <div style={{border: '1px solid black', padding: 10, marginBottom: 20}}>
                <h3>Them danh gia (Khach)</h3>
                <Input placeholder="Ten khach" value={t1} onChange={e => t2(e.target.value)} style={{width: 200, marginRight: 10}}/>
                <Select placeholder="Nhan vien" value={t7} onChange={v => t8(v)} style={{width: 200, marginRight: 10}}>
                    {n1.d.map((x: any) => <Select.Option key={x.id} value={x.id}>{x.ten}</Select.Option>)}
                </Select>
                <Rate value={t3} onChange={v => t4(v)} style={{marginRight: 10}}/>
                <Input placeholder="Binh luan" value={t5} onChange={e => t6(e.target.value)} style={{width: 300, marginRight: 10}}/>
                <Button type="primary" onClick={() => {
                    d1.gui({nv: t7, khach: t1, diem: t3, cmt: t5, rep: ''});
                }}>Gui</Button>
            </div>

            <div style={{border: '1px solid black', padding: 10, marginBottom: 20}}>
                <h3>Diem trung binh</h3>
                <ul>
                    {dsnv.map((x: any) => <li key={x.id}>{x.ten}: {x.avg} sao</li>)}
                </ul>
            </div>

            <Table dataSource={d1.dg} columns={cols} rowKey="id" />

            <Modal 
                title="Phan hoi cua nhan vien"
                visible={d1.modal} 
                onCancel={() => d1.setModal(false)}
                onOk={() => {
                    d1.traphanhoi(d1.obj.id, (document.getElementById('rep_input') as any)?.value);
                    d1.setModal(false);
                }}
            >
                <Input id="rep_input" placeholder="Phan hoi cua ban..." />
            </Modal>
        </div>
    );
};
