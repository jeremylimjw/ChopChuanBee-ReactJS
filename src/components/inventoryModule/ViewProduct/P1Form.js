import { EditOutlined, SaveOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, InputNumber, message, Popconfirm, Typography } from 'antd'
import React, { useState } from 'react'
import { ProductApiHelper } from '../../../api/product';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import MyToolbar from '../../layout/MyToolbar';

export default function P1Form({ product, setProduct }) {

    const { handleHttpError } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    function onFinish(values) {
        setLoading(true);
        ProductApiHelper.update({...values, id: product.id })
            .then(() => {
                setLoading(false);
                setProduct({...product, ...values });
                message.success('Product successfully updated!');
                setEditing(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function handleDeactivate() {
        setLoading(true);
        const promise = product.deactivated_date == null ? ProductApiHelper.deactivate(product.id) : ProductApiHelper.activate(product.id);
        promise.then(newFields => {
            setLoading(false);
            setProduct({...product, ...newFields });
            message.success(`Product successfully ${product.deactivated_date == null ? 'deactivated' : 'activated' }!`);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));
    }

    return (
        <>
        { product != null &&
            <>
                <MyToolbar title="Details">
                    <Form.Item>
                        { product.deactivated_date == null ? 
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

                <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...product}} onFinish={onFinish}>
                    <Form.Item label="Product Name" name="name" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{product.name || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Minimum Inventory" name="min_inventory_level" rules={editing ? [REQUIRED] : []}>
                        {!editing ? 
                            <Typography>{product.min_inventory_level || '-'}</Typography>
                        :
                            <InputNumber min={0} />
                        }
                    </Form.Item>

                    <Form.Item label="Unit" name="unit">
                        {!editing ? 
                            <Typography>{product.unit || '-'}</Typography>
                        :
                            <Input />
                        }
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        {!editing ? 
                            <Typography>{product.description || '-'}</Typography>
                        :
                            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
                        }
                    </Form.Item>

                </Form>
            </>
        }
        </>
    )
}
