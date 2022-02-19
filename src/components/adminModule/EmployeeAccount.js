import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Input, Checkbox, Radio, Typography, Select } from 'antd';
import { useEffect } from 'react';

const EmployeeAccount = ({
    userAccountInfo,
    isAccountModalVisible,
    handleAccountModalOk,
    handleAccountModalCancel,
}) => {
    // console.log(userAccountInfo);
    const [edit, setEdit] = useState(false);
    const [test, setTest] = useState();
    const { Option } = Select;
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

    useEffect(() => {
        setTest(userAccountInfo);
    }, []);
    // console.log(user.role_id);
    const accessRightOptions = [
        { label: 'Human Resource', value: 'HumanResource' },
        { label: 'Customer Relationship', value: 'CustomerRelationship' },
        { label: 'Supplier Relationship', value: 'SupplierRelationship' },
        { label: 'Inventory', value: 'Inventory' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Accounting', value: 'Accounting' },
        { label: 'Administration', value: 'Administration' },
        { label: 'General', value: 'General' },
        { label: 'Dispatch', value: 'Dispatch' },
        { label: 'Catalogue', value: 'Catalogue' },
    ];

    const roleOptions = [
        { label: 'Admin', value: 'Admin' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Driver', value: 'Driver' },
    ];

    const accessRightOnChange = (checkedValues) => {
        // console.log('checked = ', checkedValues);
    };

    const roleOnChange = (checkedValues) => {
        // console.log('checked = ', checkedValues);
    };

    return (
        <>
            {/* <Modal
                title='View Employee'
                visible={isAccountModalVisible}
                onOk={handleAccountModalOk}
                onCancel={handleAccountModalCancel}
                footer={
                    edit ? (
                        <Button onClick={() => setEdit(false)}>Save</Button>
                    ) : (
                        <Button type='primary' onClick={() => setEdit(true)}>
                            Edit
                        </Button>
                    )
                }
                bodyStyle={{ height: '60vh', overflowY: 'scroll' }}
            > */}
            <Form
                name='accountForm'
                labelCol={{ span: 6 }}
                // initialValue={userAccountInfo.name}

                // layout='vertical'
                // onFinish={handleFinish} onFinishFailed={onFinishFailed}
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
                    initialValue={userAccountInfo.name}
                >
                    {edit ? <Input /> : <Typography>{userAccountInfo.name}</Typography>}
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
                    initialValue={userAccountInfo.username}
                >
                    {edit ? <Input /> : <Typography>{userAccountInfo.username}</Typography>}
                </Form.Item>

                {/* <Form.Item
                        label='Roles'
                        name='role'
                        rules={[
                            {
                                required: true,
                                message: 'Required',
                            },
                        ]}
                    >
                        {edit ? (
                            <Radio.Group
                                onChange={roleOnChange}
                                options={roleOptions}
                                defaultValue={userInfo.role_id}
                            ></Radio.Group>
                        ) : (
                            <Typography>
                                {userInfo.role_id === 1 ? 'Admin' : userInfo.role_id === 2 ? 'Staff' : 'Driver'}
                            </Typography>
                        )}
                    </Form.Item> */}

                {/* <Form.Item
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
                        </Checkbox.Group>{' '}
                    </Form.Item> */}
            </Form>
        </>
    );
};

export default EmployeeAccount;
