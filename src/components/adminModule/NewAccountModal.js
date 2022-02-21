import { Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react'
import { EmployeeApiHelper } from '../../api/employees';
import { useApp } from '../../providers/AppProvider';
import { REQUIRED } from '../../utilities/form';
import { EMAIL } from '../../utilities/form';

export default function NewAccountModal({ isModalVisible, setIsModalVisible }) {
    const { handleHttpError } = useApp();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            const access_rights = [];
            setLoading(true);
            EmployeeApiHelper.createNewAccount(values, access_rights)
                .then(() => {
                    message.success('Employee successfully created!')
                    setLoading(false);
                    setIsModalVisible(false);
                    form.resetFields();
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <Modal width={600}
          title='Create an Employee'
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
