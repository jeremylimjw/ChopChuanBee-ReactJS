import { Form, Input, message } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import { DeliveryApiHelper } from '../../../api/DeliveryApiHelper';
import { useApp } from '../../../providers/AppProvider';
import { exactLength, NUMBER, REQUIRED } from '../../../utilities/form';

export default function NewDeliveryModal({ orders, setOrders, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function handleOk() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            DeliveryApiHelper.createOrder(values)
                .then(newDeliveryOrder => {
                    message.success('Delivery order successfully created!')
                    setOrders([newDeliveryOrder, ...orders]);
                    setLoading(false);
                    setIsModalVisible(false);
                    form.resetFields();
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <Modal title="Create a Delivery Order" width={600}
            visible={isModalVisible} 
            onOk={handleOk} 
            onCancel={() => setIsModalVisible(false)} 
            okButtonProps={{ loading: loading }}
        >

            <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left">

                <Form.Item label="Address" name="address" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Postal Code" name="postal_code" rules={[REQUIRED, exactLength(6), NUMBER]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                </Form.Item>

            </Form>

        </Modal>
    )
}
