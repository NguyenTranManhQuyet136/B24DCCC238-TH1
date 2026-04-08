import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Modal, Form, Input, Select, 
  DatePicker, Tag, Space, Row, Col, Statistic, Typography, 
  message, Divider, Input as AntInput
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  LogoutOutlined, SearchOutlined, CheckCircleOutlined, 
  SyncOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { Title, Text } = Typography;
const { Option } = Select;
const localizer = momentLocalizer(moment);

// --- Khởi tạo dữ liệu mẫu nếu chưa có gì trong localStorage ---
const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Làm bài tập Thực hành 7',
    assignee: 'B24DCCC238',
    priority: 'Cao',
    deadline: moment().add(1, 'days').format('YYYY-MM-DD'),
    status: 'Đang làm'
  },
  {
    id: '2',
    title: 'Học ReactJS nâng cao',
    assignee: 'Nguyen Van A',
    priority: 'Trung bình',
    deadline: moment().add(3, 'days').format('YYYY-MM-DD'),
    status: 'Chưa làm'
  }
];

const TH7_Page = () => {
  // --- Các state quản lý ---
  const [user, setUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [form] = Form.useForm();
  
  // State cho bộ lọc
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterAssignee, setFilterAssignee] = useState('Tất cả');

  // --- useEffect để load dữ liệu từ localStorage ---
  useEffect(() => {
    // Check xem có ai đang đăng nhập không
    const loggedUser = localStorage.getItem('th7_user') || sessionStorage.getItem('th7_user');
    if (loggedUser) {
      setUser(loggedUser);
    }

    // Load danh sách công việc
    const savedTasks = localStorage.getItem('th7_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(INITIAL_TASKS);
      localStorage.setItem('th7_tasks', JSON.stringify(INITIAL_TASKS));
    }
  }, []);

  // Mỗi khi tasks thay đổi thì lưu vào localStorage luôn
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('th7_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // --- Hàm xử lý Đăng nhập ---
  const handleLogin = (values: any) => {
    const { username } = values;
    if (username) {
      setUser(username);
      localStorage.setItem('th7_user', username);
      message.success(`Chào mừng ${username} đã quay trở lại!`);
    }
  };

  // --- Hàm xử lý Đăng xuất ---
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('th7_user');
    sessionStorage.removeItem('th7_user');
    message.info('Đã đăng xuất thành công');
  };

  // --- Hàm CRUD Công việc ---
  const showModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        ...task,
        deadline: moment(task.deadline)
      });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD'),
        id: editingTask ? editingTask.id : Date.now().toString()
      };

      if (editingTask) {
        // Cập nhật task cũ
        const newTasks = tasks.map(t => t.id === editingTask.id ? formattedValues : t);
        setTasks(newTasks);
        message.success('Cập nhật công việc thành công');
      } else {
        // Thêm task mới
        setTasks([...tasks, formattedValues]);
        message.success('Thêm công việc thành công');
      }
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa?',
      content: 'Bạn có chắc chắn muốn xóa công việc này không?',
      onOk: () => {
        setTasks(tasks.filter(t => t.id !== id));
        message.success('Đã xóa công việc');
      }
    });
  };

  // --- Dữ liệu cho Bảng và Calendar ---
  // Lọc dữ liệu
  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'Tất cả' || task.status === filterStatus;
    const matchAssignee = filterAssignee === 'Tất cả' || task.assignee === filterAssignee;
    return matchSearch && matchStatus && matchAssignee;
  });

  // Task của riêng tôi
  const myTasks = tasks.filter(t => t.assignee === user);

  // Thống kê
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Đã xong').length;

  // Render cho Calendar
  const calendarEvents = tasks.map(t => ({
    id: t.id,
    title: `[${t.status}] ${t.title}`,
    start: new Date(t.deadline),
    end: new Date(t.deadline),
    allDay: true,
    resource: t
  }));

  // Định nghĩa cột cho table
  const columns = [
    { title: 'Tên công việc', dataIndex: 'title', key: 'title' },
    { title: 'Người được giao', dataIndex: 'assignee', key: 'assignee' },
    { 
      title: 'Ưu tiên', 
      dataIndex: 'priority', 
      key: 'priority',
      render: (p: string) => {
        let color = 'blue';
        if (p === 'Cao') color = 'red';
        if (p === 'Trung bình') color = 'orange';
        return <Tag color={color}>{p}</Tag>;
      }
    },
    { title: 'Hạn chót', dataIndex: 'deadline', key: 'deadline' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (s: string) => {
        let color = 'default';
        if (s === 'Đang làm') color = 'processing';
        if (s === 'Đã xong') color = 'success';
        return <Tag color={color}>{s}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  // --- Giao diện Đăng nhập ---
  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', background: '#f0f2f5' }}>
        <Card title="ĐĂNG NHẬP HỆ THỐNG" style={{ width: 400, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Form onFinish={handleLogin} layout="vertical">
            <Form.Item name="username" label="Nhập tên của bạn" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input placeholder="Ví dụ: B24DCCC238" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>VÀO HỆ THỐNG</Button>
          </Form>
          <div style={{ marginTop: 20, color: 'gray' }}>
            <small>Dữ liệu sẽ được lưu tại localStorage của trình duyệt</small>
          </div>
        </Card>
      </div>
    );
  }

  // --- Giao diện Dashboard chính ---
  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={16} justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Ứng dụng Quản lý Công việc Nhóm</Title>
          <Text type="secondary">Chào bạn, <strong style={{ color: '#1890ff' }}>{user}</strong>. Chúc bạn một ngày làm việc hiệu quả!</Text>
        </Col>
        <Col>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>Đăng xuất</Button>
        </Col>
      </Row>

      {/* THÔNG KÊ NHANH */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic title="Tổng số công việc" value={totalTasks} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic title="Đã hoàn thành" value={completedTasks} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Statistic 
              title="Công việc của tôi" 
              value={myTasks.length} 
              prefix={<SyncOutlined spin={myTasks.some(t => t.status === 'Đang làm')} />} 
              suffix={`/ ${totalTasks}`}
              valueStyle={{ color: '#faad14' }} 
            />
          </Card>
        </Col>
      </Row>

      {/* BỘ LỌC VÀ TÌM KIẾM */}
      <Card title="Danh sách công việc" style={{ marginBottom: 24, borderRadius: 8 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <AntInput 
              placeholder="Tìm tên công việc..." 
              prefix={<SearchOutlined />} 
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={5}>
            <Select style={{ width: '100%' }} defaultValue="Tất cả" onChange={setFilterStatus}>
              <Option value="Tất cả">Trạng thái: Tất cả</Option>
              <Option value="Chưa làm">Chưa làm</Option>
              <Option value="Đang làm">Đang làm</Option>
              <Option value="Đã xong">Đã xong</Option>
            </Select>
          </Col>
          <Col span={5}>
            <Select style={{ width: '100%' }} defaultValue="Tất cả" onChange={setFilterAssignee}>
              <Option value="Tất cả">Người giao: Tất cả</Option>
              {[...new Set(tasks.map(t => t.assignee))].map(a => (
                <Option key={a} value={a}>{a}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Thêm mới</Button>
          </Col>
        </Row>

        <Table 
          dataSource={filteredTasks} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* LỊCH BIỂU (CALENDAR) */}
      <Card title="Lịch trình công việc (Calendar)" style={{ borderRadius: 8 }}>
        <div style={{ height: 500 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            messages={{
              next: "Sau",
              previous: "Trước",
              today: "Hôm nay",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày"
            }}
          />
        </div>
      </Card>

      {/* MODAL THÊM/SỬA */}
      <Modal 
        title={editingTask ? "SỬA CÔNG VIỆC" : "THÊM CÔNG VIỆC MỚI"} 
        visible={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText={editingTask ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên công việc" rules={[{ required: true, message: 'Hãy nhập tên CV!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="assignee" label="Người được giao" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="priority" label="Ưu tiên" rules={[{ required: true }]}>
                <Select>
                  <Option value="Thấp">Thấp</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Cao">Cao</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select>
                  <Option value="Chưa làm">Chưa làm</Option>
                  <Option value="Đang làm">Đang làm</Option>
                  <Option value="Đã xong">Đã xong</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="deadline" label="Hạn hoàn thành" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>

      <Divider />
      <div style={{ textAlign: 'center', color: '#ccc' }}>
        Bài tập Thực hành 7 - Nhóm sinh viên
      </div>
    </div>
  );
};

export default TH7_Page;
