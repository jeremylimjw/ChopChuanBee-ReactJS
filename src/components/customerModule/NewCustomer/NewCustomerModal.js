import { Divider, Form, Input, message, Radio, Typography } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import { CustomerApiHelper } from '../../../api/customer';
import { useApp } from '../../../providers/AppProvider';

const ERROR_MESSAGE = 'This field is required.';
const REQUIRED = [{ required: true, message: ERROR_MESSAGE }];

export default function NewCustomerModal({ isModalVisible, setIsModalVisible, customers, setCustomers }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function handleOk() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            CustomerApiHelper.create(values)
                .then(newCustomer => {
                    message.success('Customer successfully created!')
                    setCustomers([...customers, newCustomer]);
                    setLoading(false);
                    setIsModalVisible(false);
                    form.resetFields();
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <Modal title="Create a Customer" width={600}
            visible={isModalVisible} 
            onOk={handleOk} 
            onCancel={() => setIsModalVisible(false)} 
            bodyStyle={{ height: "60vh", overflowY: "scroll" }}
            okButtonProps={{ loading: loading }}
        >

            <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left">
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

                <Form.Item label="Description" name="description">
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                </Form.Item>

                <Divider />
                <Typography.Title level={5}>Contact Person 1</Typography.Title>

                <Form.Item label="POC 1" name="p1_name" rules={REQUIRED}>
                    <Input />
                </Form.Item>

                <Form.Item label="POC 1 Number" name="p1_phone_number" rules={REQUIRED}>
                    <Input />
                </Form.Item>

                <Divider />
                <Typography.Title level={5}>Contact Person 2</Typography.Title>

                <Form.Item label="POC 2" name="p2_name">
                    <Input />
                </Form.Item>

                <Form.Item label="POC 2 Number" name="p2_phone_number">
                    <Input />
                </Form.Item>

            </Form>

        </Modal>
    )
}
