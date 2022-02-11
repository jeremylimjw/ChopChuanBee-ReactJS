import { Space, Typography } from 'antd'
import React from 'react'

export default function SupplierInfo({ purchaseOrder }) {
  return (
    <>
        <Typography.Title level={4}>{purchaseOrder?.supplier.company_name}</Typography.Title>
        
        <Space direction='vertical' style={{ marginTop: 10 }}>
            <Typography.Text>Name: {purchaseOrder?.supplier.s1_name}</Typography.Text>
            <Typography.Text>Contact: {purchaseOrder?.supplier.s1_phone_number}</Typography.Text>
            <Typography.Text style={{ width: 340 }} ellipsis>Address: {purchaseOrder?.supplier.address}</Typography.Text>
            <Typography.Text>Postal Code: {purchaseOrder?.supplier.postal_code}</Typography.Text>
            <Typography.Text>Email: {purchaseOrder?.supplier.email || 'None'}</Typography.Text>
        </Space>
    </>
  )
}
