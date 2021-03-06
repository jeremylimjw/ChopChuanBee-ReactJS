import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Radio, Typography } from 'antd'
import React, { useState } from 'react'
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { getRoleTag, Role } from '../../../enums/Role';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import EmailLink from '../../../utilities/EmailLink';
import { EMAIL, REQUIRED, NUMBER, exactLength } from '../../../utilities/form';
import MyToolbar from '../../common/MyToolbar';

export default function A1Form({ employee, setEmployee }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            EmployeeApiHelper.update(employee.id, values)
                .then(() => {
                    setEmployee({...employee, ...values});
                    message.success(`Employee successfully updated!`);
                    setLoading(false);
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        } catch(err) { }
    }

    return (
        <>
            <MyToolbar title="Personal Details">
                { hasWriteAccessTo(View.ADMIN.name) && 
                    <Form.Item>
                        { editing ? 
                            <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                            :
                            <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }}>Edit</Button>
                        }
                    </Form.Item>
                }
            </MyToolbar>

            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off" labelAlign="left" initialValues={{...employee}}>
                
                <Form.Item label="Name" name="name" rules={editing ? [REQUIRED] : []}>
                    {!editing ? 
                        <Typography>{employee.name || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>

                <Form.Item label="Role" name="role_id" rules={editing ? [REQUIRED] : []}>
                    {!editing ? 
                        getRoleTag(employee.role_id)
                    :
                        <Radio.Group disabled={!editing}>
                            { Object.keys(Role)
                                .filter(x => x !== 'ADMIN')
                                .map((key, idx) => <Radio key={idx} value={Role[key].id}>{Role[key].name}</Radio>)
                            }
                        </Radio.Group>
                    }
                </Form.Item>
                
                <Form.Item label="Email" name="email" rules={editing ? [REQUIRED, EMAIL] : []}>
                    {!editing ? 
                        <EmailLink email={employee.email} />
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="Contact Number" name="contact_number">
                    {!editing ? 
                        <Typography>{employee.contact_number || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="Address" name="address">
                    {!editing ? 
                        <Typography>{employee.address || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="Postal Code" name="postal_code" rules={editing ? [exactLength(6), NUMBER] : []}>
                    {!editing ? 
                        <Typography>{employee.postal_code || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="NOK Name" name="nok_name">
                    {!editing ? 
                        <Typography>{employee.nok_name || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="NOK Contact" name="nok_number">
                    {!editing ? 
                        <Typography>{employee.nok_number || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>

            </Form>
        </>
    )
}
