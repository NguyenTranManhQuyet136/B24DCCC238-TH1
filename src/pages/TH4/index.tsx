import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Tabs, Table, Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment';

const Comp1 = (props: any) => {
  const [f1] = Form.useForm();
  const [f2] = Form.useForm();
  return (
    <div>
      <Button onClick={() => props.setv1(true)}>Them SO</Button>
      <Table dataSource={props.d1} columns={[{title: 'Nam', dataIndex: 'n'}, {title: 'So Vao So', dataIndex: 'idx'}]} />
      <Modal visible={props.v1} onOk={()=>{
        let x = f1.getFieldsValue();
        let y = [...props.d1];
        y.push({id: Math.random()+'', n: parseInt(x.n), idx: 1});
        props.sd1(y);
        props.setv1(false);
      }} onCancel={()=>props.setv1(false)}>
        <Form form={f1}><Form.Item name="n" label="Nam"><Input/></Form.Item></Form>
      </Modal>

      <Button onClick={() => props.setv2(true)}>Them QD</Button>
      <Table dataSource={props.d2} columns={[
        {title: 'So QD', dataIndex: 'sqd'}, 
        {title: 'Ngay', dataIndex: 'nbh'}, 
        {title: 'Trich yeu', dataIndex: 'ty'},
        {title: 'Nam So', render: (t,r) => {
          let n = '';
          for(let i=0;i<props.d1.length;i++){
             if(props.d1[i].id == r.idsvb) n = props.d1[i].n;
          }
          return n;
        }},
        {title: 'Luot Tra Cuu', render: (t,r) => r.count || 0}
      ]} />
      <Modal visible={props.v2} onOk={()=>{
        let x = f2.getFieldsValue();
        let y = [...props.d2];
        y.push({id: Math.random()+'', sqd: x.sqd, nbh: moment(x.nbh).format('YYYY-MM-DD'), ty: x.ty, idsvb: x.idsvb});
        props.sd2(y);
        props.setv2(false);
      }} onCancel={()=>props.setv2(false)}>
        <Form form={f2}>
          <Form.Item name="sqd" label="So QD"><Input/></Form.Item>
          <Form.Item name="nbh" label="Ngay"><DatePicker/></Form.Item>
          <Form.Item name="ty" label="Trich yeu"><Input/></Form.Item>
          <Form.Item name="idsvb" label="So VB"><Select>
            {props.d1.map((i:any) => <Select.Option value={i.id}>{i.n}</Select.Option>)}
          </Select></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const Comp2 = (props: any) => {
  const [f] = Form.useForm();
  return (
    <div>
      <Button onClick={() => props.setv3(true)}>Them Truong Thong Tin</Button>
      <Table dataSource={props.d3} columns={[
        {title: 'Ten', dataIndex: 't'}, 
        {title: 'Kieu', dataIndex: 'k'},
        {title: 'Thao tac', render: (t,r) => {
          return <Button onClick={()=>{
             let a = [];
             for(let i=0;i<props.d3.length;i++) if(props.d3[i].id != r.id) a.push(props.d3[i]);
             props.sd3(a);
          }}>Xoa</Button>
        }}
      ]} />
      <Modal visible={props.v3} onOk={()=>{
        let x = f.getFieldsValue();
        let y = [...props.d3];
        y.push({id: Math.random()+'', t: x.t, k: x.k});
        props.sd3(y);
        props.setv3(false);
      }} onCancel={()=>props.setv3(false)}>
        <Form form={f}>
          <Form.Item name="t" label="Ten truong"><Input/></Form.Item>
          <Form.Item name="k" label="Kieu Du Lieu"><Select>
            <Select.Option value="String">String</Select.Option>
            <Select.Option value="Number">Number</Select.Option>
            <Select.Option value="Date">Date</Select.Option>
          </Select></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const Comp3 = (props: any) => {
  const [f] = Form.useForm();
  return (
    <div>
      <Button onClick={() => props.setv4(true)}>Them VB</Button>
      <Table scroll={{x: 1000}} dataSource={props.d4} columns={[
        {title: 'So Vao So', dataIndex: 'svs'}, 
        {title: 'So hieu', dataIndex: 'sh'}, 
        {title: 'MSV', dataIndex: 'msv'}, 
        {title: 'Ho ten', dataIndex: 'ht'}, 
        {title: 'Ngay sinh', dataIndex: 'ns'}, 
        {title: 'Quyet dinh', render: (t,r)=>{
          for(let i=0;i<props.d2.length;i++) if(props.d2[i].id==r.iqd) return props.d2[i].sqd;
        }},
        {title: 'Khac', render: (t,r) => JSON.stringify(r.other)}
      ]} />
      <Modal visible={props.v4} onOk={()=>{
        let x = f.getFieldsValue();
        let y = [...props.d4];
        
        let ii = '';
        for(let i=0;i<props.d2.length;i++){
           if(props.d2[i].id == x.iqd){
              ii = props.d2[i].idsvb;
           }
        }
        let svs = 1;
        let pobj = null;
        for(let i=0;i<props.d1.length;i++){
           if(props.d1[i].id == ii){
              svs = props.d1[i].idx;
              pobj = props.d1[i];
           }
        }
        let o = {};
        for(let j=0;j<props.d3.length;j++){
           let kkk = props.d3[j].id;
           let uuu = props.d3[j].k;
           if (uuu == 'Date') {
             // @ts-ignore
             o[kkk] = moment(x['k_'+kkk]).format('YYYY-MM-DD');
           } else {
             // @ts-ignore
             o[kkk] = x['k_'+kkk];
           }
        }
        y.push({id: Math.random()+'', svs: svs, sh: x.sh, msv: x.msv, ht: x.ht, ns: moment(x.ns).format('YYYY-MM-DD'), iqd: x.iqd, other: o});
        props.sd4(y);
        
        if(pobj){
           let d1n = [...props.d1];
           for(let k=0;k<d1n.length;k++){
              if(d1n[k].id == pobj.id){
                 d1n[k].idx = d1n[k].idx + 1;
              }
           }
           props.sd1(d1n);
        }
        props.setv4(false);
      }} onCancel={()=>props.setv4(false)}>
        <Form form={f}>
          <Form.Item name="iqd" label="Quyet Dinh"><Select>
            {props.d2.map((i:any) => <Select.Option value={i.id}>{i.sqd}</Select.Option>)}
          </Select></Form.Item>
          <Form.Item name="sh" label="So hieu VB"><Input/></Form.Item>
          <Form.Item name="msv" label="Ma Sinh Vien"><Input/></Form.Item>
          <Form.Item name="ht" label="Ho ten"><Input/></Form.Item>
          <Form.Item name="ns" label="Ngay sinh"><DatePicker/></Form.Item>
          {props.d3.map((i:any)=>{
             if(i.k == 'String'){
                return <Form.Item name={'k_'+i.id} label={i.t}><Input/></Form.Item>
             }
             if(i.k == 'Number'){
                return <Form.Item name={'k_'+i.id} label={i.t}><Input/></Form.Item>
             }
             if(i.k == 'Date'){
                return <Form.Item name={'k_'+i.id} label={i.t}><DatePicker/></Form.Item>
             }
             return null;
          })}
        </Form>
      </Modal>
    </div>
  )
}

const Index = () => {
  const { m1, m2, m3, m4 } = useModel('th4');
  const d1 = m1.danhSach;
  const sd1 = m1.setDanhSach;
  const d2 = m2.danhSach;
  const sd2 = m2.setDanhSach;
  const d3 = m3.danhSach;
  const sd3 = m3.setDanhSach;
  const d4 = m4.danhSach;
  const sd4 = m4.setDanhSach;

  const [t, st] = useState('1');
  const [v1, setv1] = useState(false);
  const [v2, setv2] = useState(false);
  const [v3, setv3] = useState(false);
  const [v4, setv4] = useState(false);

  const [t1, st1] = useState('');
  const [t2, st2] = useState('');
  const [t3, st3] = useState('');
  const [t4, st4] = useState('');
  const [t5, st5] = useState('');
  const [kq, skq] = useState([]);

  useEffect(()=>{
     if(d1.length == 0){
        let a = [{id:'1',n:2024,idx:1}];
        let b = [{id:'1',sqd:'QDTN01',nbh:'2024-01-01',ty:'TN',idsvb:'1'}];
        let c = [{id:'1',t:'Gioi tinh',k:'String'},{id:'2',t:'GPA',k:'Number'}];
        let d = [];
        sd1(a); sd2(b); sd3(c); sd4(d);
     }
  }, []);

  return (
    <Card>
      <Tabs activeKey={t} onChange={st}>
        <Tabs.TabPane tab="Quan ly So & QD" key="1">
          <Comp1 d1={d1} sd1={sd1} v1={v1} setv1={setv1} d2={d2} sd2={sd2} v2={v2} setv2={setv2}/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Cau Hinh Truong" key="2">
          <Comp2 d3={d3} sd3={sd3} v3={v3} setv3={setv3} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thong Tin VB" key="3">
          <Comp3 d1={d1} sd1={sd1} d2={d2} sd2={sd2} d3={d3} sd3={sd3} d4={d4} sd4={sd4} v4={v4} setv4={setv4} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tra Cuu" key="4">
           <div>
              So hieu: <Input value={t1} onChange={e=>st1(e.target.value)} />
              So vao so: <Input value={t2} onChange={e=>st2(e.target.value)} />
              MSV: <Input value={t3} onChange={e=>st3(e.target.value)} />
              Ho ten: <Input value={t4} onChange={e=>st4(e.target.value)} />
              Ngay sinh: <Input value={t5} onChange={e=>st5(e.target.value)} />
              <Button onClick={()=>{
                 let c = 0;
                 if(t1!='') c++;
                 if(t2!='') c++;
                 if(t3!='') c++;
                 if(t4!='') c++;
                 if(t5!='') c++;
                 if(c<2){
                    message.error('Nhap 2 tham so !');
                    return;
                 }
                 let r = [];
                 for(let i=0;i<d4.length;i++){
                    let ok = true;
                    if(t1!='' && d4[i].sh != t1) ok = false;
                    if(t2!='' && d4[i].svs != t2) ok = false;
                    if(t3!='' && d4[i].msv != t3) ok = false;
                    if(t4!='' && d4[i].ht.indexOf(t4)==-1) ok = false;
                    if(t5!='' && d4[i].ns != t5) ok = false;
                    if(ok) r.push(d4[i]);
                 }
                 // @ts-ignore
                 skq(r);
                 
                 let newd2 = [...d2];
                 for(let i=0;i<r.length;i++){
                    for(let j=0;j<newd2.length;j++){
                       if(newd2[j].id == r[i].iqd){
                          if(!newd2[j].count) newd2[j].count = 0;
                          newd2[j].count++;
                       }
                    }
                 }
                 sd2(newd2);
              }}>Tim</Button>
           </div>
           {kq.map((i:any)=>{
              return <div style={{background:'#f0f0f0', margin:10, padding:10}}>
                 <p>SVS: {i.svs}</p>
                 <p>SH: {i.sh}</p>
                 <p>MSV: {i.msv}</p>
                 <p>Ten: {i.ht}</p>
              </div>
           })}
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}
export default Index;
