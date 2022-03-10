import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, Table } from 'antd';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { getRoleTag, Role } from '../../../enums/Role';
import { useApp } from '../../../providers/AppProvider';
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyToolbar from '../../common/MyToolbar';

export default function NI1DriverTable({ selectedEmployee, setSelectedEmployee }) {

    const { handleHttpError } = useApp();
  
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        setLoading(true);
        EmployeeApiHelper.get({ status: true, role_id: Role.DRIVER.id })
            .then(results => {
                setEmployees(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])
  
    function onValuesChange(_, form) {
        EmployeeApiHelper.get({ ...form, status: true, role_id: Role.DRIVER.id })
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

    function handleRowSelect(_, selectedRows) {
        setSelectedEmployee(selectedRows[0]);
    }

    return (
        <>
            <MyToolbar title="All Drivers">
              <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                <Form.Item name="name">
                    <Input placeholder='Search Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
                <Button onClick={resetForm}>Reset</Button>
              </Form>
            </MyToolbar>

            <Table loading={loading}
              rowSelection={{ type: 'radio', onChange: handleRowSelect, selectedRowKeys: [selectedEmployee?.id] }}
              columns={columns}
              dataSource={employees}
              pagination={{ pageSize: 6, showTotal: showTotal }}
              rowKey="id"
            />
        </>
    )
}
  
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: 300,
        ellipsis: true,
        sorter: (a, b) => sortByString(a.name, b.name),
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
        title: 'Contact Number',
        dataIndex: 'contact_number',
        width: 250,
        ellipsis: true,
        render: (contact_number) => contact_number || '-',
        sorter: (a, b) => sortByString(a.contact_number, b.contact_number),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        ellipsis: true,
        render: (email) => email || '-',
        sorter: (a, b) => sortByString(a.email, b.email),
    },
];
