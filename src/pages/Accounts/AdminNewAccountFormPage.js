import React, { useState } from 'react';
import { Form, Button, Modal, Input, Checkbox, Row, Col, Radio, Select, Typography, Table, Alert } from 'antd';
import MyLayout from '../../components/layout/MyLayout';
import MyCard from '../../components/layout/MyCard';
import MyToolbar from '../../components/layout/MyToolbar';
import { EmployeeApiHelper } from './../../api/employees';
import { Redirect } from 'react-router-dom';

const AdminNewAccountFormPage = () => {
    const [accountForm] = Form.useForm();
    const [ar1, setAr1] = useState(0);
    const [ar2, setAr2] = useState(0);
    const [ar3, setAr3] = useState(0);
    const [ar4, setAr4] = useState(0);
    const [ar5, setAr5] = useState(0);
    const [ar6, setAr6] = useState(0);
    const [ar7, setAr7] = useState(0);
    const [ar8, setAr8] = useState(0);
    const [ar9, setAr9] = useState(0);
    const [ar10, setAr10] = useState(0);
    const breadcrumbs = [{ url: '/admin/create/', name: 'Admin' }];

    const createNewAccount = async (
        name,
        username,
        email,
        role_id,
        contact_number,
        nok_name,
        nok_number,
        address,
        postal_code,
        send_email,
        access_rights
    ) => {
        await EmployeeApiHelper.createNewAccount(
            name,
            username,
            email,
            role_id,
            contact_number,
            nok_name,
            nok_number,
            address,
            postal_code,
            send_email,
            access_rights
        );
    };

    const handleFinish = (values) => {
        let hasWriteAccess = false;
        let tempAccessRight;
        let tempAccessRightList = [];
        let viewID;

        console.log(values);
        if (values.ard1 !== '0') {
            viewID = 1;
            if (values.ard1 === '1') {
                hasWriteAccess = false;
            } else if (values.ard1 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard2 !== '0') {
            viewID = 2;
            if (values.ard2 === '1') {
                hasWriteAccess = false;
            } else if (values.ard2 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard3 !== '0') {
            viewID = 3;
            if (values.ard3 === '1') {
                hasWriteAccess = false;
            } else if (values.ard3 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard4 !== '0') {
            viewID = 4;
            if (values.ard4 === '1') {
                hasWriteAccess = false;
            } else if (values.ard4 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard5 !== '0') {
            viewID = 5;
            if (values.ard5 === '1') {
                hasWriteAccess = false;
            } else if (values.ard5 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard6 !== '0') {
            viewID = 6;
            if (values.ard6 === '1') {
                hasWriteAccess = false;
            } else if (values.ard6 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard8 !== '0') {
            viewID = 8;
            if (values.ard8 === '1') {
                hasWriteAccess = false;
            } else if (values.ard8 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard9 !== '0') {
            viewID = 9;
            if (values.ard9 === '1') {
                hasWriteAccess = false;
            } else if (values.ard9 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        if (values.ard10 !== '0') {
            viewID = 10;
            if (values.ard10 === '1') {
                hasWriteAccess = false;
            } else if (values.ard10 === '2') {
                hasWriteAccess = true;
            }
            tempAccessRight = { view_id: viewID, has_write_access: hasWriteAccess };
            tempAccessRightList.push(tempAccessRight);
        }

        createNewAccount(
            values.name,
            values.username,
            values.email,
            values.role,
            values.contactNumber,
            values.nokName,
            values.nokNumber,
            values.address,
            values.postalCode,
            values.sentEmail !== undefined,
            tempAccessRightList
        );
        onReset();
        // window.location.href = 'http://localhost:3001/admin/accounts';
    };

    const onReset = () => {
        accountForm.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const sendEmailOption = [{ label: 'Send password & username to the email', value: 'send' }];

    const roleOptions = [
        // { label: 'Admin', value: 1 },
        { label: 'Staff', value: 2 },
        { label: 'Driver', value: 3 },
    ];

    const options = [
        { label: 'Read', value: '1' },
        { label: 'Read & Write', value: '2' },
        { label: 'None', value: '0' },
    ];

    const onChangeAR1 = (e) => {
        setAr1(e.target.value);
    };
    const onChangeAR2 = (e) => {
        setAr2(e.target.value);
    };
    const onChangeAR3 = (e) => {
        setAr3(e.target.value);
    };
    const onChangeAR4 = (e) => {
        setAr4(e.target.value);
    };
    const onChangeAR5 = (e) => {
        setAr5(e.target.value);
    };
    const onChangeAR6 = (e) => {
        setAr6(e.target.value);
    };
    //admin access right
    const onChangeAR7 = (e) => {
        setAr7(e.target.value);
    };
    const onChangeAR8 = (e) => {
        setAr8(e.target.value);
    };
    const onChangeAR9 = (e) => {
        setAr9(e.target.value);
    };
    const onChangeAR10 = (e) => {
        setAr10(e.target.value);
    };

    return (
        <>
            <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Create New Account'>
                <MyCard>
                    <MyToolbar title='New Account Form'></MyToolbar>

                    <Form
                        form={accountForm}
                        name='accountForm'
                        onFinish={handleFinish}
                        onFinishFailed={onFinishFailed}
                        labelCol={{ span: 6 }}
                    >
                        <Form.Item
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

                        <Form.Item
                            label='Username'
                            name='username'
                            rules={[
                                {
                                    required: true,
                                    message: 'Required',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label='Roles'
                            name='role'
                            rules={[
                                {
                                    required: true,
                                    message: 'Required',
                                },
                            ]}
                        >
                            <Radio.Group options={roleOptions}></Radio.Group>
                        </Form.Item>

                        <Form.Item label='Access Rights'>
                            <Row>
                                <Col span={8}>
                                    <Typography>Human Resource</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard1'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR1} options={options} value={ar1} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <Typography>Customer Relationship</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard2'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR2} options={options} value={ar2} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <Typography>Supplier Relationship</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard3'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR3} options={options} value={ar3} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Typography>Inventory</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard4'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR4} options={options} value={ar4} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Typography>Sales</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard5'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR5} options={options} value={ar5} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Typography>Accounting</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard6'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR6} options={options} value={ar6} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Typography>General</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard8'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR8} options={options} value={ar8} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Typography>Dispatch</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard9'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR9} options={options} value={ar9} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Typography>Catalogue</Typography>
                                </Col>

                                <Col span={16}>
                                    <Form.Item
                                        name='ard10'
                                        initialValue='0'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Required',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={onChangeAR10} options={options} value={ar10} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>

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
                        <Form.Item name='sentEmail'>
                            <Checkbox.Group defaultValue={['send']} options={sendEmailOption}></Checkbox.Group>
                        </Form.Item>

                        <Form.Item label='Contact Number' name='contactNumber'>
                            <Input />
                        </Form.Item>

                        <Form.Item label='Postal Code' name='postalCode'>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Address' name='address'>
                            <Input />
                        </Form.Item>

                        <Form.Item label='NOK Name' name='nokName'>
                            <Input />
                        </Form.Item>

                        <Form.Item label='NOK Number' name='nokNumber'>
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </MyCard>
            </MyLayout>
        </>
    );
};

export default AdminNewAccountFormPage;
