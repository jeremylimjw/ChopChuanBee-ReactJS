import { Descriptions } from 'antd'
import React from 'react'
import { getRoleTag } from '../../../enums/Role'
import MyCard from '../../common/MyCard'

export default function I2Driver({ itinerary }) {
  return (
    <MyCard title="Assigned Driver" style={{ width: 400 }}>
        
      <Descriptions bordered size="small" layout='horizontal' column={1}>
        <Descriptions.Item label="Name">{itinerary.employee?.name}</Descriptions.Item>
        <Descriptions.Item label="Role">{getRoleTag(itinerary.employee?.role_id)}</Descriptions.Item>
        <Descriptions.Item label="Contact">{itinerary.employee?.contact_number}</Descriptions.Item>
        <Descriptions.Item label="Email">{itinerary.employee?.email || '-'}</Descriptions.Item>
      </Descriptions>
        
    </MyCard>
  )
}
