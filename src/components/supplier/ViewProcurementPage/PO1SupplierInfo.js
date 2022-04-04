import { Descriptions } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import EmailLink from '../../../utilities/EmailLink'

export default function PO1SupplierInfo({ purchaseOrder }) {
  return (
    <>
      {purchaseOrder != null &&
      <>
        <Descriptions bordered size="small" layout='horizontal' column={1}>
          <Descriptions.Item label="Company"><Link to={`/supplier/suppliers/${purchaseOrder.supplier.id}`}>{purchaseOrder.supplier.company_name}</Link></Descriptions.Item>
          <Descriptions.Item label="Name">{purchaseOrder.supplier.s1_name}</Descriptions.Item>
          <Descriptions.Item label="Contact">{purchaseOrder.supplier.s1_phone_number}</Descriptions.Item>
          <Descriptions.Item label="Address">{purchaseOrder.supplier.address}</Descriptions.Item>
          <Descriptions.Item label="Postal Code">{purchaseOrder.supplier.postal_code}</Descriptions.Item>
          <Descriptions.Item label="Email"><EmailLink email={purchaseOrder.supplier.company_email} /></Descriptions.Item>
        </Descriptions>
      </>
      }
    </>
  )
}
