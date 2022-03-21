import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Typography } from 'antd'
import React, { useState } from 'react'
import { ChargedUnderApiHelper } from '../../../api/ChargedUnderApiHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED, minLength } from '../../../utilities/form';
import MyToolbar from '../../common/MyToolbar';

export default function CU1Form({ chargedUnder, setChargedUnder }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            ChargedUnderApiHelper.update({...chargedUnder, ...values})
                .then(() => {
                    setChargedUnder({...chargedUnder, ...values});
                    message.success(`Scheme successfully updated!`);
                    setLoading(false);
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        } catch(err) { }
    }

    return (
        <>
            <MyToolbar title="Details">
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

            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} autoComplete="off" labelAlign="left" initialValues={{...chargedUnder}}>
                
                <Form.Item label="Company Name" name="name" rules={editing ? [REQUIRED] : []}>
                    {!editing ? 
                        <Typography>{chargedUnder.name || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="Address" name="address" rules={editing ? [REQUIRED] : []}>
                    {!editing ? 
                        <Typography>{chargedUnder.address || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="Shipping Address" name="shipping_address" rules={editing ? [REQUIRED] : []}>
                    {!editing ? 
                        <Typography>{chargedUnder.shipping_address || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="Contact Number" name="contact_number" rules={editing ? [REQUIRED, minLength(8)] : []}>
                    {!editing ? 
                        <Typography>{chargedUnder.contact_number || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="Registration Number" name="registration_number">
                    {!editing ? 
                        <Typography>{chargedUnder.registration_number || '-'}</Typography>
                    :
                        <Input />
                    }
                </Form.Item>
                
                <Form.Item label="GST Rate" name="gst_rate">
                    {!editing ? 
                        <Typography>{(chargedUnder.gst_rate && chargedUnder.gst_rate !== 0) ? `${chargedUnder.gst_rate}%` : '-'}</Typography>
                    :
                        <InputNumber min={0} addonAfter="%" style={{ width: 100 }} />
                    }
                </Form.Item>

            </Form>
        </>
    )
}
