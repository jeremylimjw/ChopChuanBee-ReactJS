import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Button, Divider, Form, Input, message, Typography } from 'antd';
import React, { useState } from 'react'
import { SupplierAPIHelper } from '../../api/supplier';
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';
import { EMAIL, REQUIRED } from '../../utilities/form';
import MyToolbar from '../layout/MyToolbar';

export default function S1Form({ supplier, setSupplier }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            SupplierAPIHelper.update({...values, id: supplier.id })
                .then(() => {
                    setLoading(false);
                    setSupplier({...supplier, ...values });
                    message.success('Supplier successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <>
        { supplier != null &&
            <>
                <MyToolbar title="Details">
                    <Form.Item>
                        { editing ? 
                            <Button type="primary" onClick={() => onFinish(form.getFieldsValue())} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                            :
                            <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }} disabled={!hasWriteAccessTo(View.SCM.name)}>Edit</Button>
                        }
                    </Form.Item>
                </MyToolbar>

                <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...supplier}} onFinish={onFinish}>
                    <Form.Item label="Company Name" name="company_name" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{supplier.company_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Address" name="address" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{supplier.address || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Postal Code" name="postal_code" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{supplier.postal_code || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Email" name="company_email" rules={[EMAIL]}>
                        {!editing ? 
                            <Typography>{supplier.company_email || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        {!editing ? 
                            <Typography>{supplier.description || '-'}</Typography>
                        :
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                        }
                    </Form.Item>

                    <Divider />
                    <Typography.Title level={5}>Contact Person 1</Typography.Title>

                    <Form.Item label="Name" name="s1_name" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{supplier.s1_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Contact Number" name="s1_phone_number" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{supplier.s1_phone_number || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Divider />
                    <Typography.Title level={5}>Contact Person 2</Typography.Title>

                    <Form.Item label="Name" name="s2_name">
                        {!editing ? 
                            <Typography>{supplier.s2_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Contact Number" name="p2_phone_number">
                        {!editing ? 
                            <Typography>{supplier.p2_phone_number || '-'}</Typography>
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