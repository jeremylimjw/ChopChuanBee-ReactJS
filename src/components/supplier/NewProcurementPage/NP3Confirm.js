import { Button, Table, Descriptions } from 'antd';
import React from 'react'
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function NP3Confirm({ selectedSupplier, selectedProducts, step, setStep, handleSubmitEvent }) {

  return (
    <div style={{ display: 'flex'}}>

      <MyCard title="Supplier Details" style={{ width: 400, margin: '0 12px 24px 24px' }}>
        
        <Descriptions bordered size="small" layout='horizontal' column={1}>
          <Descriptions.Item label="Company">{selectedSupplier.company_name}</Descriptions.Item>
          <Descriptions.Item label="Name">{selectedSupplier.s1_name}</Descriptions.Item>
          <Descriptions.Item label="Contact">{selectedSupplier.s1_phone_number}</Descriptions.Item>
          <Descriptions.Item label="Address">{selectedSupplier.address}</Descriptions.Item>
          <Descriptions.Item label="Postal Code">{selectedSupplier.postal_code}</Descriptions.Item>
          <Descriptions.Item label="Email">{selectedSupplier.email || '-'}</Descriptions.Item>
        </Descriptions>
        
      </MyCard>

      <MyCard title="Order Items" style={{ flexGrow: 1, margin: '0 12px 24px 24px' }}>

        <Table columns={columns} dataSource={selectedProducts.filter(x => x.product != null)} rowKey="key" />

        <MyToolbar style={{ marginTop: 15 }}>
          <Button onClick={() => setStep(step-1)}>Back</Button>
          <Button type="primary" onClick={() => handleSubmitEvent()} disabled={selectedProducts.filter(x => x.product != null).length === 0}>Confirm Order</Button>
        </MyToolbar>

      </MyCard>

    </div>
  )
}
  
const columns = [
  {
    title: 'Name',
    dataIndex: 'product',
    render: (product) => product?.name,
  },
  {
    title: 'Description',
    dataIndex: 'product',
    render: (product) => product?.description || '-',
  },
  {
    title: 'Unit',
    dataIndex: 'product',
    render: (product) => product?.unit,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    align: 'center',
  },
];
