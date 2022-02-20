import React, { useEffect, useState } from 'react';
import { MoreOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Dropdown, Input, Menu, Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import MyToolbar from '../layout/MyToolbar';

const EmployeeTable = (props) => {
  const [confirmationVisibility, setConfirmationVisibility] = useState(false)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    setDataSource(props.employeesDataSource)
  }, [])

  const handleSearch = (str) => {
    str = str.toLowerCase()
    let filteredArr = props.employeesDataSource.filter((value) => {
      let name = value.name.toLowerCase()
      return name.includes(str)
    })
    setDataSource(filteredArr)
  }

  const tableColumns = [
    {
      title: 'Staff Name',
      dataIndex: 'name',
    },
    {
      title: 'E-Mail',
      dataIndex: 'email'
    },
    {
      title: 'Contact',
      dataIndex: 'contact_number'
    },
    {
      title: 'NOK Name',
      dataIndex: 'nok_name'
    },
    {
      title: 'NOK Number',
      dataIndex: 'nok_number'
    },
    {
      title: 'Action',
      dataIndex: 'name',
      render: (value, record) =>
        <Link to={`${record.id}`} state={{ employeeData: record }}>View Details</Link>
    }
  ]

  return <div>
    <MyToolbar title='Employees'>
      <Input
        suffix={<SearchOutlined className='grey' />}
        style={{
          width: 180
        }}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder='Search name' />
    </MyToolbar>
    <Table dataSource={dataSource} columns={tableColumns} />
  </div>;
}
  ;

export default EmployeeTable;
