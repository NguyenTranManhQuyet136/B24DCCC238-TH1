import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Popconfirm, Select, Row, Col } from 'antd';

const { Option } = Select;

const CauHoi = () => {
  const [data, setData] = useState([
    { id: 1, ma: 'CH01', monHoc: 'Toán cao cấp', noiDung: '1+1=?', doKho: 'Dễ', khoiKienThuc: 'Tổng quan' },
    { id: 2, ma: 'CH02', monHoc: 'Lập trình web', noiDung: 'React là gì?', doKho: 'Trung bình', khoiKienThuc: 'Chuyên sâu' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // Search states
  const [searchMonHoc, setSearchMonHoc] = useState('');
  const [searchDoKho, setSearchDoKho] = useState('');
  const [searchKhoiKienThuc, setSearchKhoiKienThuc] = useState('');

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
    { title: 'Mã CH', dataIndex: 'ma', key: 'ma' },
    { title: 'Môn học', dataIndex: 'monHoc', key: 'monHoc' },
    { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Mức độ', dataIndex: 'doKho', key: 'doKho' },
    { title: 'Khối kiến thức', dataIndex: 'khoiKienThuc', key: 'khoiKienThuc' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="primary" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(item => {
    return (
      (searchMonHoc ? item.monHoc.toLowerCase().includes(searchMonHoc.toLowerCase()) : true) &&
      (searchDoKho ? item.doKho === searchDoKho : true) &&
      (searchKhoiKienThuc ? item.khoiKienThuc.toLowerCase().includes(searchKhoiKienThuc.toLowerCase()) : true)
    );
  });

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h1>Quản lý Câu hỏi</h1>
      
      <div style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Input 
              placeholder="Tìm theo môn học" 
              value={searchMonHoc}
              onChange={e => setSearchMonHoc(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Select 
              placeholder="Độ khó" 
              style={{ width: '100%' }}
              allowClear
              value={searchDoKho}
              onChange={val => setSearchDoKho(val)}
            >
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Input 
              placeholder="Tìm theo khối kiến thức" 
              value={searchKhoiKienThuc}
              onChange={e => setSearchKhoiKienThuc(e.target.value)}
            />
          </Col>
        </Row>
      </div>

      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm mới</Button>
      <Table columns={columns} dataSource={filteredData} rowKey="id" />

      <Modal
        title={editingId ? 'Sửa Câu hỏi' : 'Thêm Câu hỏi'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ma" label="Mã câu hỏi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="monHoc" label="Môn học" rules={[{ required: true }]}>
            <Select>
              <Option value="Toán cao cấp">Toán cao cấp</Option>
              <Option value="Lập trình web">Lập trình web</Option>
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="doKho" label="Mức độ khó" rules={[{ required: true }]}>
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Form.Item>
          <Form.Item name="khoiKienThuc" label="Khối kiến thức" rules={[{ required: true }]}>
             <Select>
              <Option value="Tổng quan">Tổng quan</Option>
              <Option value="Chuyên sâu">Chuyên sâu</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CauHoi;
