import React, { useState } from 'react';
import { Button, Table } from 'antd';

const OanTuTi = () => {
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState('');
  const [playerChoice, setPlayerChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');

  const choices = ['Kéo', 'Búa', 'Bao'];

  const play = (choice) => {
    const compChoice = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setComputerChoice(compChoice);

    let res = '';
    if (choice === compChoice) {
      res = 'Hòa';
    } else if (
      (choice === 'Kéo' && compChoice === 'Bao') ||
      (choice === 'Búa' && compChoice === 'Kéo') ||
      (choice === 'Bao' && compChoice === 'Búa')
    ) {
      res = 'Thắng';
    } else {
      res = 'Thua';
    }

    setResult(res);
    setHistory([{ player: choice, computer: compChoice, result: res }, ...history]);
  };

  const columns = [
    { title: 'Bạn chọn', dataIndex: 'player', key: 'player' },
    { title: 'Máy chọn', dataIndex: 'computer', key: 'computer' },
    { title: 'Kết quả', dataIndex: 'result', key: 'result' },
  ];

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <h1>Trò chơi Oẳn Tù Tì</h1>
      <div style={{ marginBottom: 20 }}>
        <Button size="large" onClick={() => play('Kéo')} style={{ marginRight: 10 }}>Kéo</Button>
        <Button size="large" onClick={() => play('Búa')} style={{ marginRight: 10 }}>Búa</Button>
        <Button size="large" onClick={() => play('Bao')}>Bao</Button>
      </div>

      {playerChoice && (
        <div style={{ marginBottom: 20, fontSize: 18 }}>
          <p>Bạn chọn: <b>{playerChoice}</b></p>
          <p>Máy chọn: <b>{computerChoice}</b></p>
          <p>Kết quả: <b>{result}</b></p>
        </div>
      )}

      <h2>Lịch sử các ván đấu</h2>
      <Table 
        dataSource={history} 
        columns={columns} 
        rowKey={(record, index) => index} 
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OanTuTi;
