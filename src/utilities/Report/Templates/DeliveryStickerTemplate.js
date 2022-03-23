import { Card, Divider, Modal, Space, Typography } from 'antd'
import QRCode from 'qrcode.react'
import React, { useEffect, useState } from 'react'
import MyCard from '../../../components/common/MyCard'
let itineraryObj = require('../DeliveryItineraryObj.json')

const DeliveryStickerTemplate = (props) => {
  const getQRCode = (data) => {
    let imageString = "data:image/png;base64,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"
    return imageString
  }

  const imageString = getQRCode()

  const qrCodeProps = {
    value: 'https://localhost:3001',
    size: 64
  }

  return (
    <Card
      style={{ width: 300, margin: 20 }}
    >
      <Typography.Title level={5}>To: ADDRESSEE</Typography.Title>
      <Divider />
      <div
        style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Space direction='vertical'>
          <p>ABC Food Stall</p>
          <p>John Tan</p>
          <p>+65 60001000</p>
        </Space>
        <Divider
          type='vertical'
          style={{ height: '110px', backgroundColor: 'black' }}

        />
        <img src={`${imageString}`} alt='' style={{ width: '128px', height: '128px' }} />
      </div>
      <Divider />
      <div>
        <Space direction='vertical'>
          <p>Address</p>
          <p>{props.address}</p>
        </Space>
      </div>
      <Divider />
      <p>Remarks</p>
    </Card>
  )
}

export default DeliveryStickerTemplate