import { Form, Input, InputNumber, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'

export default function PurchaseOrderForm({ purchaseOrder, setPurchaseOrder }) {
  return (
    <Form layout='horizontal' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>

        <Form.Item label="Supplier Invoice ID">
            <Input value={purchaseOrder?.supplier_invoice_id}
                onChange={(e) => setPurchaseOrder({...purchaseOrder, supplier_invoice_id: e.target.value })} />
        </Form.Item>

        <Form.Item label="* GST">
            <Radio.Group onChange={(e) => setPurchaseOrder({...purchaseOrder, has_gst: e.target.value })} value={purchaseOrder?.has_gst}>
                <Radio value={1}>None</Radio>
                <Radio value={2}>Inclusive</Radio>
                <Radio value={3}>Exclusive</Radio>
            </Radio.Group>
        </Form.Item>

        {(purchaseOrder?.has_gst == 2 || purchaseOrder?.has_gst == 3) &&
        <Form.Item label="* GST Rate">
            <InputNumber value={purchaseOrder?.gst_rate} min={0} addonAfter="%" style={{ width: 100 }}
                onChange={(value) => setPurchaseOrder({...purchaseOrder, gst_rate: value })} />
        </Form.Item>
        }

        <Form.Item label="* Payment Term">
            <Radio.Group onChange={(e) => setPurchaseOrder({...purchaseOrder, payment_term_id: e.target.value })} value={purchaseOrder?.payment_term_id}>
                <Radio value={1}>Cash</Radio>
                <Radio value={2}>Credit</Radio>
            </Radio.Group>
        </Form.Item>

        {purchaseOrder?.payment_term_id == 1 &&
        <Form.Item label="* Payment Method">
            <Select defaultValue={1} style={{ width: 100 }} onChange={(value) => setPurchaseOrder({...purchaseOrder, payment_method_id: value }) }>
            <Select.Option value={1}>Cash</Select.Option>
            <Select.Option value={2}>PayNow</Select.Option>
            <Select.Option value={3}>PayLah</Select.Option>
            <Select.Option value={4}>Bank Transfer</Select.Option>
            <Select.Option value={5}>Cheque</Select.Option>
            </Select>
        </Form.Item>
        }

        <Form.Item label="Remarks">
            <TextArea value={purchaseOrder?.remarks} 
                onChange={(e) => setPurchaseOrder({...purchaseOrder, remarks: e.target.value })} />
        </Form.Item>

    </Form>
  )
}
