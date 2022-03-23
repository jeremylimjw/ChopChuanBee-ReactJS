import { Button, Table, Descriptions } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';
import EmailLink from '../../../utilities/EmailLink';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function NS3Confirm({ selectedCustomer, selectedProducts, step, setStep, handleSubmitEvent }) {

  return (
    <div style={{ display: 'flex' }}>

      <MyCard title="Customer Details" style={{ width: 400, margin: '0 12px 24px 24px' }}>

        <Descriptions bordered size="small" layout='horizontal' column={1}>
          <Descriptions.Item label="Company"><Link to={`/customer/customers/${selectedCustomer.id}`}>{selectedCustomer.company_name}</Link></Descriptions.Item>
          <Descriptions.Item label="Contact Name">{selectedCustomer.p1_name}</Descriptions.Item>
          <Descriptions.Item label="Contact No">{selectedCustomer.p1_phone_number}</Descriptions.Item>
          <Descriptions.Item label="Address">{selectedCustomer.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="Postal Code">{selectedCustomer.postal_code || '-'}</Descriptions.Item>
          <Descriptions.Item label="Email"><EmailLink email={selectedCustomer.company_email} /></Descriptions.Item>
        </Descriptions>

      </MyCard>

      <MyCard title="Order Items" style={{ flexGrow: 1, margin: '0 12px 24px 24px' }}>

        <Table columns={columns} dataSource={selectedProducts.filter(x => x.product != null)} rowKey="key" />

        <MyToolbar style={{ marginTop: 15 }}>
          <Button onClick={() => setStep(step - 1)}>Back</Button>
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
    render: (product) => product ? <Link to={`/inventory/products/${product.id}`}>{product.name}</Link> : '-',
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
