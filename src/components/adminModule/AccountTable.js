import { React, useState } from 'react';
import { Button, Table, Dropdown, Menu, Modal, Tag } from 'antd';
import { MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import EmployeeAccount from './EmployeeAccount';
import { useEffect } from 'react';

const AccountTable = ({ accountDataSource, user }) => {
    const { confirm } = Modal;
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
    const [userAccountInfo, setUserAccountInfo] = useState();
    const handleAccountModalOk = () => {
        setIsAccountModalVisible(false);
    };

    const handleAccountModalCancel = () => {
        setIsAccountModalVisible(false);
    };

    const handleMenuClick = (e) => {
        // console.log('click', e);
    };

    useEffect(() => {});

    const showPromiseConfirm = (e) => {
        confirm({
            title: 'Confirm deactivation?',
            icon: <ExclamationCircleOutlined />,
            content: 'Username: ' + e,
            centered: true,
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
        });
    };

    const menu = (text) => (
        <Menu
        // onClick={handleMenuClick}
        >
            <Menu.Item key={1}>
                <Button
                    type='text'
                    onClick={() => {
                        setUserAccountInfo(text);
                        setIsAccountModalVisible(true);
                        console.log(text);
                        // console.log(userAccountInfo);
                    }}
                >
                    View account
                </Button>
            </Menu.Item>
            <Menu.Item key={2}>
                <Button danger type='text' onClick={() => showPromiseConfirm(text.username)}>
                    Deactivate account
                </Button>
            </Menu.Item>
        </Menu>
    );

    const tableColumns = [
        {
            title: 'Employee Name',
            dataIndex: 'name',
            key: 'userId',
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Access Right',
            filters: [
                { text: 'Human Resource', value: 1 },
                { text: 'Customer Relationship', value: 2 },
                { text: 'Supplier Relationship', value: 3 },
                { text: 'Purchases', value: 4 },
                { text: 'Sales', value: 5 },
                { text: 'Accounting', value: 6 },
                { text: 'Admin', value: 7 },
                { text: 'General', value: 8 },
                { text: 'Catalogue', value: 9 },
                { text: 'Driver', value: 10 },
            ],
            onFilter: (value, record) => record.access_rights.view_id.indexOf(value) === 0,
            render: (text, record) => (
                <>
                    {record.access_rights.map((ar) => {
                        let temp;
                        let color = ar.has_write_access === true ? 'green' : 'blue';
                        if (ar.view_id === 1) {
                            temp = 'HR';
                        } else if (ar.view_id === 2) {
                            temp = 'CRM';
                        } else if (ar.view_id === 3) {
                            temp = 'SRM';
                        } else if (ar.view_id === 4) {
                            temp = 'Purchases';
                        } else if (ar.view_id === 5) {
                            temp = 'Sales';
                        } else if (ar.view_id === 6) {
                            temp = 'Accounting';
                        } else if (ar.view_id === 7) {
                            temp = 'Admin';
                        } else if (ar.view_id === 8) {
                            temp = 'General';
                        } else if (ar.view_id === 9) {
                            temp = 'Catalogue';
                        } else if (ar.view_id === 10) {
                            temp = 'Driver';
                        }
                        return <Tag color={color}>{temp}</Tag>;
                    })}
                </>
            ),
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'Creation Date',
            dataIndex: 'created_at',
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Last Active',
            dataIndex: 'updated_at',
            sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Last Activity',
            dataIndex: 'lastActive',
            filters: [{ text: 'Login', value: 'Login' }],
            onFilter: (value, record) => record.lastActive.indexOf(value) === 0,
        },

        {
            title: '',
            render: (text, record) => (
                // console.log(record),
                <Dropdown.Button trigger={['click']} overlay={menu(text)} icon={<MoreOutlined />} />
            ),
        },
    ];

    return (
        <>
            <Table dataSource={accountDataSource} columns={tableColumns}></Table>
            <Modal
                title='View Employee'
                visible={isAccountModalVisible}
                onOk={handleAccountModalOk}
                onCancel={handleAccountModalCancel}
                // footer={
                //     edit ? (
                //         <Button onClick={() => setEdit(false)}>Save</Button>
                //     ) : (
                //         <Button type='primary' onClick={() => setEdit(true)}>
                //             Edit
                //         </Button>
                //     )
                // }
                bodyStyle={{ height: '60vh', overflowY: 'scroll' }}
            >
                <EmployeeAccount
                    userAccountInfo={userAccountInfo}
                    isAccountModalVisible={isAccountModalVisible}
                    handleAccountModalOk={handleAccountModalOk}
                    handleAccountModalCancel={handleAccountModalCancel}
                />
            </Modal>
        </>
    );
};

export default AccountTable;
