import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, Typography, Space, Checkbox, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  // State lưu danh sách công việc
  const [todos, setTodos] = useState<TodoItem[]>([]);
  // State lưu giá trị đang nhập
  const [inputValue, setInputValue] = useState<string>('');
  // State lưu id của công việc đang chỉnh sửa
  const [editingId, setEditingId] = useState<number | null>(null);

  // useEffect lấy dữ liệu từ LocalStorage khi component được load lần đầu
  useEffect(() => {
    const savedTodos = localStorage.getItem('todoList');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('Error parsing todos from local storage:', e);
      }
    }
  }, []);

  // useEffect lưu dữ liệu vào LocalStorage mỗi khi danh sách todos thay đổi
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todos));
  }, [todos]);

  // Hàm thêm hoặc cập nhật công việc
  const handleAddTodo = () => {
    if (!inputValue.trim()) {
      message.warning('Vui lòng nhập nội dung công việc!');
      return;
    }

      if (editingId !== null) {
      // Logic cập nhật công việc hiện có
      const updatedTodos = todos.map(todo => 
        todo.id === editingId ? { ...todo, text: inputValue } : todo
      );
      setTodos(updatedTodos);
      setEditingId(null);
      message.success('Cập nhật công việc thành công!');
    } else {
      // Logic thêm công việc mới
      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      message.success('Thêm công việc thành công!');
    }
    setInputValue('');
  };

  // Hàm xóa công việc
  const handleDeleteTodo = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    message.success('Đã xóa công việc!');
  };

  // Hàm đánh dấu hoàn thành công việc
  const handleToggleComplete = (id: number) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  // Hàm bắt đầu chế độ chỉnh sửa
  const startEdit = (todo: TodoItem) => {
    setInputValue(todo.text);
    setEditingId(todo.id);
  };

  // Hàm hủy chỉnh sửa
  const cancelEdit = () => {
    setInputValue('');
    setEditingId(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="Danh sách công việc (Todo List)" style={{ width: 500 }}>
        <Space style={{ width: '100%', marginBottom: 16 }}>
          <Input 
            placeholder="Nhập công việc cần làm..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleAddTodo}
          />
          <Button type="primary" icon={editingId ? <EditOutlined /> : <PlusOutlined />} onClick={handleAddTodo}>
            {editingId ? 'Lưu' : 'Thêm'}
          </Button>
          {editingId && (
            <Button onClick={cancelEdit}>Hủy</Button>
          )}
        </Space>

        <List
          locale={{ emptyText: 'Chưa có công việc nào' }}
          bordered
          dataSource={todos}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => startEdit(item)} 
                  disabled={item.completed}
                />,
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => handleDeleteTodo(item.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ]}
            >
              <Checkbox 
                checked={item.completed} 
                onChange={() => handleToggleComplete(item.id)}
              >
                <Text delete={item.completed} style={{ color: item.completed ? '#999' : 'inherit' }}>
                  {item.text}
                </Text>
              </Checkbox>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default TodoList;
