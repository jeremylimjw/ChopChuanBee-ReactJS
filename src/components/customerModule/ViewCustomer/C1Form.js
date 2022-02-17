import { EditOutlined, SaveOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Button, Divider, Form, Input, message, Modal, Radio, Typography } from 'antd'
import React, { useState } from 'react'
import { CustomerApiHelper } from '../../../api/customer';
import { getChargedUnderTag } from '../../../enums/ChargedUnder';
import { useApp } from '../../../providers/AppProvider';
import MyToolbar from '../../layout/MyToolbar';

const ERROR_MESSAGE = 'This field is required.';
const REQUIRED = [{ required: true, message: ERROR_MESSAGE }];

export default function C1Form({ customer, setCustomer }) {

    const { handleHttpError } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
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

    function handleDeactivate(id) {
        setLoading(true);
        const promise = customer.deactivated_date == null ? CustomerApiHelper.deactivate(id) : CustomerApiHelper.activate(id);
        promise.then(newFields => {
            setLoading(false);
            setCustomer({...customer, ...newFields });
            message.success('Customer successfully updated!');
            setEditing(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

        setIsModalVisible(false);
    }

    return (
        <>
        { customer != null &&
            <>
                <MyToolbar title="Customer Details">
                    <Form.Item>
                        { customer.deactivated_date == null ? 
                            <Button onClick={() => setIsModalVisible(true)} loading={loading}>
                                <UserDeleteOutlined style={{ fontSize: "16px", color: "red" }}/>Deactivate
                            </Button>
                        :
                            <Button onClick={() => setIsModalVisible(true)} loading={loading}>
                                <UserAddOutlined style={{ fontSize: "16px", color: "green" }}/>Activate
                            </Button>
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

                    {/* <Form.Item>
                        <Button>
                            <MinusOutlined style={{ fontSize: "16px" }} /> Collapse
                        </Button>
                        <Button>
                            <PlusOutlined style={{ fontSize: "16px" }} /> Expand
                        </Button>
                    </Form.Item> */}
                </MyToolbar>

                <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...customer}} onFinish={onFinish}>
                    <Form.Item label="Company Name" name="company_name" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{customer.company_name}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item name="gst" label="GST" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{customer.gst ? 'Yes' : 'No'}</Typography>
                        :
                            <Radio.Group>
                                <Radio.Button value={true}>Yes</Radio.Button>
                                <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item name="gst_show" label="Show GST" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{customer.gst_show ? 'Yes': 'No'}</Typography>
                        :
                            <Radio.Group>
                                <Radio.Button value={true}>Yes</Radio.Button>
                                <Radio.Button value={false}>No</Radio.Button>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item name="charged_under_id" label="Charged Under" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{getChargedUnderTag(customer.charged_under_id)}</Typography>
                        :
                            <Radio.Group>
                                <Radio.Button value={1}>CCB</Radio.Button>
                                <Radio.Button value={2}>CBFS</Radio.Button>
                            </Radio.Group>
                        }
                    </Form.Item>

                    <Form.Item label="Address" name="address" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{customer.address}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Postal Code" name="postal_code" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{customer.postal_code}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Email" name="company_email">
                        {!editing ? 
                            <Typography>{customer.company_email}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        {!editing ? 
                            <Typography>{customer.description}</Typography>
                        :
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                        }
                    </Form.Item>

                    <Divider />
                    <Typography.Title level={5}>Contact Person 1</Typography.Title>

                    <Form.Item label="POC 1" name="p1_name" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{customer.p1_name}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="POC 1 Number" name="p1_phone_number" rules={editing ? REQUIRED : []}>
                        {!editing ? 
                            <Typography>{customer.p1_phone_number}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Divider />
                    <Typography.Title level={5}>Contact Person 2</Typography.Title>

                    <Form.Item label="POC 2" name="p2_name">
                        {!editing ? 
                            <Typography>{customer.p2_name}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="POC 2 Number" name="p2_phone_number">
                        {!editing ? 
                            <Typography>{customer.p2_phone_number}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                </Form>

                <Modal title="Confirm" visible={isModalVisible} onOk={() => handleDeactivate(customer.id)} onCancel={() => setIsModalVisible(false)}>
                    {customer.deactivate_date == null ?
                        <h3>{`Confirm deactivation of customer ${customer.company_name}? You will not be able to create a sales order from them.`}</h3>
                    :
                        <h3>{`Confirm re-activation of customer ${customer.company_name}?`}</h3>
                    }
                </Modal>
            </>
        }
        </>
    )
}