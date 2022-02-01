import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import NewAccountForm from '../components/adminModule/NewAccountForm';
import AccountTable from './../components/adminModule/AccountTable';
import axios from 'axios';
import { useApp } from '../providers/AppProvider';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EmployeeAccount from './../components/adminModule/EmployeeAccount';

const AdminAccountPage = () => {
    const { user, logout, removeSession } = useApp();
    // const [data, setData] = useState([]);
    const [accountDataSource, setAccountDataSource] = useState([]);
    const [isNewAccountModalVisible, setIsNewAccountModalVisible] = useState(false);

    const handleNewAccountModalOk = () => {
        setIsNewAccountModalVisible(false);
    };

    const handleNewAccountModalCancel = () => {
        setIsNewAccountModalVisible(false);
    };

    // useEffect(() => {
    //     getAccountDataSource();
    // }, []);

    useEffect(() => {
        console.log(user);
        //pull Account from DB
        axios
            .get(`${process.env.REACT_APP_API_URL}/employee`, { withCredentials: true })
            .then((response) => {
                setAccountDataSource(response.data);
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 333) {
                        removeSession();
                    }
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    }, []);

    const sampleAccountData = [
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

    const getAccountDataSource = () => {
        let dataSource = sampleAccountData.map((value) => {
            return {
                ...value,
            };
        });
        setAccountDataSource(dataSource);
    };

    return (
        <>
            <Typography.Title>Admin</Typography.Title>
            <Button icon={<PlusOutlined />} onClick={() => setIsNewAccountModalVisible(true)}>
                Create a new account
                {/* <Link to='/admin/accounts/create'> Create a new account</Link> */}
            </Button>
            <AccountTable accountDataSource={accountDataSource} user={user} />
            <NewAccountForm
                isNewAccountModalVisible={isNewAccountModalVisible}
                handleNewAccountModalOk={handleNewAccountModalOk}
                handleNewAccountModalCancel={handleNewAccountModalCancel}
            />
        </>
    );
};

export default AdminAccountPage;
