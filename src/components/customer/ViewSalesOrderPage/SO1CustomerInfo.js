import { Descriptions } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import EmailLink from '../../../utilities/EmailLink'

export default function SO1CustomerInfo({ salesOrder }) {
  return (
    <>
      {salesOrder != null &&
      <>
        <Descriptions bordered size="small" layout='horizontal' column={1}>
          <Descriptions.Item label="Company"><Link to={`/customer/customers/${salesOrder.customer.id}`}>{salesOrder.customer.company_name}</Link></Descriptions.Item>
          <Descriptions.Item label="Name">{salesOrder.customer.p1_name}</Descriptions.Item>
          <Descriptions.Item label="Contact">{salesOrder.customer.p1_phone_number}</Descriptions.Item>
          <Descriptions.Item label="Address">{salesOrder.customer.address}</Descriptions.Item>
          <Descriptions.Item label="Postal Code">{salesOrder.customer.postal_code}</Descriptions.Item>
          <Descriptions.Item label="Email"><EmailLink email={salesOrder.customer.company_email} /></Descriptions.Item>
        </Descriptions>
      </>
      }
    </>
  )
}
