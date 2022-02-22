import { Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react'
import { GeneralApiHelper } from '../../api/general';
import { useApp } from '../../providers/AppProvider';
import { REQUIRED } from '../../utilities/form';
import { EMAIL } from '../../utilities/form';

export default function ForgotPasswordModal({ isModalVisible, setIsModalVisible }) {
    const { handleHttpError } = useApp();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            GeneralApiHelper.resetPassword(values.username, values.email)
                .then(() => {
                    message.success('We have sent you an email with a new password! Please login using the new password.')
                    setLoading(false);
                    setIsModalVisible(false);
                    form.resetFields();
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    function onCancel() {
        form.resetFields();
        setIsModalVisible(false);
    }

    return (
        <Modal width={500}
          title='Reset password'
          visible={isModalVisible}
          onOk={handleSubmit}
          onCancel={onCancel}
          destroyOnClose
          okButtonProps={{ loading: loading }}
        >
            <MyForm form={form} />

        </Modal>
    )
}

function MyForm({ form }) {

    return (
        <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left">
            <Form.Item label="Username" name="username" rules={[REQUIRED]}>
                <Input />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[REQUIRED, EMAIL]}>
                <Input />
            </Form.Item>
        </Form>
    )

}
