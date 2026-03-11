import { Button, Modal, Table, Input } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
    const m = useModel('nhanvien');
    const [tm1, sm1] = useState('');
    const [tm2, sm2] = useState('');
    const [tm3, sm3] = useState('');

    const c = [
        { title: 'Ten', dataIndex: 'ten' },
        { title: 'Ca', dataIndex: 'ca' },
        { title: 'Max Khach', dataIndex: 'max' },
        {
            title: 'Hanh Dong',
            render: (r: any) => (
                <div>
                    <Button onClick={() => {
                        m.setR(r);
                        sm1(r.ten);
                        sm2(r.ca);
                        sm3(r.max);
                        m.setE(true);
                        m.setV(true);
                    }}>Sua</Button>
                    <Button onClick={() => m.f3(r.id)} type="primary" danger>Xoa</Button>
                </div>
            )
        }
    ];

    return (
        <div>
            <h1>Quan ly nhan vien</h1>
            <Button type="primary" onClick={() => {
                sm1(''); sm2(''); sm3('');
                m.setE(false);
                m.setV(true);
            }}>Them moi</Button>
            <br/><br/>
            <Table dataSource={m.d} columns={c} rowKey="id" />

            <Modal 
                visible={m.v} 
                onCancel={() => m.setV(false)}
                onOk={() => {
                    if (m.e) {
                        m.f2(m.r.id, { ten: tm1, ca: tm2, max: tm3 });
                    } else {
                        m.f1({ ten: tm1, ca: tm2, max: tm3 });
                    }
                    m.setV(false);
                }}
            >
                <Input placeholder="Ten" value={tm1} onChange={e => sm1(e.target.value)} />
                <br/><br/>
                <Input placeholder="Ca lam" value={tm2} onChange={e => sm2(e.target.value)} />
                <br/><br/>
                <Input type="number" placeholder="Max" value={tm3} onChange={e => sm3(e.target.value)} />
            </Modal>
        </div>
    );
};
