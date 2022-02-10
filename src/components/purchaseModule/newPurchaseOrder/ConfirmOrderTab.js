import { Button, Table, Typography, Form, Space } from 'antd';
import React from 'react'
import MyCard from '../../layout/MyCard';
import MyToolbar from '../../layout/MyToolbar';

export default function ConfirmOrderTab({ selectedSupplier, selectedProducts, step, setStep, handleSubmitEvent }) {

  const supplier = selectedSupplier[0];

  return (
    <div style={{ display: 'flex'}}>

      <MyCard style={{ width: 400, margin: '0 12px 24px 24px' }}>
        <Typography.Title level={4}>{supplier.company_name}</Typography.Title>
        
        <Space direction='vertical' style={{ marginTop: 10 }}>
          <Typography.Text>Name: {supplier.s1_name}</Typography.Text>
          <Typography.Text>Contact: {supplier.s1_phone_number}</Typography.Text>
          <Typography.Text style={{ width: 340 }} ellipsis>Address: {supplier.address}</Typography.Text>
          <Typography.Text>Postal Code: {supplier.postal_code}</Typography.Text>
          <Typography.Text>Email: {supplier.email || 'None'}</Typography.Text>
        </Space>
        
      </MyCard>

      <MyCard style={{ flexGrow: 1, margin: '0 12px 24px 24px' }}>
        <Table columns={columns} dataSource={selectedProducts.filter(x => x.quantity !== 0)} rowKey="id" />
        <MyToolbar style={{ marginTop: 15 }}>
          <Button onClick={() => setStep(step-1)}>Back</Button>
          <Button type="primary" onClick={() => handleSubmitEvent()}>Confirm Order</Button>
        </MyToolbar>
      </MyCard>

    </div>
  )
}
  
const columns = [
  {
    title: 'Name',
    dataIndex: 'product',
    render: (product) => product.name,
  },
  {
    title: 'Description',
    dataIndex: 'product',
    render: (product) => product.description || '-',
  },
  {
    title: 'Unit',
    dataIndex: 'product',
    render: (product) => product.unit,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    align: 'center',
  },
];
