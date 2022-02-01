import React from 'react';

import { Form, Button, Modal, Input, Checkbox, Typography, Row, Col, Radio } from 'antd';
import { useEffect } from 'react';

const NewAccountForm = ({ isNewAccountModalVisible, handleNewAccountModalOk, handleNewAccountModalCancel }) => {
    const { Title } = Typography;
    const [accountForm] = Form.useForm();

    // values is a JSON object that contains the form input values
    const handleFinish = (values) => {
        console.log('Success:', values);
    };

    useEffect(() => {}, []);

    const onReset = () => {
        accountForm.resetFields();
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
            <Modal
                visible={isNewAccountModalVisible}
                onOk={handleNewAccountModalOk}
                onCancel={handleNewAccountModalCancel}
                footer={[
                    <Button onClick={onReset}>Reset</Button>,
                    <Button type='primary' htmlType='submit'>
                        submit
                    </Button>,
                ]}
            >
                <Title level={2}>Create a new account</Title>

                <Form
                    form={accountForm}
                    name='accountForm'
                    layout='vertical'
                    onFinish={handleFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Row>
                        <Col span={11}>
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
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
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
                                {/* <Checkbox.Group options={roleOptions} onChange={roleOnChange} /> */}
                                <Radio.Group onChange={roleOnChange} options={roleOptions}></Radio.Group>
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
                            <Form.Item label='Email Address' name='email'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item label='Contact Number' name='contactNumber'>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <Form.Item label='Postal Code' name='postalCode'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item label='Address' name='address'>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={11}>
                            <Form.Item label='Next-Of-Kin Name' name='nokName'>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Form.Item label='Next-Of-Kin Number' name='nokNumber'>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default NewAccountForm;
