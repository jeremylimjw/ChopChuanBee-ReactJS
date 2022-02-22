import { SaveOutlined } from '@ant-design/icons/lib/icons'
import { Button, Form, Input, InputNumber, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React from 'react'
import { POStatus } from '../../../enums/PurchaseOrderStatus'
import { PurchaseOrder } from '../../../models/PurchaseOrder'

export default function PO2Form({ purchaseOrder, setPurchaseOrder, loading, saveForLater }) {
    return (
        <>
            { purchaseOrder != null &&
            <Form layout='horizontal' labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>

                <Form.Item label="Order Status" width={3000}>
                    {purchaseOrder.getStatusTag()}
                </Form.Item>


                <Form.Item label="Invoice ID">
                    <Input 
                        value={purchaseOrder.supplier_invoice_id}
                        onChange={(e) => setPurchaseOrder(new PurchaseOrder({...purchaseOrder, supplier_invoice_id: e.target.value }))}
                        disabled={!purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} 
                    />
                </Form.Item>

                <Form.Item label="GST">
                    <Radio.Group 
                        onChange={(e) => setPurchaseOrder(new PurchaseOrder({...purchaseOrder, has_gst: e.target.value }))} 
                        value={purchaseOrder.has_gst} 
                        disabled={!purchaseOrder.isStatus(POStatus.PENDING)}
                    >
                        <Radio value={1}>None</Radio>
                        <Radio value={2}>Inclusive</Radio>
                        <Radio value={3}>Exclusive</Radio>
                    </Radio.Group>
                </Form.Item>

                {(purchaseOrder.has_gst === 2 || purchaseOrder.has_gst === 3) &&
                <Form.Item label="GST Rate">
                    <InputNumber 
                        value={purchaseOrder.gst_rate} min={0} addonAfter="%" style={{ width: 100 }}
                        disabled={!purchaseOrder.isStatus(POStatus.PENDING)}
                        onChange={(value) => setPurchaseOrder(new PurchaseOrder({...purchaseOrder, gst_rate: value }))} 
                    />
                </Form.Item>
                }

                <Form.Item label="Payment Term">
                    <Radio.Group 
                        onChange={(e) => setPurchaseOrder(new PurchaseOrder({...purchaseOrder, payment_term_id: e.target.value }))} 
                        value={purchaseOrder.payment_term_id}
                        disabled={!purchaseOrder.isStatus(POStatus.PENDING)}
                    >
                        <Radio value={1}>Cash</Radio>
                        <Radio value={2}>Credit</Radio>
                    </Radio.Group>
                </Form.Item>

                {purchaseOrder.payment_term_id === 1 &&
                <Form.Item label="Payment Method">
                    <Select style={{ width: 150 }} 
                        value={purchaseOrder.payment_method_id}
                        onChange={(value) => setPurchaseOrder(new PurchaseOrder({...purchaseOrder, payment_method_id: value })) }
                        disabled={!purchaseOrder.isStatus(POStatus.PENDING)}
                    >
                        <Select.Option value={1}>Cash</Select.Option>
                        <Select.Option value={2}>PayNow</Select.Option>
                        <Select.Option value={3}>PayLah</Select.Option>
                        <Select.Option value={4}>Bank Transfer</Select.Option>
                        <Select.Option value={5}>Cheque</Select.Option>
                    </Select>
                </Form.Item>
                }

                <Form.Item label="Remarks">
                    <TextArea 
                        value={purchaseOrder?.remarks} 
                        onChange={(e) => setPurchaseOrder(new PurchaseOrder({...purchaseOrder, remarks: e.target.value }))}
                        disabled={!purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} 
                    />
                </Form.Item>

                <Form.Item wrapperCol={{  offset: 5 }}>
                    <Button icon={<SaveOutlined />} disabled={loading || !purchaseOrder.isStatus(purchaseOrder, POStatus.PENDING, POStatus.ACCEPTED)} onClick={saveForLater}>Save for later</Button>
                </Form.Item>
                

            </Form>
            }
        </>
  )
}
