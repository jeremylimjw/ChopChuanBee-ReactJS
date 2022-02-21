import React, { useState, useEffect } from 'react';
import { useApp } from '../../providers/AppProvider';
import { Button, Form, Input, Select, Table } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { EmployeeApiHelper } from '../../api/employees';
import MyLayout from '../../components/layout/MyLayout';
import MyCard from '../../components/layout/MyCard';
import { Link } from 'react-router-dom';
import MyToolbar from '../../components/layout/MyToolbar';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { parseDate, parseDateTimeSeconds } from '../../utilities/datetime';
import { showTotal } from '../../utilities/table';
import debounce from 'lodash.debounce';
import { getAccessRightTag, View } from '../../enums/View';
import { getActiveTag } from '../../enums/ActivationStatus';
import { getRole, getRoleTag, Role } from '../../enums/Role';
import NewAccountModal from '../../components/adminModule/NewAccountModal';

const breadcrumbs = [{ url: '/accounts/', name: 'Accounts' }];

export default function ManageAccountsPage() {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState();
    const [employees, setEmployees] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
      setLoading(true);
      EmployeeApiHelper.get()
        .then(results => {
            setEmployees(results);
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])

    function onValuesChange(_, form) {
        EmployeeApiHelper.get(form)
            .then(results => {
                setEmployees(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    function filterData(x) {
        // Remove admins
        if (getRole(x.role_id).name === 'Admin') return false;

        // Backend query by view_id is complicated to frontend handle this field
        const view_id = form.getFieldValue('view_id');
        if (view_id == null) return true;

        for (let accessRight of x.access_rights) {
            if (accessRight.view_id === view_id) return true;
        }
        return false;
    }

    function myCallback(newEmployee) {
        setEmployees([newEmployee, ...employees]);
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='Manage Accounts'>
            <MyCard>
                <MyToolbar title='Accounts'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="name">
                            <Input placeholder='Search Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="role_id">
                            <Select style={{ width: 140 }} placeholder="Filter by Role">
                                <Select.Option value={null}>All</Select.Option>
                                {Object.keys(Role)
                                    .filter(x => x !== 'ADMIN')
                                    .map((key, idx) => <Select.Option key={idx} value={Role[key].id}>{Role[key].name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="view_id">
                            <Select style={{ width: 180 }} placeholder="Filter by Access Right">
                                <Select.Option value={null}>All</Select.Option>
                                {Object.keys(View)
                                    .filter(x => x !== 'ADMIN' && x !== 'GENERAL')
                                    .map((key, idx) => <Select.Option key={idx} value={View[key].id}>{View[key].name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="status">
                            <Select style={{ width: 140 }} placeholder="Filter by Status">
                                <Select.Option value={null}>All</Select.Option>
                                <Select.Option value={true}>Active</Select.Option>
                                <Select.Option value={false}>Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    { hasWriteAccessTo(View.ADMIN.name) && 
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New</Button>
                    }
                </MyToolbar>

                <Table 
                    dataSource={employees.filter(filterData)} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="id" 
                    pagination={{ showTotal }}
                />
            </MyCard>

            <NewAccountModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} myCallback={myCallback} />
        </MyLayout>
    );
};

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        ellipsis: true,
        render: (created_at) => parseDate(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Role',
        dataIndex: 'role_id',
        key: 'role_id',
        width: 100,
        align: 'center',
        ellipsis: true,
        render: (role_id) => getRoleTag(role_id),
        sorter: (a, b) => sortByNumber(a.role_id, b.role_id),
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '18%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        title: 'Access Rights',
        dataIndex: 'access_rights',
        key: 'access_rights',
        ellipsis: true,
        render: (access_rights) => access_rights?.map((accessRight, idx) => <span key={idx}>{getAccessRightTag(accessRight)}</span>),
    },
    {
        title: 'Last Active',
        dataIndex: 'last_active',
        key: 'last_active',
        width: 200,
        ellipsis: true,
        render: (last_active) => last_active ? parseDateTimeSeconds(last_active) : '-',
        sorter: (a, b) => sortByDate(a.last_active, b.last_active),
    },
    {
        title: 'Status',
        dataIndex: 'discharge_date',
        key: 'discharge_date',
        width: 120,
        align: 'center',
        ellipsis: true,
        render: (discharge_date) => getActiveTag(discharge_date),
        sorter: (a, b) => sortByNumber(a.discharge_date ? 1 : 0, b.discharge_date ? 1 : 0),
    },
    { 
        dataIndex: "id", 
        title: "Action", 
        key: "link", 
        width: 100,
        ellipsis: true,
        render: (id) => <Link to={`./${id}`}>View</Link> 
    }
];
