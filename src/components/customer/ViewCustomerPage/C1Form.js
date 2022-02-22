import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Button, Divider, Form, Input, message, Radio, Typography } from 'antd'
import React, { useState } from 'react'
import { CustomerApiHelper } from '../../../api/CustomerApiHelper';
import { getChargedUnderTag } from '../../../enums/ChargedUnder';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { EMAIL, REQUIRED } from '../../../utilities/form';
import MyToolbar from '../../common/MyToolbar';

export default function C1Form({ customer, setCustomer }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            CustomerApiHelper.update({...values, id: customer.id })
                .then(() => {
                    setLoading(false);
                    setCustomer({...customer, ...values });
                    message.success('Customer successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <>
        { customer != null &&
            <>
                <MyToolbar title="Details">
                    { hasWriteAccessTo(View.CRM.name) && 
                        <Form.Item>
                            { editing ? 
                                <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                                :
                                <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }}>Edit</Button>
                            }
                        </Form.Item>
                    }
                </MyToolbar>

                <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...customer}} onFinish={onFinish}>
                    <Form.Item label="Company Name" name="company_name" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.company_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item name="gst" label="GST" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.gst ? 'Yes' : 'No'}</Typography>
                        :
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item name="gst_show" label="Show GST" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.gst_show ? 'Yes': 'No'}</Typography>
                        :
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item name="charged_under_id" label="Charged Under" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{getChargedUnderTag(customer.charged_under_id)}</Typography>
                        :
                            <Radio.Group>
                                <Radio value={1}>CCB</Radio>
                                <Radio value={2}>CBFS</Radio>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item label="Address" name="address" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.address || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Postal Code" name="postal_code" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.postal_code || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Email" name="company_email" rules={[EMAIL]}>
                        {!editing ? 
                            <Typography>{customer.company_email || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        {!editing ? 
                            <Typography>{customer.description || '-'}</Typography>
                        :
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                        }
                    </Form.Item>

                    <Divider />
                    <Typography.Title level={5}>Contact Person 1</Typography.Title>

                    <Form.Item label="Name" name="p1_name" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.p1_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Contact Number" name="p1_phone_number" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.p1_phone_number || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Divider />
                    <Typography.Title level={5}>Contact Person 2</Typography.Title>

                    <Form.Item label="Name" name="p2_name">
                        {!editing ? 
                            <Typography>{customer.p2_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Contact Number" name="p2_phone_number">
                        {!editing ? 
                            <Typography>{customer.p2_phone_number || '-'}</Typography>
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