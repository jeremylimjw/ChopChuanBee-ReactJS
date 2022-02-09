import { Form, Button, Input } from 'antd'
import React from 'react'
import { GeneralApiHelper } from '../../api/general'
import { useApp } from '../../providers/AppProvider'

const ResetPasswordForm = (props) => {
    const [resetPasswordForm] = Form.useForm();
    const { handleHttpError } = useApp();

    const handleFinish = async (values) => {
        let result = await GeneralApiHelper.changePassword(values.oldPassword, values.newPassword).catch(handleHttpError);
        props.setChangePasswordModalVisibility(false);
        if (result == "200") {
            props.setSuccessMessageVisibility(true);
        } else {
            props.setFailureMessage(result);
            props.setFailureMessageVisibility(true);
        }
    }

    return (
        <>
            <Form form={resetPasswordForm} onFinish={handleFinish}>
                <Form.Item
                    label="Old password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Required' }]}
                    >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="New password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Required' }]}
                    >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default ResetPasswordForm;