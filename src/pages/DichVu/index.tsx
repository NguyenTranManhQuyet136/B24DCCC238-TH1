import { Button, Modal, Table, Input } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
    const mm = useModel('dichvu');
    const [x, y] = useState('');
    const [z, w] = useState('');
    const [t, u] = useState('');

    const cols = [
        { title: 'Dich Vu', dataIndex: 'ten' },
        { title: 'Gia (VNĐ)', dataIndex: 'gia' },
        { title: 'Thoi Gian (Phut)', dataIndex: 'tg' },
        {
            title: 'Hanh Dong',
            render: (r: any) => (
                <div>
                    <Button onClick={() => {
                        mm.b4(r);
                        y(r.ten);
                        w(r.gia);
                        u(r.tg);
                        mm.b3(true);
                        mm.b2(true);
                    }}>Sua</Button>
                    <Button onClick={() => mm.c3(r.id)} type="primary" danger>Xoa</Button>
                </div>
            )
        }
    ];

    return (
        <div>
            <h1>Quan ly dich vu</h1>
            <Button type="primary" onClick={() => {
                y(''); w(''); u('');
                mm.b3(false);
                mm.b2(true);
            }}>Them</Button>
            <br/><br/>
            <Table dataSource={mm.a1} columns={cols} rowKey="id" />

            <Modal 
                visible={mm.a2} 
                onCancel={() => mm.b2(false)}
                onOk={() => {
                    if (mm.a3) {
                        mm.c2(mm.a4.id, { ten: x, gia: z, tg: t });
                    } else {
                        mm.c1({ ten: x, gia: z, tg: t });
                    }
                    mm.b2(false);
                }}
            >
                <Input placeholder="Ten DV" value={x} onChange={e => y(e.target.value)} />
                <br/><br/>
                <Input type="number" placeholder="Gia" value={z} onChange={e => w(e.target.value)} />
                <br/><br/>
                <Input type="number" placeholder="Thoi gian" value={t} onChange={e => u(e.target.value)} />
            </Modal>
        </div>
    );
};
