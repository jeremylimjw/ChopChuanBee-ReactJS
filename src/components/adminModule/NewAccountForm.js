import React, { useState } from 'react';
import { Form, Button, Modal, Input, Checkbox, Row, Col, Radio, Select } from 'antd';

const NewAccountForm = ({
    isNewAccountModalVisible,
    handleNewAccountModalOk,
    handleNewAccountModalCancel,
    createNewAccount,
    updateTable,
    setUpdateTable,
}) => {
    const { Option } = Select;
    const [accountForm] = Form.useForm();
    const [ar1, setAr1] = useState(false);
    const [ar2, setAr2] = useState(false);
    const [ar3, setAr3] = useState(false);
    const [ar4, setAr4] = useState(false);
    const [ar5, setAr5] = useState(false);
    const [ar6, setAr6] = useState(false);
    const [ar7, setAr7] = useState(false);
    const [ar8, setAr8] = useState(false);
    const [ar9, setAr9] = useState(false);
    const [ar10, setAr10] = useState(false);

    const handleFinish = (values) => {
        let hasWriteAccess = false;
        let tempAccessRight;
        let tempAccessRightList = [];
        for (let i = 0; i < values.accessRights.length; i++) {
            if (values.accessRights[i] === 1) {
                hasWriteAccess = values.ard1;
            } else if (values.accessRights[i] === 2) {
                hasWriteAccess = values.ard2;
            } else if (values.accessRights[i] === 3) {
                hasWriteAccess = values.ard3;
            } else if (values.accessRights[i] === 4) {
                hasWriteAccess = values.ard4;
            } else if (values.accessRights[i] === 5) {
                hasWriteAccess = values.ard5;
            } else if (values.accessRights[i] === 6) {
                hasWriteAccess = values.ard6;
            } else if (values.accessRights[i] === 7) {
                hasWriteAccess = values.ard7;
            } else if (values.accessRights[i] === 8) {
                hasWriteAccess = values.ard8;
            } else if (values.accessRights[i] === 9) {
                hasWriteAccess = values.ard9;
            } else if (values.accessRights[i] === 10) {
                hasWriteAccess = values.ard10;
            }
            tempAccessRight = { view_id: values.accessRights[i], has_write_access: hasWriteAccess };
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
        setUpdateTable(!updateTable);
        onReset();
        handleNewAccountModalOk();
    };

    const onReset = () => {
        accountForm.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const sendEmailOption = [{ label: 'Send password & username to the email', value: 'send' }];

    const roleOptions = [
        { label: 'Admin', value: 1 },
        { label: 'Staff', value: 2 },
        { label: 'Driver', value: 3 },
    ];

    const accessRightOnChange = (checkedValues) => {
        setAr1(false);
        setAr2(false);
        setAr3(false);
        setAr4(false);
        setAr5(false);
        setAr6(false);
        setAr7(false);
        setAr8(false);
        setAr9(false);
        setAr10(false);
        for (let i = 0; i < checkedValues.length; i++) {
            let checked = checkedValues[i];
            if (checked === 1) {
                setAr1(true);
            } else if (checked === 2) {
                setAr2(true);
            } else if (checked === 3) {
                setAr3(true);
            } else if (checked === 4) {
                setAr4(true);
            } else if (checked === 5) {
                setAr5(true);
            } else if (checked === 6) {
                setAr6(true);
            } else if (checked === 7) {
                setAr7(true);
            } else if (checked === 8) {
                setAr8(true);
            } else if (checked === 9) {
                setAr9(true);
            } else if (checked === 10) {
                setAr10(true);
            }
        }
    };

    return (
        <>
            <Modal
                visible={isNewAccountModalVisible}
                onCancel={() => {
                    handleNewAccountModalCancel();
                    onReset();
                }}
                footer={null}
                bodyStyle={{ height: '60vh', overflowY: 'scroll' }}
                title='Create a new account'
                centered='true'
            >
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

                    <Form.Item
                        label='Access Rights'
                        name='accessRights'
                        rules={[
                            {
                                required: true,
                                message: 'Required',
                            },
                        ]}
                    >
                        <Checkbox.Group onChange={accessRightOnChange}>
                            <Row>
                                <Checkbox value={1}>Human Resource</Checkbox>
                                <Form.Item name='ard1' initialValue={false}>
                                    <Select style={{ width: 140 }} size='small' disabled={ar1 ? false : true}>
                                        <Option value={false}>Read Only</Option>
                                        <Option value={true}>Read and Write</Option>
                                    </Select>
                                </Form.Item>
                            </Row>

                            <Row>
                                <Col>
                                    <Checkbox value={2}>Customer Relationship</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard2' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar2 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Checkbox value={3}>Supplier Relationship</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard3' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar3 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Checkbox value={4}>Purchases</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard4' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar4 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Checkbox value={5}>Sales</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard5' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar5 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Checkbox value={6}>Accounting</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard6' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar6 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Checkbox value={7}>Administration</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard7' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar7 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Checkbox value={8}>General</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard8' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar8 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Checkbox value={9}>Dispatch</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard9' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar9 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Checkbox value={10}>Catalogue</Checkbox>
                                </Col>
                                <Col>
                                    <Form.Item name='ard10' initialValue={false}>
                                        <Select style={{ width: 140 }} size='small' disabled={ar10 ? false : true}>
                                            <Option value={false}>Read Only</Option>
                                            <Option value={true}>Read and Write</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Checkbox.Group>
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
            </Modal>
        </>
    );
};

export default NewAccountForm;
