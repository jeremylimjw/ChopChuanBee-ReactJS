import { Descriptions, Space, Typography } from 'antd'
import React from 'react'

export default function SupplierInfo({ purchaseOrder }) {
  return (
    <>
      {purchaseOrder != null &&
      <>
        <Descriptions bordered size="small" layout='horizontal' column={1}>
          <Descriptions.Item label="Company">{purchaseOrder.supplier.company_name}</Descriptions.Item>
          <Descriptions.Item label="Name">{purchaseOrder.supplier.s1_name}</Descriptions.Item>
          <Descriptions.Item label="Contact">{purchaseOrder.supplier.s1_phone_number}</Descriptions.Item>
          <Descriptions.Item label="Address">{purchaseOrder.supplier.address}</Descriptions.Item>
          <Descriptions.Item label="Postal Code">{purchaseOrder.supplier.postal_code}</Descriptions.Item>
          <Descriptions.Item label="Email">{purchaseOrder.supplier.email || '-'}</Descriptions.Item>
        </Descriptions>
      </>
      }
    </>
  )
}
