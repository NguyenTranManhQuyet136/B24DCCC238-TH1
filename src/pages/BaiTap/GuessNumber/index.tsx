import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Typography, Space, Alert } from 'antd';

const { Title, Text, Paragraph } = Typography;

const RandomNumberGame: React.FC = () => {
  // State lưu số cần đoán
  const [targetNumber, setTargetNumber] = useState<number>(0);
  // State lưu số người dùng nhập
  const [userGuess, setUserGuess] = useState<string>('');
  // State lưu thông báo phản hồi
  const [message, setMessage] = useState<string>('');
  // State lưu số lượt đã đoán
  const [guessCount, setGuessCount] = useState<number>(0);
  // State kiểm tra game đã kết thúc chưa
  const [gameOver, setGameOver] = useState<boolean>(false);
  // State lưu loại thông báo (để hiển thị màu sắc phù hợp)
  const [messageType, setMessageType] = useState<'success' | 'info' | 'warning' | 'error'>('info');
  // State lưu lịch sử các số đã đoán
  const [history, setHistory] = useState<number[]>([]);

  // Hàm sinh số ngẫu nhiên từ 1 đến 100
  const generateNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  // Khởi tạo game khi component được mount
  useEffect(() => {
    startNewGame();
  }, []);

  // Hàm bắt đầu game mới
  const startNewGame = () => {
    setTargetNumber(generateNumber());
    setUserGuess('');
    setMessage('Hãy đoán một số từ 1 đến 100!');
    setGuessCount(0);
    setGameOver(false);
    setMessageType('info');
    setHistory([]);
  };

  // Hàm xử lý logic khi người dùng đoán số
  const handleGuess = () => {
    const guess = parseInt(userGuess);

    // Kiểm tra đầu vào có phải là số không
    if (isNaN(guess)) {
      setMessage('Vui lòng nhập một số hợp lệ!');
      setMessageType('warning');
      return;
    }

    // Kiểm tra số có nằm trong khoảng 1-100 không
    if (guess < 1 || guess > 100) {
      setMessage('Số phải nằm trong khoảng từ 1 đến 100!');
      setMessageType('warning');
      return;
    }

    // Tăng số lượt đoán và lưu lịch sử
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);
    setHistory([...history, guess]);

    // Kiểm tra kết quả đoán
    if (guess === targetNumber) {
      setMessage('Chúc mừng! Bạn đã đoán đúng!');
      setMessageType('success');
      setGameOver(true);
    } else if (newGuessCount >= 10) {
      // Kiểm tra xem đã hết lượt chơi chưa
      setMessage(`Bạn đã hết lượt! Số đúng là ${targetNumber}.`);
      setMessageType('error');
      setGameOver(true);
    } else if (guess < targetNumber) {
      setMessage('Bạn đoán quá thấp!');
      setMessageType('info');
    } else {
      setMessage('Bạn đoán quá cao!');
      setMessageType('info');
    }
    
    // Reset ô nhập liệu
    setUserGuess('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="Trò chơi đoán số" style={{ width: 400, textAlign: 'center' }}>
        <Title level={4}>Dự đoán số (1-100)</Title>
        <Paragraph>Bạn còn <strong>{10 - guessCount}</strong> lượt đoán.</Paragraph>
        
        {message && (
          <Alert message={message} type={messageType} showIcon style={{ marginBottom: 16 }} />
        )}

        <Space direction="vertical" style={{ width: '100%' }}>
          <Input 
            placeholder="Nhập số dự đoán..." 
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            disabled={gameOver}
            onPressEnter={handleGuess}
            type='number'
          />
          <Button type="primary" onClick={handleGuess} disabled={gameOver} block>
            Đoán
          </Button>
          
          {gameOver && (
            <Button type="default" onClick={startNewGame} block>
              Chơi lại
            </Button>
          )}
        </Space>
        
        {history.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Lịch sử đoán: {history.join(', ')}</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RandomNumberGame;
