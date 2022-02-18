import { Form, Input, InputNumber, message, Modal } from 'antd'
import React, { useState } from 'react'
import { ProductApiHelper } from '../../../api/product';
import { useApp } from '../../../providers/AppProvider';

const REQUIRED = { required: true, message: 'This field is required.' };

export default function NewProductModal({ isModalVisible, setIsModalVisible, products, setProducts }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function handleOk() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            ProductApiHelper.create(values)
                .then(newProduct => {
                    message.success('Product successfully created!')
                    setProducts([newProduct, ...products]);
                    setLoading(false);
                    setIsModalVisible(false);
                    form.resetFields();
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <Modal title="Create a Product" width={600}
            visible={isModalVisible} 
            onOk={handleOk} 
            onCancel={() => setIsModalVisible(false)} 
            okButtonProps={{ loading: loading }}
        >

            <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left">
                <Form.Item label="Product Name" name="name" rules={[REQUIRED]}>
                    <Input />
                </Form.Item>

                <Form.Item name="min_inventory_level" label="Minimum Inventory" rules={[REQUIRED]}>
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item name="unit" label="Unit">
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                </Form.Item>

            </Form>

        </Modal>
    )
}
