import { SaveOutlined } from '@ant-design/icons/lib/icons'
import { Button, Divider, Form, Input, InputNumber, Radio, Select, Typography } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'
import { getPaymentMethodTag, PaymentMethod } from '../../../enums/PaymentMethod'
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
    const [showDelivery, setShowDelivery] = useState(salesOrder.has_delivery);
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
        if (field.has_delivery != null) {
            setShowDelivery(field.has_delivery);
        }

        // For real-time update of PO calculations
        if (field.has_gst) {
            if (+field.has_gst === 1) { // No GST
                setSalesOrder(new SalesOrder({...salesOrder, has_gst: field.has_gst, gst_rate: 0 }));
                form.setFieldsValue({ gst_rate: 0 })
                setShowGstRate(false);
            } else { // Have GST
                setSalesOrder(new SalesOrder({...salesOrder, has_gst: field.has_gst }));
                setShowGstRate(true);
            }
        }
        if (field.gst_rate) {
            setSalesOrder(new SalesOrder({...salesOrder, gst_rate: field.gst_rate }))
        }

        // Update fields to charged under fields
        if (field.charged_under_id && field.charged_under_id != null) { // If is changing charged_under_id
            const index = chargedUnders.findIndex(x => x.id === field.charged_under_id)
            const initialFields = { has_gst: +chargedUnders[index].gst_rate === 0 ? 1 : 2, gst_rate: chargedUnders[index].gst_rate };
            form.setFieldsValue(initialFields);
            setShowGstRate(initialFields.has_gst === 2);
            setSalesOrder(new SalesOrder({...salesOrder, ...initialFields }))
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
                <Form.Item name="charged_under_id" label="Charged Under" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                    { salesOrder.isStatus(POStatus.PENDING) ? 
                        <Select style={{ width: 180 }} onSelect={handleChargedUnderChange}>
                            <Select.Option value={null}>None</Select.Option>
                            { chargedUnders.map((x, idx) => <Select.Option key={idx} value={x.id}>{x.name}</Select.Option>)}
                        </Select>
                    :
                        <Typography.Text>{salesOrder.charged_under.name}</Typography.Text>
                    }
                </Form.Item>

                <Form.Item label="GST" name="has_gst" rules={ salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                    { salesOrder.isStatus(POStatus.PENDING) ? 
                        <Radio.Group>
                            <Radio value={1}>No</Radio>
                            <Radio value={2}>Yes</Radio>
                        </Radio.Group>
                    :
                        <Typography.Text>{salesOrder.has_gst ? 'Yes' : 'No'}</Typography.Text>
                    }
                </Form.Item>

                {showGstRate &&
                <>
                    <Form.Item label="GST Rate" name="gst_rate" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                        {salesOrder.isStatus(POStatus.PENDING) ? 
                            <InputNumber min={0} addonAfter="%" style={{ width: 100 }} />
                        :
                            <Typography.Text>{salesOrder.gst_rate} %</Typography.Text>
                        }
                    </Form.Item>

                    <Form.Item label="Show GST" name="show_gst" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                        {salesOrder.isStatus(POStatus.PENDING) ? 
                            <Radio.Group>
                                <Radio value={false}>No</Radio>
                                <Radio value={true}>Yes</Radio>
                            </Radio.Group>
                        :
                            <Typography.Text>{salesOrder.show_gst ? 'Yes' : 'No'}</Typography.Text>
                        }
                    </Form.Item>
                </>
                }

                <Form.Item label="Payment Term" name="payment_term_id" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                    {salesOrder.isStatus(POStatus.PENDING) ? 
                        <Radio.Group>
                            {Object.keys(PaymentTerm).map((key, idx) => <Radio key={idx} value={PaymentTerm[key].id}>{PaymentTerm[key].name}</Radio>)}
                        </Radio.Group>
                    :
                        <Typography.Text>{salesOrder.getPaymentTermTag()}</Typography.Text>
                    }
                </Form.Item>

                {showPaymentMethod &&
                    <Form.Item label="Payment Method" name="payment_method_id" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                        {salesOrder.isStatus(POStatus.PENDING) ? 
                            <Select style={{ width: 150 }}>
                                {Object.keys(PaymentMethod).map((key, idx) => <Select.Option key={idx} value={PaymentMethod[key].id}>{PaymentMethod[key].name}</Select.Option>)}
                            </Select>
                        :
                            <Typography.Text>{getPaymentMethodTag(salesOrder.payment_method_id)}</Typography.Text>
                        }
                    </Form.Item>
                }

                <Form.Item label="Remarks" name="remarks">
                    {salesOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED) ? 
                        <TextArea />
                    :
                        <Typography.Text>{salesOrder.remarks || '-'}</Typography.Text>
                    }
                </Form.Item>
                
                <Typography.Title level={5}>Delivery Details</Typography.Title>
                <Divider/>

                <Form.Item label="Delivery Required" name="has_delivery" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                    {salesOrder.isStatus(POStatus.PENDING) ? 
                        <Radio.Group>
                            <Radio value={false}>No</Radio>
                            <Radio value={true}>Yes</Radio>
                        </Radio.Group>
                    :
                        <Typography.Text>{salesOrder.has_delivery ? 'Yes' : 'No'}</Typography.Text>
                    }
                </Form.Item>

                {showDelivery &&
                    <>
                        <Form.Item label="Address" name="delivery_address" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                            {salesOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED) ? 
                                <Input />
                            :
                                <Typography.Text>{salesOrder.delivery_address}</Typography.Text>
                            }
                        </Form.Item>

                        <Form.Item label="Postal Code" name="delivery_postal_code" rules={salesOrder.isStatus(POStatus.PENDING) ? [REQUIRED] : []}>
                            {salesOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED) ? 
                                <Input />
                            :
                                <Typography.Text>{salesOrder.delivery_postal_code}</Typography.Text>
                            }
                        </Form.Item>

                        <Form.Item label="Remarks" name="delivery_remarks">
                            {salesOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED) ? 
                                <TextArea />
                            :
                                <Typography.Text>{salesOrder.delivery_remarks || '-'}</Typography.Text>
                            }
                        </Form.Item>
                    </>
                }

                { (hasWriteAccessTo(View.CRM.id) && salesOrder.isStatus(POStatus.PENDING, POStatus.ACCEPTED)) &&
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button icon={<SaveOutlined />} disabled={loading} onClick={saveForLater}>Save for later</Button>
                </Form.Item>
                }

            </Form>
            }
        </>
  )
}
