import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import ContentContainer from '../layout/ContentContainer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { compareDesc, format } from 'date-fns';

import { Layout, Card, Avatar, Row, Col, Space, Button, Typography, Table, Dropdown, Menu, Modal } from 'antd';
import { useEffect } from 'react';
import { MoreOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const AccountTable = () => {
    useEffect(() => {
        //pull Account from DB
        axios
            .get(`${process.env.REACT_APP_API_URL}/employee`)
            .then((res) => console.log(res.data))
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log('e4', error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }, []);

    const { Title } = Typography;
    const { confirm } = Modal;

    const handleMenuClick = (e) => {
        console.log('click', e);
    };

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
        <Menu onClick={handleMenuClick}>
            <Menu.Item key={1}>
                <Button type='text'>View account</Button>
            </Menu.Item>
            <Menu.Item key={2}>
                <Button
                    danger
                    type='text'
                    onClick={() => showPromiseConfirm(text.username)}
                    // onClick={() => console.log(text)}
                >
                    Deactivate account
                </Button>
            </Menu.Item>
        </Menu>
    );

    const accounts = [
        {
            userId: 1,
            username: 'Test1_Admin',
            email: 'test1@gmail.com',
            password: 'test1Password',
            name: 'test ',
            role: 'ADMIN',
            contactNumber: 123345678,
            nokName: 'test1Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 2,
            username: 'Test2_Staff',
            email: 'test2@gmail.com',
            password: 'test2Password',
            name: 'test 2',
            role: 'STAFF',
            contactNumber: 123345678,
            nokName: 'test2Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2022, 1, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 1, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 3,
            username: 'Test3_Admin',
            email: 'test3@gmail.com',
            password: 'test3Password',
            name: 'test 3',
            role: 'DRIVER',
            contactNumber: 123345678,
            nokName: 'test3Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2021, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2021, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 4,
            username: 'Test4_Staff',
            email: 'test4@gmail.com',
            password: 'test4Password',
            name: 'test 4',
            role: 'STAFF',
            contactNumber: 123345678,
            nokName: 'test4Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2021, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2021, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 5,
            username: 'Test5_Admin',
            email: 'test5@gmail.com',
            password: 'test5Password',
            name: 'test 5',
            role: 'ADMIN',
            contactNumber: 123345678,
            nokName: 'test5Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 6,
            username: 'Test6_Staff',
            email: 'test6@gmail.com',
            password: 'test6Password',
            name: 'test 6',
            role: 'DRIVER',
            contactNumber: 123345678,
            nokName: 'test6Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 7,
            username: 'Test7_Admin',
            email: 'test7@gmail.com',
            password: 'test7Password',
            name: 'test 7',
            role: 'ADMIN',
            contactNumber: 123345678,
            nokName: 'test7Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 8,
            username: 'Test8_Staff',
            email: 'test8@gmail.com',
            password: 'test8Password',
            name: 'test 8',
            role: 'STAFF',
            contactNumber: 123345678,
            nokName: 'test8Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 9,
            username: 'Test9_Admin',
            email: 'test9@gmail.com',
            password: 'test9Password',
            name: 'test 9',
            role: 'DRIVER',
            contactNumber: 123345678,
            nokName: 'test9Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 10,
            username: 'Test10_Staff',
            email: 'test10@gmail.com',
            password: 'test10Password',
            name: 'test 10',
            role: 'STAFF',
            contactNumber: 123345678,
            nokName: 'test2Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 11,
            username: 'Test11_Admin',
            email: 'test11@gmail.com',
            password: 'test11Password',
            name: 'test 11',
            role: 'ADMIN',
            contactNumber: 123345678,
            nokName: 'test11Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 12,
            username: 'Test12_Staff',
            email: 'test12@gmail.com',
            password: 'test12Password',
            name: 'test 12',
            role: 'DRIVER',
            contactNumber: 123345678,
            nokName: 'test12Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 13,
            username: 'Test13_Admin',
            email: 'test13@gmail.com',
            password: 'test13Password',
            name: 'test 13',
            role: 'ADMIN',
            contactNumber: 123345678,
            nokName: 'test13Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 14,
            username: 'Test14_Staff',
            email: 'test14@gmail.com',
            password: 'test14Password',
            name: 'test 14',
            role: 'STAFF',
            contactNumber: 123345678,
            nokName: 'test14Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 15,
            username: 'Test15_Admin',
            email: 'test1@gmail.com',
            password: 'test15Password',
            name: 'test 15',
            role: 'ADMIN',
            contactNumber: 123345678,
            nokName: 'test15Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-49',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
        {
            userId: 16,
            username: 'Test16_Staff',
            email: 'test16@gmail.com',
            password: 'test16Password',
            name: 'test 16',
            role: 'STAFF',
            contactNumber: 123345678,
            nokName: 'test16Nok',
            nokNumber: 23456789,
            address: 600268,
            unitNumber: '#16-47',
            dischargeDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            createdAt: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
            lastActive: 'Login',
        },
    ];

    const tableColumns = [
        {
            title: 'Staff Name',
            dataIndex: 'name',
            key: 'userId',
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Access Right',
            dataIndex: 'role',
            key: 'userId',
            filters: [
                { text: 'Admin', value: 'ADMIN' },
                { text: 'Staff', value: 'STAFF' },
                { text: 'Human Resource', value: 'HumanResource' },
                { text: 'Customer Relationship', value: 'CustomerRelationship' },
                { text: 'Supplier Relationship', value: 'SupplierRelationship' },
                { text: 'Purchases', value: 'Purchases' },
                { text: 'Sales', value: 'Sales' },
                { text: 'Accounting', value: 'Accounting' },
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0,
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'userId',
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'userId',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Last Active',
            dataIndex: 'dischargeDate',
            key: 'userId',
            sorter: (a, b) => new Date(a.dischargeDate) - new Date(b.dischargeDate),
            sortDirections: ['ascend', 'descend', 'ascend'],
        },
        {
            title: 'Last Activity',
            dataIndex: 'lastActive',
            key: 'userId',
            filters: [{ text: 'Login', value: 'Login' }],
            onFilter: (value, record) => record.lastActive.indexOf(value) === 0,
        },

        {
            title: '',
            key: 'userId',
            render: (text, record) => (
                <Dropdown.Button trigger={['click']} overlay={menu(text)} icon={<MoreOutlined />} />
            ),
        },
    ];

    return (
        <>
            {/* <Navbar />
            <Layout>
                <Sidebar /> */}
            <ContentContainer>
                <Title level={2}>Admin {'>'} Manage all accounts</Title>
                <Button icon={<PlusOutlined />}>
                    <Link to='/admin/accounts/create'> Create a new account</Link>
                </Button>
                <Table dataSource={accounts} columns={tableColumns}></Table>
            </ContentContainer>
            {/* </Layout> */}
        </>
    );
};

export default AccountTable;
