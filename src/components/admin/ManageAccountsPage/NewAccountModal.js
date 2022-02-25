import { Form, Input, message, Modal, Radio, Tabs } from 'antd';
import React, { useState } from 'react'
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { Role } from '../../../enums/Role';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { EMAIL, minLength, REQUIRED } from '../../../utilities/form';

export default function NewAccountModal({ isModalVisible, setIsModalVisible, myCallback }) {
    const { handleHttpError } = useApp();

    const [form] = Form.useForm();
    const [accessRightsForm] = Form.useForm();
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        try {
            const values = await form.validateFields();
            const accessRights = accessRightsForm.getFieldsValue();
            const access_rights = Object.keys(accessRights).filter(key => accessRights[key] != null).map(key => ({ view_id: key, has_write_access: accessRights[key] }));
            setLoading(true);
            EmployeeApiHelper.createNewAccount(values, access_rights)
                .then(newEmployee => {
                    myCallback(newEmployee);
                    message.success('Employee successfully created!')
                    message.success('Account details has been sent to the registered email!')
                    setLoading(false);
                    setIsModalVisible(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }
    }

    return (
        <Modal width={600} bodyStyle={{ paddingTop: 0 }}
          title='Create an Employee'
          visible={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          destroyOnClose
          okButtonProps={{ loading: loading }}
        >
            <MyForm form={form} accessRightsForm={accessRightsForm} />
        </Modal>
    )
}

function MyForm({ form, accessRightsForm }) {
    return (
        <>
            <Tabs defaultActiveKey="1">

                <Tabs.TabPane tab="Personal Details" key="1">
                    <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off" labelAlign="left">

                        <Form.Item label="Role" name="role_id" rules={[REQUIRED]}>
                            <Radio.Group>
                                { Object.keys(Role)
                                    .filter(x => x !== 'ADMIN')
                                    .map((key, idx) => <Radio key={idx} value={Role[key].id}>{Role[key].name}</Radio>)
                                }
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="Name" name="name" rules={[REQUIRED]}>
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="Username" name="username" rules={[REQUIRED]}>
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="Email" name="email" rules={[REQUIRED, EMAIL]}>
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="Contact Number" name="contact_number" rules={[minLength(8)]}>
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="Postal Code" name="postal_code">
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="NOK Name" name="nok_name">
                            <Input />
                        </Form.Item>
                        
                        <Form.Item label="NOK Contact" name="nok_number">
                            <Input />
                        </Form.Item>
                    </Form>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Access Rights" key="2">
                    <Form form={accessRightsForm} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off" labelAlign="left">
                        { Object.keys(View)
                            .filter(x => x !== 'ADMIN' && x !== 'GENERAL')
                            .map((key, idx) => <Form.Item key={idx} label={View[key].name} name={View[key].id} initialValue={undefined}>
                                    <Radio.Group>
                                        <Radio value={undefined}>None</Radio>
                                        <Radio value={false}>View Only</Radio>
                                        <Radio value={true}>Full Access</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            )
                        }
                    </Form>
                </Tabs.TabPane>

            </Tabs>
        </>
    )

}
