import { Button, Divider, Form, Input, message, Radio } from 'antd'
import React, { useState } from 'react'
import { CustomerApiHelper } from '../../../api/customer';
import { useApp } from '../../../providers/AppProvider';

const ERROR_MESSAGE = 'This field is required.';
const REQUIRED = [{ required: true, message: ERROR_MESSAGE }];

export default function C1Form({ customer, setCustomer }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    function onFinish(values) {
        setLoading(true);
        CustomerApiHelper.update({...values, id: customer.id })
            .then(() => {
                setLoading(false);
                setCustomer({...customer, ...values });
                message.success('Customer successfully updated!');
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    return (
        <>
        { customer != null &&
            <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} autoComplete="off"
                initialValues={{...customer}} 
                onFinish={onFinish}
            >
                <Form.Item label="Company Name" name="company_name" rules={REQUIRED}>
                    <Input />
                </Form.Item>

                <Form.Item name="gst" label="GST" rules={REQUIRED}>
                    <Radio.Group>
                        <Radio.Button value={true}>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="gst_show" label="Show GST" rules={REQUIRED}>
                    <Radio.Group>
                        <Radio.Button value={true}>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="charged_under_id" label="Charged Under" rules={REQUIRED}>
                    <Radio.Group>
                        <Radio.Button value={1}>CCB</Radio.Button>
                        <Radio.Button value={2}>CBFS</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Address" name="address" rules={REQUIRED}>
                    <Input />
                </Form.Item>

                <Form.Item label="Postal Code" name="postal_code" rules={REQUIRED}>
                    <Input />
                </Form.Item>

                <Form.Item label="Email" name="company_email">
                    <Input />
                </Form.Item>

                <Divider />

                <Form.Item label="POC 1" name="p1_name" rules={REQUIRED}>
                    <Input />
                </Form.Item>

                <Form.Item label="POC 1 Number" name="p1_phone_number" rules={REQUIRED}>
                    <Input />
                </Form.Item>

                <Form.Item label="POC 2" name="p2_name">
                    <Input />
                </Form.Item>

                <Form.Item label="POC 2 Number" name="p2_phone_number">
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item wrapperCol={{  offset: 6, span: 10 }} htmlType="submit" disabled={loading}>
                    <Button type="primary" htmlType="submit">Save Changes</Button>
                </Form.Item>

            </Form>
        }
        </>
    )
}
