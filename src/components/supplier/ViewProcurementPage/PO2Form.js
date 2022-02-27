import { SaveOutlined } from '@ant-design/icons/lib/icons'
import { Button, Form, Input, InputNumber, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'
import { PaymentMethod } from '../../../enums/PaymentMethod'
import { POStatus } from '../../../enums/PurchaseOrderStatus'
import { PaymentTerm } from '../../../enums/PaymentTerm'
import { REQUIRED } from '../../../utilities/form'
import { ChargedUnderApiHelper } from '../../../api/ChargedUnderApiHelper'
import { useApp } from '../../../providers/AppProvider'
import { View } from '../../../enums/View'
import { PurchaseOrder } from '../../../models/PurchaseOrder'

export default function PO2Form({ form, purchaseOrder, setPurchaseOrder, loading, saveForLater }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [showGstRate, setShowGstRate] = useState(false);
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [chargedUnders, setChargedUnders] = useState([]);

    useEffect(() => {
        ChargedUnderApiHelper.getAvailable()
            .then(results => {
                setChargedUnders(results)
            })
            .catch(handleHttpError);
    }, [handleHttpError])

    // Form value initiation
    useEffect(() => {
        // 1: None, 2: Inclusive, 3: Exclusive
        if (purchaseOrder.has_gst === 2 || purchaseOrder.has_gst === 3) {
            setShowGstRate(true);
        }
        if (purchaseOrder.payment_term_id === PaymentTerm.CASH.id) {
            setShowPaymentMethod(true);
        }
    }, [form, purchaseOrder])

    // Whether to render the dependent form values or not
    function onValuesChange(_, newValues) {
        setShowGstRate(newValues.has_gst === 2 || newValues.has_gst === 3);
        setShowPaymentMethod(newValues.payment_term_id === PaymentTerm.CASH.id);

        // This is for updating the order items table whenever user changes the input
        setPurchaseOrder(new PurchaseOrder({...purchaseOrder, has_gst: newValues.has_gst, gst_rate: newValues.gst_rate }))
    }

    function handleChargedUnderChange(id) {
        const index = chargedUnders.findIndex(x => x.id === id);
        form.setFieldsValue({ charged_under: (id == null ? null : {...chargedUnders[index] }) });
    }

    return (
        <>
            { purchaseOrder != null &&
            <Form form={form} layout='horizontal' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onValuesChange={onValuesChange} initialValues={{...purchaseOrder}}>

                <Form.Item label="Order Status">
                    {purchaseOrder.getStatusTag()}
                </Form.Item>

                <Form.Item label="Invoice ID" name="supplier_invoice_id" rules={purchaseOrder.isStatus(POStatus.ACCEPTED) ? [REQUIRED] : []}>
                    <Input disabled={!purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} />
                </Form.Item>

                <Form.Item name="charged_under" hidden><Input /></Form.Item>
                <Form.Item name="charged_under_id" label="Charged Under" rules={[REQUIRED]}>
                    <Select style={{ width: 140 }} onSelect={handleChargedUnderChange} disabled={!purchaseOrder.isStatus(POStatus.PENDING)}>
                        <Select.Option value={null}>None</Select.Option>
                        { chargedUnders.map((x, idx) => <Select.Option key={idx} value={x.id}>{x.name}</Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="GST" name="has_gst" rules={[REQUIRED]}>
                    <Radio.Group disabled={!purchaseOrder.isStatus(POStatus.PENDING)}>
                        <Radio value={1}>None</Radio>
                        <Radio value={2}>Inclusive</Radio>
                        <Radio value={3}>Exclusive</Radio>
                    </Radio.Group>
                </Form.Item>

                {showGstRate &&
                    <Form.Item label="GST Rate" name="gst_rate" rules={[REQUIRED]}>
                        <InputNumber min={0} addonAfter="%" style={{ width: 100 }} disabled={!purchaseOrder.isStatus(POStatus.PENDING)} />
                    </Form.Item>
                }

                <Form.Item label="Payment Term" name="payment_term_id" rules={[REQUIRED]}>
                    <Radio.Group disabled={!purchaseOrder.isStatus(POStatus.PENDING)}>
                        {Object.keys(PaymentTerm).map((key, idx) => <Radio key={idx} value={PaymentTerm[key].id}>{PaymentTerm[key].name}</Radio>)}
                    </Radio.Group>
                </Form.Item>

                {showPaymentMethod &&
                    <Form.Item label="Payment Method" name="payment_method_id" rules={[REQUIRED]}>
                        <Select style={{ width: 150 }} disabled={!purchaseOrder.isStatus(POStatus.PENDING)}>
                            {Object.keys(PaymentMethod).map((key, idx) => <Select.Option key={idx} value={PaymentMethod[key].id}>{PaymentMethod[key].name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                }

                <Form.Item label="Remarks" name="remarks">
                    <TextArea disabled={!purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} />
                </Form.Item>

                {hasWriteAccessTo(View.SCM.id) &&
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button icon={<SaveOutlined />} disabled={loading || !purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} onClick={saveForLater}>Save for later</Button>
                </Form.Item>
                }

            </Form>
            }
        </>
  )
}
