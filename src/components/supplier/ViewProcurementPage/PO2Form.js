import { SaveOutlined } from '@ant-design/icons/lib/icons'
import { Button, Form, Input, InputNumber, Radio, Select, Typography } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'
import { getPaymentMethodTag, PaymentMethod } from '../../../enums/PaymentMethod'
import { POStatus } from '../../../enums/PurchaseOrderStatus'
import { PaymentTerm } from '../../../enums/PaymentTerm'
import { REQUIRED } from '../../../utilities/form'
import { ChargedUnderApiHelper } from '../../../api/ChargedUnderApiHelper'
import { useApp } from '../../../providers/AppProvider'
import { View } from '../../../enums/View'
import { PurchaseOrder } from '../../../models/PurchaseOrder'

export default function PO2Form({ form, purchaseOrder, setPurchaseOrder, loading, saveForLater }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [showGstRate, setShowGstRate] = useState(purchaseOrder.has_gst === 2 || purchaseOrder.has_gst === 3);
    const [showPaymentMethod, setShowPaymentMethod] = useState(purchaseOrder.payment_term_id === PaymentTerm.CASH.id);
    const [chargedUnders, setChargedUnders] = useState([]);

    useEffect(() => {
        ChargedUnderApiHelper.getAvailable()
            .then(results => {
                setChargedUnders(results)
            })
            .catch(handleHttpError);
    }, [handleHttpError])

    // Whether to render the dependent form values or not
    function onValuesChange(field) {
        if (field.payment_term_id) {
            setShowPaymentMethod(field.payment_term_id === PaymentTerm.CASH.id);
        }

        // For real-time update of PO calculations
        if (field.has_gst) {
            if (+field.has_gst === 1) { // No GST
                setPurchaseOrder(new PurchaseOrder({...purchaseOrder, has_gst: field.has_gst, gst_rate: 0 }));
                form.setFieldsValue({ gst_rate: 0 })
                setShowGstRate(false);
            } else { // Have GST (Inclusive or Exclusive)
                setPurchaseOrder(new PurchaseOrder({...purchaseOrder, has_gst: field.has_gst }));
                setShowGstRate(true);
            }
        }
        if (field.gst_rate) {
            setPurchaseOrder(new PurchaseOrder({...purchaseOrder, gst_rate: field.gst_rate }))
        }
    }

    function handleChargedUnderChange(id) {
        const index = chargedUnders.findIndex(x => x.id === id);
        if (index >= 0) {
            const chargedUnder = chargedUnders[index];
            setPurchaseOrder(new PurchaseOrder({...purchaseOrder, charged_under: {...chargedUnder } }))
            form.setFieldsValue({ charged_under: {...chargedUnder } });
        } else {
            setPurchaseOrder(new PurchaseOrder({...purchaseOrder, charged_under: null }))
            form.setFieldsValue({ charged_under: null });
        }
    }

    return (
        <>
            { purchaseOrder != null &&
            <Form form={form} layout='horizontal' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} onValuesChange={onValuesChange} initialValues={{...purchaseOrder}}>

                <Form.Item label="Order Status">
                    {purchaseOrder.getStatusTag()}
                </Form.Item>

                <Form.Item label="Invoice ID" name="supplier_invoice_id" rules={purchaseOrder.isStatus(POStatus.ACCEPTED) ? [REQUIRED] : []}>
                    {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT, POStatus.ACCEPTED) ? 
                        <Input />
                    :
                        <Typography.Text>{purchaseOrder.supplier_invoice_id}</Typography.Text>
                    }
                </Form.Item>

                <Form.Item name="charged_under" hidden><Input /></Form.Item>
                <Form.Item name="charged_under_id" label="Charged Under" rules={purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? [REQUIRED] : []}>
                    {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? 
                        <Select style={{ width: 180 }} onSelect={handleChargedUnderChange}>
                            <Select.Option value={null}>None</Select.Option>
                            { chargedUnders.map((x, idx) => <Select.Option key={idx} value={x.id}>{x.name}</Select.Option>)}
                        </Select>
                    :
                        <Typography.Text>{purchaseOrder.charged_under.name}</Typography.Text>
                    }
                </Form.Item>

                <Form.Item label="GST" name="has_gst" rules={purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? [REQUIRED] : []}>
                    {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? 
                        <Radio.Group>
                            <Radio value={1}>None</Radio>
                            <Radio value={2}>Inclusive</Radio>
                            <Radio value={3}>Exclusive</Radio>
                        </Radio.Group>
                    :
                        <Typography.Text>{purchaseOrder.has_gst === 1 ? 'None' : (purchaseOrder.has_gst === 2 ? 'Inclusive' : 'Exclusive')}</Typography.Text>
                    }
                </Form.Item>

                {showGstRate &&
                    <Form.Item label="GST Rate" name="gst_rate" rules={purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? [REQUIRED] : []}>
                        {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? 
                            <InputNumber min={0} addonAfter="%" style={{ width: 100 }} />
                        :
                            <Typography.Text>{purchaseOrder.gst_rate} %</Typography.Text>
                        }
                    </Form.Item>
                }

                <Form.Item label="Payment Term" name="payment_term_id" rules={purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? [REQUIRED] : []}>
                    {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? 
                        <Radio.Group>
                            {Object.keys(PaymentTerm).map((key, idx) => <Radio key={idx} value={PaymentTerm[key].id}>{PaymentTerm[key].name}</Radio>)}
                        </Radio.Group>
                    :
                        <Typography.Text>{purchaseOrder.getPaymentTermTag()}</Typography.Text>
                    }
                </Form.Item>

                {showPaymentMethod &&
                    <Form.Item label="Payment Method" name="payment_method_id" rules={purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? [REQUIRED] : []}>
                        {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT) ? 
                            <Select style={{ width: 150 }}>
                                {Object.keys(PaymentMethod).map((key, idx) => <Select.Option key={idx} value={PaymentMethod[key].id}>{PaymentMethod[key].name}</Select.Option>)}
                            </Select>
                        :
                            <Typography.Text>{getPaymentMethodTag(purchaseOrder.payment_method_id)}</Typography.Text>
                        }
                    </Form.Item>
                }

                <Form.Item label="Remarks" name="remarks">
                    {purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT_EMAIL, POStatus.SENT_TEXT, POStatus.ACCEPTED) ? 
                        <TextArea />
                    :
                        <Typography.Text>{purchaseOrder.remarks || '-'}</Typography.Text>
                    }
                </Form.Item>

                { (hasWriteAccessTo(View.SCM.name) && purchaseOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)) &&
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button icon={<SaveOutlined />} disabled={loading} onClick={saveForLater}>Save for later</Button>
                </Form.Item>
                }

            </Form>
            }
        </>
  )
}
