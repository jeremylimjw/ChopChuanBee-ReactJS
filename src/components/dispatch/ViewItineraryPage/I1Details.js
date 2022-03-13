import { Descriptions } from 'antd'
import React from 'react'
import { parseDateTimeSeconds } from '../../../utilities/datetime'
import MyCard from '../../common/MyCard'

export default function I1Details({ itinerary }) {
  return (
    <MyCard style={{ width: 450, height: 262 }} title="Itinerary Details">
                
        <Descriptions bordered size="small" layout='horizontal' column={1}>
            <Descriptions.Item label="Start Time">{parseDateTimeSeconds(itinerary.start_time)}</Descriptions.Item>
            <Descriptions.Item label="Session">{itinerary.session}</Descriptions.Item>
            <Descriptions.Item label="Origin Postal Code">{itinerary.origin_postal_code}</Descriptions.Item>
        </Descriptions>

    </MyCard>
  )
}
