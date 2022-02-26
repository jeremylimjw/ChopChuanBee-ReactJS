import { Form, Input, InputNumber, message, Modal } from 'antd';
import React, { useState } from 'react'
import { ChargedUnderApiHelper } from '../../../api/ChargedUnderApiHelper';
import { useApp } from '../../../providers/AppProvider';
import { minLength, REQUIRED } from '../../../utilities/form';

export default function NewChargedUnderModal({ isModalVisible, setIsModalVisible, myCallback }) {
    const { handleHttpError } = useApp();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            ChargedUnderApiHelper.create(values)
                .then(newChargedUnder => {
                    myCallback(newChargedUnder);
                    message.success('Scheme successfully created!')
                    setLoading(false);
                    setIsModalVisible(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <Modal width={600}
          title='Create a Scheme'
          visible={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          destroyOnClose
          okButtonProps={{ loading: loading }}
        >
            <MyForm form={form} />
        </Modal>
    )
}

function MyForm({ form }) {
    return (
        <>
            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off" labelAlign="left">

                <Form.Item label="Company Name" name="name" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>
                
                <Form.Item label="Address" name="address" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>
                
                <Form.Item label="Shipping Address" name="shipping_address" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>
                
                <Form.Item label="Contact Number" name="contact_number" rules={[REQUIRED, minLength(8)]}>
                    <Input />
                </Form.Item>
                
                <Form.Item label="Registration Number" name="registration_number">
                    <Input />
                </Form.Item>
                
                <Form.Item label="GST Rate" name="gst_rate" initialValue={0}>
                    <InputNumber min={0} addonAfter="%" style={{ width: 100 }} />
                </Form.Item>
                
            </Form>
        </>
    )

}
