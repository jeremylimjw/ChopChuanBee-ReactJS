import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Input, Checkbox, Radio, Typography } from 'antd';

const EmployeeAccount = ({ user, isAccountModalVisible, handleAccountModalOk, handleAccountModalCancel }) => {
    // console.log(user);
    const [edit, setEdit] = useState(false);

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
                title='View Employee'
                visible={isAccountModalVisible}
                onOk={handleAccountModalOk}
                onCancel={handleAccountModalCancel}
                footer={
                    edit ? (
                        <Button onClick={() => setEdit(false)}>Edit</Button>
                    ) : (
                        <Button type='primary' onClick={() => setEdit(true)}>
                            Save
                        </Button>
                    )
                }
            >
                <Form
                    name='accountForm'
                    layout='vertical'
                    // onFinish={handleFinish} onFinishFailed={onFinishFailed}
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
                                initialValue={user.name}
                            >
                                {edit ? <Typography>{user.name}</Typography> : <Input />}
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
                                initialValue={user.username}
                            >
                                {edit ? <Typography>{user.username}</Typography> : <Input />}
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

                    {/* <Row>
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
                    </Row> */}
                </Form>
            </Modal>
        </>
    );
};

export default EmployeeAccount;
