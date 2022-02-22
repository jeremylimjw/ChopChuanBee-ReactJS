import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, InputNumber, message, Typography } from 'antd'
import React, { useState } from 'react'
import { ProductApiHelper } from '../../../api/product';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { REQUIRED } from '../../../utilities/form';
import MyToolbar from '../../layout/MyToolbar';

export default function P1Form({ product, setProduct }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
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
        } catch(err) { }
    }

    return (
        <>
        { product != null &&
            <>
                <MyToolbar title="Details">
                    { hasWriteAccessTo(View.INVENTORY.name) && 
                    <>
                        <Form.Item>
                            { editing ? 
                                <Button type="primary" onClick={onFinish} icon={<SaveOutlined />} loading={loading} style={{ width: 85 }}>Save</Button>
                                :
                                <Button onClick={() => setEditing(true)} icon={<EditOutlined />} style={{ width: 85 }}>Edit</Button>
                            }
                        </Form.Item>
                    </>
                    }
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
