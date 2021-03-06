import React, { useEffect, useState } from 'react';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons/lib/icons';
import { Button, Input, Table, Form, Select } from 'antd';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useApp } from '../../../providers/AppProvider';
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import MyToolbar from '../../common/MyToolbar';
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { getRoleTag, Role } from '../../../enums/Role';
import EmailLink from '../../../utilities/EmailLink';
import { View } from '../../../enums/View';
import { generateCSV } from '../../../utilities/Report/ExcelExporter';

const EmployeeTable = () => {

  const { handleHttpError, hasWriteAccessTo } = useApp();
  const [loading, setLoading] = useState();
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    EmployeeApiHelper.get({ status: true }) // Status = true to filter out deactivated employees
      .then(results => {
        setEmployees(results);
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
  }, [handleHttpError, setLoading])

  function onValuesChange(_, form) {
    EmployeeApiHelper.get({ ...form, status: true }) // Status = true to filter out deactivated employees
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

  const handleExcelExport = () => {
    const tableHeaders = ['Name', 'Role', 'Contact Number', 'NOK Name', 'NOK Number', 'Email']
    let excelData = []
    excelData = employees.map((record) => {
      return [
        record.name,
        getRoleTag(record.role_id).props.children || '-',
        record.contact_number || '-',
        record.nok_name || '-',
        record.nok_number || '-',
        record.email || '-'
      ]
    })
    generateCSV(excelData, tableHeaders, 'Employees List')
  }

  return (
    <>
      <MyToolbar title='Employees'>
        <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
          <Form.Item name="name">
            <Input placeholder='Search Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
          </Form.Item>
          <Form.Item name="role_id">
            <Select style={{ width: 140 }} placeholder="Filter by Role">
              <Select.Option value={null}>All</Select.Option>
              {Object.keys(Role).map((key, idx) => <Select.Option key={idx} value={Role[key].id}>{Role[key].name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Button onClick={resetForm}>Reset</Button>
        </Form>
      </MyToolbar>
      <Table dataSource={employees} columns={tableColumns} loading={loading} rowKey="id" />
      {hasWriteAccessTo(View.HR.name) &&
        <Button type="primary" icon={<FileExcelOutlined />} onClick={() => handleExcelExport()}>Export as Excel</Button>
      }
    </>
  );
}

export default EmployeeTable;


const tableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 220,
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
    width: 180,
    ellipsis: true,
    render: (contact_number) => contact_number || '-',
    sorter: (a, b) => sortByString(a.contact_number, b.contact_number),
  },
  {
    title: 'NOK Name',
    dataIndex: 'nok_name',
    width: 220,
    ellipsis: true,
    render: (nok_name) => nok_name || '-',
    sorter: (a, b) => sortByString(a.nok_name, b.nok_name),
  },
  {
    title: 'NOK Number',
    dataIndex: 'nok_number',
    width: 180,
    ellipsis: true,
    render: (nok_number) => nok_number || '-',
    sorter: (a, b) => sortByString(a.nok_number, b.nok_number),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    ellipsis: true,
    render: (email) => <EmailLink email={email} />,
    sorter: (a, b) => sortByString(a.email, b.email),
  },
  {
    title: 'Action',
    dataIndex: 'name',
    width: 100,
    ellipsis: true,
    render: (value, record) =>
      <Link to={`${record.id}`} state={{ employeeData: record }}>View</Link>
  }
]
