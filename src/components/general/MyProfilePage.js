import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, message, Typography } from 'antd';
import React, { useState } from 'react'
import { EmployeeApiHelper } from '../../api/EmployeeApiHelper';
import { getRoleTag } from '../../enums/Role';
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';
import { EMAIL, REQUIRED } from '../../utilities/form';
import MyCard from '../common/MyCard';
import MyLayout from '../common/MyLayout/MyLayout';
import MyToolbar from '../common/MyToolbar';

const breadcrumbs = [{ url: '/myProfile', name: 'Profile' }];

export default function MyProfilePage() {

    const { user, setUser, handleHttpError, hasWriteAccessTo } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            EmployeeApiHelper.update(user.id, values)
                .then(() => {
                    setLoading(false);
                    setUser({...user, ...values });
                    message.success('Profile successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='My Profile'>
        { user != null &&
            <>
                <MyCard style={{ width: 500 }}>
                    <MyToolbar title="Details">
                        <Form.Item>
                            { editing ? 
                                <Button type="primary" onClick={() => onFinish(form.getFieldsValue())} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                                :
                                <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }} disabled={!hasWriteAccessTo(View.HR.name)}>Edit</Button>
                            }
                        </Form.Item>
                    </MyToolbar>

                    <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...user}} onFinish={onFinish}>
                    
                        <Form.Item label="Name" name="name" rules={editing ? [REQUIRED] : []}>
                            {!editing ? 
                                <Typography>{user.name || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>

                        <Form.Item label="Role" name="role_id">
                            {getRoleTag(user.role_id)}
                        </Form.Item>
                        
                        <Form.Item label="Email" name="email" rules={editing ? [REQUIRED, EMAIL] : []}>
                            {!editing ? 
                                <Typography>{user.email || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        
                        <Form.Item label="Contact Number" name="contact_number">
                            {!editing ? 
                                <Typography>{user.contact_number || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        
                        <Form.Item label="Address" name="address">
                            {!editing ? 
                                <Typography>{user.address || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        
                        <Form.Item label="Postal Code" name="postal_code">
                            {!editing ? 
                                <Typography>{user.postal_code || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        
                        <Form.Item label="NOK Name" name="nok_name">
                            {!editing ? 
                                <Typography>{user.contact_number || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>
                        
                        <Form.Item label="NOK Contact" name="nok_number">
                            {!editing ? 
                                <Typography>{user.nok_number || '-'}</Typography>
                            :
                                <Input />
                            }
                        </Form.Item>

                    </Form>
                
                </MyCard>
            </>
        }
        </MyLayout>
    )
}