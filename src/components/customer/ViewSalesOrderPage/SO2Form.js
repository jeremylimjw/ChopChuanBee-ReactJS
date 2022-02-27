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
import { SalesOrder } from '../../../models/SalesOrder'

export default function SO2Form({ form, salesOrder, setSalesOrder, loading, saveForLater }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [showGstRate, setShowGstRate] = useState(salesOrder.has_gst === 2 || salesOrder.has_gst === 3);
    const [showPaymentMethod, setShowPaymentMethod] = useState(salesOrder.payment_term_id === PaymentTerm.CASH.id);
    const [chargedUnders, setChargedUnders] = useState([]);

    useEffect(() => {
        ChargedUnderApiHelper.getAvailable()
            .then(results => {
                setChargedUnders(results)
            })
            .catch(handleHttpError);
    }, [handleHttpError])

    // Whether to render the dependent form values or not
    function onValuesChange(field, newValues) {
        setShowGstRate(newValues.has_gst === 2);
        setShowPaymentMethod(newValues.payment_term_id === PaymentTerm.CASH.id);

        // Update fields to charged under fields
        if (field.charged_under_id != null) { // If is changing charged_under_id
            const index = chargedUnders.findIndex(x => x.id === field.charged_under_id)
            const initialFields = { has_gst: +chargedUnders[index].gst_rate === 0 ? 1 : 2, gst_rate: chargedUnders[index].gst_rate };
            setShowGstRate(initialFields.has_gst === 2);
            form.setFieldsValue(initialFields);
            setSalesOrder(new SalesOrder({...salesOrder, ...initialFields }))
        } else {
            // This is for updating the order items table whenever user changes the input
            setSalesOrder(new SalesOrder({...salesOrder, has_gst: newValues.has_gst, gst_rate: newValues.gst_rate }))
        }
    }

    function handleChargedUnderChange(id) {
        const index = chargedUnders.findIndex(x => x.id === id);
        form.setFieldsValue({ charged_under: (id == null ? null : {...chargedUnders[index] }) });
    }

    return (
        <>
            { salesOrder != null &&
            <Form form={form} layout='horizontal' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onValuesChange={onValuesChange} initialValues={{...salesOrder}}>

                <Form.Item label="Order Status">
                    {salesOrder.getStatusTag()}
                </Form.Item>

                <Form.Item name="charged_under" hidden><Input /></Form.Item>
                <Form.Item name="charged_under_id" label="Charged Under" rules={[REQUIRED]}>
                    <Select style={{ width: 140 }} onSelect={handleChargedUnderChange} disabled={!salesOrder.isStatus(POStatus.PENDING)}>
                        <Select.Option value={null}>None</Select.Option>
                        { chargedUnders.map((x, idx) => <Select.Option key={idx} value={x.id}>{x.name}</Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="GST" name="has_gst" rules={[REQUIRED]}>
                    <Radio.Group disabled={!salesOrder.isStatus(POStatus.PENDING)}>
                        <Radio value={2}>Yes</Radio>
                        <Radio value={1}>No</Radio>
                    </Radio.Group>
                </Form.Item>

                {showGstRate &&
                <>
                    <Form.Item label="GST Rate" name="gst_rate" rules={[REQUIRED]}>
                        <InputNumber min={0} addonAfter="%" style={{ width: 100 }} disabled={!salesOrder.isStatus(POStatus.PENDING)} />
                    </Form.Item>
                    <Form.Item label="Show GST" name="show_gst" rules={[REQUIRED]}>
                        <Radio.Group disabled={!salesOrder.isStatus(POStatus.PENDING)}>
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                        </Radio.Group>
                    </Form.Item>
                </>
                }

                <Form.Item label="Payment Term" name="payment_term_id" rules={[REQUIRED]}>
                    <Radio.Group disabled={!salesOrder.isStatus(POStatus.PENDING)}>
                        {Object.keys(PaymentTerm).map((key, idx) => <Radio key={idx} value={PaymentTerm[key].id}>{PaymentTerm[key].name}</Radio>)}
                    </Radio.Group>
                </Form.Item>

                {showPaymentMethod &&
                    <Form.Item label="Payment Method" name="payment_method_id" rules={[REQUIRED]}>
                        <Select style={{ width: 150 }} disabled={!salesOrder.isStatus(POStatus.PENDING)}>
                            {Object.keys(PaymentMethod).map((key, idx) => <Select.Option key={idx} value={PaymentMethod[key].id}>{PaymentMethod[key].name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                }

                <Form.Item label="Remarks" name="remarks">
                    <TextArea disabled={!salesOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} />
                </Form.Item>

                {hasWriteAccessTo(View.CRM.id) &&
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button icon={<SaveOutlined />} disabled={loading || !salesOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)} onClick={saveForLater}>Save for later</Button>
                </Form.Item>
                }

            </Form>
            }
        </>
  )
}
