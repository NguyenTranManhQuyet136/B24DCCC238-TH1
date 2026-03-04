import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Popconfirm } from 'antd';

const MonHoc = () => {
  const [data, setData] = useState([
    { id: 1, ma: 'MH01', ten: 'Toán cao cấp', tin: 3 },
    { id: 2, ma: 'MH02', ten: 'Lập trình web', tin: 3 },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingId) {
        setData(
          data.map((item) => (item.id === editingId ? { ...item, ...values } : item))
        );
      } else {
        setData([...data, { id: Date.now(), ...values }]);
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'Mã môn học', dataIndex: 'ma', key: 'ma' },
    { title: 'Tên môn học', dataIndex: 'ten', key: 'ten' },
    { title: 'Số tín chỉ', dataIndex: 'tin', key: 'tin' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa môn học này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h1>Quản lý Môn học</h1>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm mới</Button>
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title={editingId ? 'Sửa Môn học' : 'Thêm Môn học'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ma" label="Mã môn học" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ten" label="Tên môn học" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tin" label="Số tín chỉ" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MonHoc;
