import { EditOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Row, Col, Button, Form, Input, InputNumber, message, Typography } from 'antd'
import React, { useState } from 'react'
import { View } from '../../enums/View';
import { useApp } from '../../providers/AppProvider';
import { REQUIRED } from '../../utilities/form';
import { AccountingAPIHelper } from '../../api/accounting';
import MyToolbar from '../layout/MyToolbar';
import MyCard from '../layout/MyCard';

export default function SOFPAsset({ SOFP, setSOFP }) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    async function onFinish() {
        try {
            const values = await form.validateFields();
            setLoading(true);
            AccountingAPIHelper.update({...values, id: SOFP.id })
                .then(() => {
                    setLoading(false);
                    setSOFP({...SOFP, ...values });
                    message.success('SOFP successfully updated!');
                    setEditing(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch(err) { }
    }

    return (
        <>
        { SOFP != null &&
            <>
                <MyToolbar title="Title">
                    { hasWriteAccessTo(View.ACCOUNTING.name) && 
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
                <Form form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left" initialValues={{...SOFP}}>
                    <Row>
                        <Col xl={10} xs={24}> 
                            <MyCard>
                                <Form.Item label="Title" name="name" rules={editing ? [REQUIRED] : []}>
                                    {!editing ? 
                                        <Typography>{SOFP.name || '-'}</Typography>
                                    :
                                        <Input />
                                    }
                                </Form.Item>
                            </MyCard>
                        </Col>
                    </Row>
                </Form>
            </>

        }
        </>
    )
}