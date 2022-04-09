import { Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
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

    function resetForm() {
        form.resetFields();
    }

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            setLoading(true);

            CatalogueApiHelper.createNewCategory(values)
                .then((newCategory) => {
                    myCallback(newCategory);
                    message.success('Catalogue successfully created!');
                    setLoading(false);
                    resetForm();
                    setIsModalVisible(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) {}
    }

    return (
        <Modal
            width={600}
            title='Create a Catalogue'
            visible={isModalVisible}
            onOk={handleSubmit}
            onCancel={() => onCancel()}
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
