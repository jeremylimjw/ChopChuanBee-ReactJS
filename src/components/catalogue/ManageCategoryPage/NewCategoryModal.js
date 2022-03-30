import { Form, Input, InputNumber, message, Modal, Select, Upload, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { CatalogueApiHelper } from '../../../api/CatalogueApiHelper';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';

export default function NewCategoryModal({ isModalVisible, setIsModalVisible, myCallback }) {
    const { handleHttpError } = useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    function onCancel() {
        setIsModalVisible(false);
        form.resetFields();
    }

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            message.success('Category successfully created!');
            setLoading(false);
            setIsModalVisible(false);
            // CatalogueApiHelper.create(values)
            //     .then(newChargedUnder => {
            //         myCallback(newChargedUnder);
            //         message.success('Catalogue successfully created!')
            //         setLoading(false);
            //         setIsModalVisible(false);
            //     })
            //     .catch(handleHttpError)
            //     .catch(() => setLoading(false));
        } catch (err) {}
    }

    return (
        <Modal
            width={600}
            title='Create a Catalogue'
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => setIsModalVisible(false)}
            destroyOnClose
            okButtonProps={{ loading: loading }}
        >
            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete='off' labelAlign='left'>
                <Form.Item label='Category Name' name='name' rules={[REQUIRED]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
