import React, { useEffect, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons/lib/icons';
import { Button, Dropdown, Input, Menu, Table, Modal } from 'antd';
import { Link } from 'react-router-dom';

const EmployeeTable = (props) => {
  const [confirmationVisibility, setConfirmationVisibility] = useState(false)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    setDataSource(props.employeesDataSource)
  }, [])

  const viewEmployee = (record) => {

  }

  const toolsMenu = (record) => {
    return (
      <Menu>
        <Menu.Item key='1'> <Button type='link' onClick={() => handleEdit(record.leaveId)}>Edit </Button> </Menu.Item>
        <Menu.Item key='2'>
          <Button type='link' onClick={() => setConfirmationVisibility(true)}> Deactivate</Button>
          <Modal
            title='Deactivation Confirmation'
            visible={confirmationVisibility}
            onOk={() => handleDeactivation(record)}
            onCancel={() => setConfirmationVisibility(false)}
          >
            <h3>Deactivate Employee?</h3>
          </Modal>
        </Menu.Item>
      </Menu>
    )
  }

  const handleDeactivation = (record) => {

  }

  const handleEdit = (record) => {

  }

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
      render: (value, record) =>
        <Link to={`${record.id}`} state={{ employeeData: record }}> {value}</Link>
    },
    {
      title: 'E-Mail',
      dataIndex: 'email'
    },
    {
      title: 'Contact',
      dataIndex: 'contact_Number'
    },
    {
      title: 'NOK Name',
      dataIndex: 'nok_Name'
    },
    {
      title: 'NOK Number',
      dataIndex: 'nok_Number'
    },
    {
      title: '',
      render: (value, record) => <Dropdown overlay={() => toolsMenu(record)}
        trigger='click'>
        <MoreOutlined />
      </Dropdown>
    }
  ]

  return <div>
    <Input
      style={{
        width: '25%',
        marginBottom: '20px'
      }}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder='Search by employee name...' />
    <Table dataSource={dataSource} columns={tableColumns} />
  </div>;
}
  ;

export default EmployeeTable;
