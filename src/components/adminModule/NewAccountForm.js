import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import ContentContainer from '../layout/ContentContainer';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import { Layout, Form, Select, DatePicker, Button, Modal, Input, Checkbox, Typography, Row, Col } from 'antd';
import { useEffect, useState } from 'react';

const NewAccountForm = () => {
    const { Title } = Typography;
    const [accountForm] = Form.useForm();

    // values is a JSON object that contains the form input values
    const handleFinish = (values) => {
        console.log('Success:', values);
    };

    useEffect(() => {}, []);

    const checked = () => {
        console.log('checked');
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const accessRightOptions = [
        { label: 'Human Resource', value: 'HumanResource' },
        { label: 'Customer Relationship', value: 'CustomerRelationship' },
        { label: 'Supplier Relationship', value: 'SupplierRelationship' },
        { label: 'Purchases', value: 'Purchases' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Accounting', value: 'Accounting' },
        { label: 'Catalogue', value: 'Catalogue' },
    ];

    const roleOptions = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Driver', value: 'Driver' },
    ];

    const accessRightOnChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    const roleOnChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    return (
        <>
            {/* <Navbar />
            <Layout>
                <Sidebar /> */}
            <ContentContainer>
                <Title level={2}>
                    Admin {'>'} Manage all accounts {'>'} Create a new account
                </Title>

                <Form name='accountForm' layout='vertical' onFinish={handleFinish} onFinishFailed={onFinishFailed}>
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                // style={{
                                //     width: '50%',
                                // }}
                                label='Full name'
                                name='name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item
                                label='Username'
                                name='username'
                                // style={{
                                //     width: '50%',
                                // }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <Form.Item
                                label='Roles'
                                name='role'
                                wrapperCol={{
                                    span: 16,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ]}
                            >
                                <Checkbox.Group options={roleOptions} onChange={roleOnChange} />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item
                                label='Access Rights'
                                name='accessRights'
                                wrapperCol={{
                                    span: 16,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ]}
                            >
                                <Checkbox.Group options={accessRightOptions} onChange={accessRightOnChange} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <Form.Item
                                label='Email Address'
                                name='email'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item
                                label='Contact Number'
                                name='contactNumber'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <Form.Item
                                label='Postal Code'
                                name='postalCode'
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: 'Required',
                                //     },
                                // ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item
                                label='Address'
                                name='address'
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: 'Required',
                                //     },
                                // ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <Form.Item
                                label='Next-Of-Kin Name'
                                name='nokName'
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: 'Required',
                                //     },
                                // ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item
                                label='Next-Of-Kin Number'
                                name='nokNumber'
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: 'Required',
                                //     },
                                // ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Item>
                                <Button type='primary' htmlType='submit'>
                                    submit
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col>
                            <Form.Item>
                                <Button onClick={checked}>Reset</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </ContentContainer>
            {/* </Layout> */}
        </>
    );
};

export default NewAccountForm;
