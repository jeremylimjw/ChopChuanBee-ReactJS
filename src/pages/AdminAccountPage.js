import React, { useState, useEffect } from 'react';
import NewAccountForm from '../components/adminModule/NewAccountForm';
import AccountTable from './../components/adminModule/AccountTable';
import { useApp } from '../providers/AppProvider';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EmployeeApiHelper } from './../api/employees';

const AdminAccountPage = () => {
    const { user, logout, removeSession } = useApp();
    const [updateTable, setUpdateTable] = useState(false);
    const [accountDataSource, setAccountDataSource] = useState([]);
    const [isNewAccountModalVisible, setIsNewAccountModalVisible] = useState(false);
    // console.log(updateTable);

    const handleNewAccountModalOk = () => {
        setIsNewAccountModalVisible(false);
    };

    const handleNewAccountModalCancel = () => {
        setIsNewAccountModalVisible(false);
    };

    useEffect(() => {
        initializeEmployeeDataSource();
    }, [updateTable]);

    const initializeEmployeeDataSource = async () => {
        let data = await EmployeeApiHelper.getAllEmployees();
        // console.log('data', data);
        let dataSrc = data.map((value) => {
            return {
                ...value,
            };
        });
        // console.log('dataSrc', dataSrc);
        setAccountDataSource(dataSrc);
        // setUpdateTable(!updateTable);
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
    };

    // const getAccountDataSource = () => {
    //     let dataSource = sampleAccountData.map((value) => {
    //         return {
    //             ...value,
    //         };
    //     });
    //     setAccountDataSource(dataSource);
    // };

    return (
        <>
            <Typography.Title>Admin</Typography.Title>
            <Button icon={<PlusOutlined />} onClick={() => setIsNewAccountModalVisible(true)}>
                Create a new account
            </Button>
            <AccountTable accountDataSource={accountDataSource} user={user} />
            <NewAccountForm
                isNewAccountModalVisible={isNewAccountModalVisible}
                handleNewAccountModalOk={handleNewAccountModalOk}
                handleNewAccountModalCancel={handleNewAccountModalCancel}
                createNewAccount={createNewAccount}
                updateTable={updateTable}
                setUpdateTable={setUpdateTable}
            />
        </>
    );
};

export default AdminAccountPage;
