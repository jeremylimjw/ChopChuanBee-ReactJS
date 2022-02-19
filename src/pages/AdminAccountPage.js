import React, { useState, useEffect } from 'react';
import NewAccountForm from '../components/adminModule/NewAccountForm';
import AccountTable from './../components/adminModule/AccountTable';
import { useApp } from '../providers/AppProvider';
import { Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { EmployeeApiHelper } from './../api/employees';
import MyLayout from '../components/layout/MyLayout';
import MyCard from '../components/layout/MyCard';
import { Link } from 'react-router-dom';
import MyToolbar from './../components/layout/MyToolbar';

const AdminAccountPage = () => {
    const breadcrumbs = [{ url: '/admin/accounts/', name: 'Admin' }];
    const { user, logout, removeSession } = useApp();
    const [updateTable, setUpdateTable] = useState(false);
    const [accountDataSource, setAccountDataSource] = useState([]);
    const [isNewAccountModalVisible, setIsNewAccountModalVisible] = useState(false);

    const handleNewAccountModalOk = () => {
        setIsNewAccountModalVisible(false);
    };

    const handleNewAccountModalCancel = () => {
        setIsNewAccountModalVisible(false);
    };

    useEffect(() => {
        initializeEmployeeDataSource();
    }, []);

    const initializeEmployeeDataSource = async () => {
        let data = await EmployeeApiHelper.getAllEmployees();
        let dataSrc = data.map((value) => {
            return {
                ...value,
            };
        });
        setAccountDataSource(dataSrc);
        setUpdateTable(!updateTable);
    };

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
        initializeEmployeeDataSource();
    };

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Account'>
            <MyCard>
                <MyToolbar title='Account Table'>
                    {/* <Input placeholder='Search Employee Name' addonAfter={<SearchOutlined />} /> */}
                    <Input placeholder='Search Username' addonAfter={<SearchOutlined />} />
                    <Input placeholder='Search Employee Name' addonAfter={<SearchOutlined />} />
                    <Button type='link' icon={<PlusOutlined />}>
                        <Link to='/admin/create'> New</Link>
                    </Button>
                </MyToolbar>

                <AccountTable accountDataSource={accountDataSource} user={user} />
            </MyCard>
        </MyLayout>
    );
};

export default AdminAccountPage;
