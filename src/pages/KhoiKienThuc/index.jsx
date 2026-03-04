import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Popconfirm, Select } from 'antd';

const KhoiKienThuc = () => {
  const [data, setData] = useState([
    { id: 1, ma: 'KKT01', ten: 'Tổng quan' },
    { id: 2, ma: 'KKT02', ten: 'Chuyên sâu' },
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
    { title: 'Mã khối kiến thức', dataIndex: 'ma', key: 'ma' },
    { title: 'Tên khối kiến thức', dataIndex: 'ten', key: 'ten' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa khối kiến thức này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h1>Quản lý Khối kiến thức</h1>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm mới</Button>
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title={editingId ? 'Sửa Khối kiến thức' : 'Thêm Khối kiến thức'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ma" label="Mã khối kiến thức" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ten" label="Tên khối kiến thức" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhoiKienThuc;
