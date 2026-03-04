import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Popconfirm, Select, message } from 'antd';

const { Option } = Select;

const DeThi = () => {
  const [data, setData] = useState([
    { id: 1, tenDe: 'Đề thi Toán cao cấp HK1', monHoc: 'Toán cao cấp', cauTruc: 'Dễ: 2, Trung bình: 3' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Hardcode danh sách câu hỏi trong ngân hàng 
  const NganHangCauHoi = [
    { id: 1, ma: 'CH01', monHoc: 'Toán cao cấp', doKho: 'Dễ', khoiKienThuc: 'Tổng quan' },
    { id: 2, ma: 'CH02', monHoc: 'Toán cao cấp', doKho: 'Dễ', khoiKienThuc: 'Tổng quan' },
    { id: 3, ma: 'CH03', monHoc: 'Toán cao cấp', doKho: 'Trung bình', khoiKienThuc: 'Tổng quan' },
    { id: 4, ma: 'CH04', monHoc: 'Lập trình web', doKho: 'Dễ', khoiKienThuc: 'Chuyên sâu' },
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const { tenDe, monHoc, soCauDe, soCauTB } = values;
      
      const deSoLuongDe = NganHangCauHoi.filter(c => c.monHoc === monHoc && c.doKho === 'Dễ').length;
      const deSoLuongTB = NganHangCauHoi.filter(c => c.monHoc === monHoc && c.doKho === 'Trung bình').length;

      if (deSoLuongDe < Number(soCauDe || 0)) {
        message.error(`Không đủ số câu hỏi "Dễ" cho môn ${monHoc}. (Cần: ${soCauDe}, Hiện có: ${deSoLuongDe})`);
        return;
      }
      
      if (deSoLuongTB < Number(soCauTB || 0)) {
        message.error(`Không đủ số câu hỏi "Trung bình" cho môn ${monHoc}. (Cần: ${soCauTB}, Hiện có: ${deSoLuongTB})`);
        return;
      }

      const strCauTruc = `Dễ: ${soCauDe || 0}, Trung bình: ${soCauTB || 0}`;
      setData([...data, { id: Date.now(), tenDe, monHoc, cauTruc: strCauTruc }]);
      setIsModalVisible(false);
      message.success('Tạo đề thi thành công!');
    });
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const columns = [
    { title: 'Tên đề thi', dataIndex: 'tenDe', key: 'tenDe' },
    { title: 'Môn học', dataIndex: 'monHoc', key: 'monHoc' },
    { title: 'Cấu trúc', dataIndex: 'cauTruc', key: 'cauTruc' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="Xóa đề thi này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h1>Quản lý Đề thi</h1>
      <Button type="primary" onClick={() => {form.resetFields(); setIsModalVisible(true);}} style={{ marginBottom: 16 }}>
        Tạo đề thi mới
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title="Tạo Đề thi"
        visible={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenDe" label="Tên đề thi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="monHoc" label="Môn học" rules={[{ required: true }]}>
             <Select>
              <Option value="Toán cao cấp">Toán cao cấp</Option>
              <Option value="Lập trình web">Lập trình web</Option>
            </Select>
          </Form.Item>
          {/* Hardcode lấy số lượng 2 mức độ làm ví dụ */}
          <Form.Item name="soCauDe" label="Số lượng câu Dễ">
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="soCauTB" label="Số lượng câu Trung bình">
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeThi;
