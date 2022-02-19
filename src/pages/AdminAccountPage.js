import React, { useState, useEffect } from 'react';
import NewAccountForm from '../components/adminModule/NewAccountForm';
import AccountTable from './../components/adminModule/AccountTable';
import { useApp } from '../providers/AppProvider';
import { Button, Input, Select, Typography } from 'antd';
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
    // const [isNewAccountModalVisible, setIsNewAccountModalVisible] = useState(false);
    const { Option, OptGroup } = Select;
    const [loading, setLoading] = useState();
    const [employeeNameSearch, setEmployeeNameSearch] = useState();

    const reset = () => {
        setEmployeeNameSearch('');
        setLoading(true);
    };

    useEffect(() => {
        initializeEmployeeDataSource();
        setLoading(false);
    }, [loading]);

    const handleEmployeeNameSearch = (str) => {
        if (str === '') {
            setLoading(true);
        } else {
            str = str.toLowerCase();
            let filteredArr = accountDataSource.filter((account) => {
                let name = account.name.toLowerCase();
                return name.includes(str);
            });
            setAccountDataSource(filteredArr);
        }
    };

    const handleUserNameSearch = (str) => {
        if (str === '') {
            setLoading(true);
        } else {
            str = str.toLowerCase();
            let filteredArr = accountDataSource.filter((account) => {
                let username = account.username.toLowerCase();
                return username.includes(str);
            });
            setAccountDataSource(filteredArr);
        }
    };

    const handleAccessRightFilter = (value) => {
        console.log(value);
        console.log(accountDataSource);
        let filteredArr;

        if (value === 1) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 2) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 3) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 4) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 5) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 6) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 8) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 9) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === 10) {
            filteredArr = accountDataSource.filter((account) => {
                return account.access_rights.find((accessRight) => {
                    return accessRight.view_id === value;
                });
            });
        } else if (value === true) {
            //deactivated
            filteredArr = accountDataSource.filter((account) => {
                return account.discharge_date !== null;
            });
        } else if (value === false) {
            //activate
            filteredArr = accountDataSource.filter((account) => {
                return account.discharge_date === null;
            });
        }
        setAccountDataSource(filteredArr);
    };

    // const handleNewAccountModalOk = () => {
    //     setIsNewAccountModalVisible(false);
    // };

    // const handleNewAccountModalCancel = () => {
    //     setIsNewAccountModalVisible(false);
    // };

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

    // const createNewAccount = async (
    //     name,
    //     username,
    //     email,
    //     role_id,
    //     contact_number,
    //     nok_name,
    //     nok_number,
    //     address,
    //     postal_code,
    //     send_email,
    //     access_rights
    // ) => {
    //     await EmployeeApiHelper.createNewAccount(
    //         name,
    //         username,
    //         email,
    //         role_id,
    //         contact_number,
    //         nok_name,
    //         nok_number,
    //         address,
    //         postal_code,
    //         send_email,
    //         access_rights
    //     );
    //     initializeEmployeeDataSource();
    // };

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Account'>
            <MyCard>
                <MyToolbar title='Account Table'>
                    <Input
                        style={{ width: 180 }}
                        onChange={(e) => handleUserNameSearch(e.target.value)}
                        value={employeeNameSearch}
                        placeholder='Search Username'
                        suffix={<SearchOutlined className='grey' />}
                    />
                    <Input
                        style={{ width: 180 }}
                        onChange={(e) => handleEmployeeNameSearch(e.target.value)}
                        value={employeeNameSearch}
                        placeholder='Search Employee Name'
                        suffix={<SearchOutlined className='grey' />}
                    />
                    <Select
                        style={{ width: 180 }}
                        placeholder='Filter by Access Right'
                        onChange={handleAccessRightFilter}
                    >
                        <OptGroup label='Access Right'>
                            <Option value={1}>Human Resource</Option>
                            <Option value={2}>Customer Relationship</Option>
                            <Option value={3}>Supplier</Option>
                            <Option value={4}>Purchases</Option>
                            <Option value={5}>Sales</Option>
                            <Option value={6}>Accounting</Option>
                            <Option value={8}>General</Option>
                            <Option value={9}>Dispatch</Option>
                            <Option value={10}>Catalogue</Option>
                        </OptGroup>
                        <OptGroup label='Status'>
                            <Option value={false}>Activate</Option>
                            <Option value={true}>Deactivated</Option>
                        </OptGroup>
                        {/* <OptGroup label='Read/Write Access'>
                            <Option value={false}>Read</Option>
                            <Option value={true}>Write</Option>
                        </OptGroup> */}
                    </Select>
                    <Button onClick={() => reset()}>Reset</Button>
                    <Button
                        type='Link'
                        icon={<PlusOutlined style={{ color: 'white' }} />}
                        style={{ background: '#1890FF' }}
                    >
                        <Link to='/admin/create' style={{ color: 'white' }}>
                            {'  '}
                            New
                        </Link>
                    </Button>
                </MyToolbar>

                <AccountTable accountDataSource={accountDataSource} user={user} />
            </MyCard>
        </MyLayout>
    );
};

export default AdminAccountPage;
