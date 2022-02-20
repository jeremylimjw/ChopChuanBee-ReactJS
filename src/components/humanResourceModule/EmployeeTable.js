import React, { useEffect, useState } from 'react';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Dropdown, Input, Menu, Table, Modal, Form } from 'antd';
import { Link } from 'react-router-dom';
import MyToolbar from '../layout/MyToolbar';
import { getActiveTag } from '../../enums/ActivationStatus';
import { sortByNumber, sortByString } from '../../utilities/sorters';
import { useApp } from '../../providers/AppProvider';
import { EmployeeApiHelper } from '../../api/employees';
import debounce from 'lodash.debounce';

const EmployeeTable = () => {

  const { handleHttpError } = useApp();
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

  return <div>
    <MyToolbar title='Employees'>
      <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
          <Form.Item name="name">
              <Input placeholder='Search Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
          </Form.Item>
          <Button onClick={resetForm}>Reset</Button>
      </Form>
    </MyToolbar>
    <Table dataSource={employees} columns={tableColumns} loading={loading} />
  </div>;
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
    title: 'Contact Number',
    dataIndex: 'contact_number',
    width: 180,
    ellipsis: true,
    sorter: (a, b) => sortByString(a.contact_number, b.contact_number),
  },
  {
    title: 'NOK Name',
    dataIndex: 'nok_name',
    width: 220,
    ellipsis: true,
    sorter: (a, b) => sortByString(a.nok_name, b.nok_name),
  },
  {
    title: 'NOK Number',
    dataIndex: 'nok_number',
    width: 180,
    ellipsis: true,
    sorter: (a, b) => sortByString(a.nok_number, b.nok_number),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    ellipsis: true,
    sorter: (a, b) => sortByString(a.email, b.email),
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
    title: 'Action',
    dataIndex: 'name',
    width: 100,
    ellipsis: true,
    render: (value, record) =>
      <Link to={`${record.id}`} state={{ employeeData: record }}>View</Link>
  }
]
