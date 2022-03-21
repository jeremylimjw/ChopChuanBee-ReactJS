import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Input, Form, message, Typography } from 'antd';
import { useNavigate, useSearchParams } from "react-router-dom";
import { minLength, REQUIRED } from '../utilities/form';
import { useApp } from '../providers/AppProvider';
import { httpLogin } from '../api/auth';
import { GeneralApiHelper } from '../api/GeneralAPIHelper';
import MyCard from './common/MyCard';

export default function ActivatePage() {

    const { setUser, handleHttpError } = useApp();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState()
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    
    useEffect(() => {
        const token = searchParams.get('token');
        if (token != null) {
            GeneralApiHelper.getEmployeeByActivationToken(token)
                .then(result => {
                    if (result.length > 0) {
                        setEmployee(result[0]);
                    }
                })
                .catch(handleHttpError)
        }
    }, [searchParams, handleHttpError]);

    async function onSubmit(values) {
        try {
            const values = await form.validateFields();
            const token = searchParams.get('token');
            setLoading(true);
            GeneralApiHelper.activateAccount(token, values.newPassword)
                .then(() => {
                    message.success('Password successfully setted!')
                    form.resetFields();

                    return httpLogin(employee.username, values.newPassword);
                })
                .then(user => {
                    setLoading(false);
                    // Set the user in session
                    sessionStorage.setItem("user", JSON.stringify(user));
                    setUser(user);

                    navigate('/');
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false));
        } catch (err) { }

    }

    return (
        <>
        { employee && 
            <Row justify="center" align="middle" style={{ height: '100vh' }}>
                <Col span={5} >
                    <MyCard title="Set password for my account" style={{ width: 400 }}>
        
                        <Form form={form} onFinish={onSubmit} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete="off" labelAlign="left">
                            
                            <Form.Item label="Employee name">
                                <Typography.Text>{employee.name}</Typography.Text>
                            </Form.Item>

                            <Form.Item label="Username">
                                <Typography.Text>{employee.username}</Typography.Text>
                            </Form.Item>

                            <Form.Item label="New password" name="newPassword" rules={[REQUIRED, minLength(6)]}>
                                <Input.Password autoComplete='off' />
                            </Form.Item>
                            
                            <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} hasFeedback
                                rules={[REQUIRED, ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
        
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                })]}
                            >
                                <Input.Password autoComplete='off' />
                            </Form.Item>
        
                                <Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%'}}>Confirm and Sign In</Button>
                        </Form>
        
                    </MyCard>
                </Col>
            </Row>
        }
        </>
    )
}
