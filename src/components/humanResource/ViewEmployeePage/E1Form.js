import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, message, Radio, Typography } from 'antd';
import React, { useState } from 'react'
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { getRoleTag, Role } from '../../../enums/Role';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import EmailLink from '../../../utilities/EmailLink';
import { EMAIL, REQUIRED, NUMBER, exactLength } from '../../../utilities/form';
import MyToolbar from '../../common/MyToolbar';

export default function E1Form({ employee, setEmployee }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            EmployeeApiHelper.update(employee.id, values)
                .then(() => {
                    setLoading(false);
                    setEmployee({...employee, ...values });
                    message.success('Supplier successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <>
        { employee != null &&
            <>
                <MyToolbar title="Details">
                    <Form.Item>
                        { editing ? 
                            <Button type="primary" onClick={() => onFinish(form.getFieldsValue())} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                            :
                            <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }} disabled={!hasWriteAccessTo(View.HR.name)}>Edit</Button>
                        }
                    </Form.Item>
                </MyToolbar>

                <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...employee}} onFinish={onFinish}>
                
                    <Form.Item label="Name" name="name" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{employee.name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Role" name="role_id" rules={editing ? [REQUIRED] : []}>
                        {!editing || employee.role_id === Role.ADMIN.id ? 
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
        }
        </>
    )
}