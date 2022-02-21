import { Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react'
import { GeneralApiHelper } from '../../api/general';
import { useApp } from '../../providers/AppProvider';
import { minLength, REQUIRED } from '../../utilities/form';

export default function ChangePasswordModal({ isModalVisible, setIsModalVisible }) {
    const { handleHttpError } = useApp();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            GeneralApiHelper.changePassword(values.oldPassword, values.newPassword)
                .then(() => {
                    message.success('Password successfully changed!')
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
          title='Change password'
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
            <Form.Item label="Old password" name="oldPassword" rules={[REQUIRED]}>
                <Input.Password />
            </Form.Item>

            <Form.Item label="New password" name="newPassword" rules={[REQUIRED, minLength(6)]}>
                <Input.Password />
            </Form.Item>
            
            <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} hasFeedback
                rules={[REQUIRED, ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                        }

                     return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                })]}
            >
                <Input.Password />
            </Form.Item>
        </Form>
    )

}
