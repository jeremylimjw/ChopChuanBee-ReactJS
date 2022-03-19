import { Card, Divider, Modal, Space, Typography } from 'antd'
import QRCode from 'qrcode.react'
import React, { useEffect, useState } from 'react'
import JsBarcode from 'jsbarcode'
import MyCard from '../../../components/common/MyCard'

const DeliveryStickerTemplate = (props) => {
  useEffect(() => {
    JsBarcode("#barcode", "Test", {
      width: 4,
      height: 30,
      displayValue: false
    })
  }, [])

  const qrCodeProps = {
    value: 'https://google.com.sg'
  }

  return (
    <MyCard
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
          style={{ height: '140px', backgroundColor: 'black' }}

        />
        <QRCode
          value={qrCodeProps.value}
        />
      </div>
      <Divider />
      <div>
        <Space direction='vertical'>
          <svg id="barcode" />
          <p>Invoice No: </p>
          <p>Invoice Date:</p>
        </Space>
      </div>
    </MyCard>
  )
}

export default DeliveryStickerTemplate