import { EditOutlined, SaveOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Button, Divider, Form, Input, message, Popconfirm, Radio, Typography } from 'antd'
import React, { useState } from 'react'
import { CustomerApiHelper } from '../../../api/customer';
import { getChargedUnderTag } from '../../../enums/ChargedUnder';
import { useApp } from '../../../providers/AppProvider';
import MyToolbar from '../../layout/MyToolbar';

const REQUIRED = { required: true, message: 'This field is required.' };
const EMAIL = { type: 'email', message: 'This email is invalid.' };

export default function C1Form({ customer, setCustomer }) {

    const { handleHttpError } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    function onFinish(values) {
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
    }

    function handleDeactivate() {
        setLoading(true);
        const promise = customer.deactivated_date == null ? CustomerApiHelper.deactivate(customer.id) : CustomerApiHelper.activate(customer.id);
        promise.then(newFields => {
            setLoading(false);
            setCustomer({...customer, ...newFields });
            message.success(`Customer successfully ${customer.deactivated_date == null ? 'deactivated' : 'activated' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    return (
        <>
        { customer != null &&
            <>
                <MyToolbar title="Customer Details">
                    <Form.Item>
                        { customer.deactivated_date == null ? 
                            <Popconfirm title="Confirm deactivate?" onConfirm={handleDeactivate} disabled={loading}>
                                <Button type="danger" loading={loading}>
                                    <UserDeleteOutlined style={{ fontSize: "16px" }}/>Deactivate
                                </Button>
                            </Popconfirm>
                        :
                            <Popconfirm title="Confirm activate?" onConfirm={handleDeactivate} disabled={loading}>
                                <Button type="primary" loading={loading}>
                                    <UserAddOutlined style={{ fontSize: "16px" }}/>Activate
                                </Button>
                            </Popconfirm>
                        }
                    </Form.Item>

                    <Form.Item>
                        { editing ? 
                            <Button onClick={() => onFinish(form.getFieldsValue())} loading={loading}>
                                <SaveOutlined style={{ fontSize: "16px" }} /> Save
                            </Button>
                            :
                            <Button onClick={() => setEditing(true)}>
                                <EditOutlined style={{ fontSize: "16px" }} /> Edit
                            </Button>
                        }
                    </Form.Item>
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
                                <Radio.Button value={true}>Yes</Radio.Button>
                                <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item name="gst_show" label="Show GST" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.gst_show ? 'Yes': 'No'}</Typography>
                        :
                            <Radio.Group>
                                <Radio.Button value={true}>Yes</Radio.Button>
                                <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item name="charged_under_id" label="Charged Under" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{getChargedUnderTag(customer.charged_under_id)}</Typography>
                        :
                            <Radio.Group>
                                <Radio.Button value={1}>CCB</Radio.Button>
                                <Radio.Button value={2}>CBFS</Radio.Button>
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

                    <Form.Item label="POC 1" name="p1_name" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.p1_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="POC 1 Number" name="p1_phone_number" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{customer.p1_phone_number || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Divider />
                    <Typography.Title level={5}>Contact Person 2</Typography.Title>

                    <Form.Item label="POC 2" name="p2_name">
                        {!editing ? 
                            <Typography>{customer.p2_name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="POC 2 Number" name="p2_phone_number">
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