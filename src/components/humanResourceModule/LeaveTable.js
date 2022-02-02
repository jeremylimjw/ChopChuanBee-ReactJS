import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag } from 'antd';
import { leaveTypeFilter } from '../../utilities/TableFilters';
import { CheckOutlined, CloseOutlined, MoreOutlined } from '@ant-design/icons/lib/icons';


const LeaveTable = (props) => {
  const leavesDataSource = props.leavesDataSource
  const [dataSource, setDataSource] = useState([])
  const [confirmationVisibility, setConfirmationVisibility] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setDataSource(leavesDataSource)
  }, [leavesDataSource])

  // Array list of objects to be placed inside table
  const updateLeaveStatus = (record, status) => {
    let currRecordIdx = dataSource.findIndex(item => item.leaveId === record.leaveId)
    let updatedDataSrc = [...dataSource]
    switch (status) {
      case true:
        // Accept Leave  
        updatedDataSrc[currRecordIdx] = {
          ...record,
          leaveStatus: 'Accepted',
        }
        setDataSource(updatedDataSrc)
        message.success('Leave Approved!')
        break
      case false:
        // Reject Leave
        updatedDataSrc[currRecordIdx] = {
          ...record,
          leaveStatus: 'Rejected',
        }
        setDataSource(updatedDataSrc)
        message.success('Leave Rejected!')
        break
      default:
        break
    }
  }

  const processTags = (status) => {
    switch (status) {
      case 'Pending':
        return (<Tag color='orange'>{status}</Tag>)
      case 'Accepted':
        return (<Tag color='green'><CheckOutlined /> {status}</Tag>)
      case 'Rejected':
        return (<Tag color='volcano'><CloseOutlined /> {status}</Tag>)
      default:
        return (<Tag color='geekblue'>{status}</Tag>)
    }
  }

  const toolsMenu = (record) => {
    return (
      <Menu>
        <Menu.Item key='1'> <Button type='link' onClick={() => handleEdit(record.leaveId)}>Edit </Button> </Menu.Item>
        <Menu.Item key='2'>
          <Button type='link' onClick={() => setConfirmationVisibility(true)}> Delete</Button>
          <Modal
            title='Delete Confirmation'
            visible={confirmationVisibility}
            onOk={() => handleDelete(record)}
            onCancel={() => setConfirmationVisibility(false)}
          >
            <h3>Confirm deletion of leave application for {record.name}?</h3>
            <p>Duration: {record.duration}</p>
            <p>Type: {record.leaveType}</p>
          </Modal>
        </Menu.Item>
      </Menu>
    )
  }

  const handleEdit = (record) => {
    // Edit leave application 
  }

  const handleDelete = (record) => {
    let updatedArr = dataSource.filter((value) => {
      return value.leaveId !== record.leaveId
    })
    setDataSource(updatedArr)
    setConfirmationVisibility(false)
    message.success(`Deleted leave entry for ${record.name} from ${record.startDate} to ${record.endDate}`)
  }

  // const handleSearch = (str) => {
  //   str = str.toLowerCase()
  //   let filteredArr = leavesDataSource.filter((value) => {
  //     let name = value.name.toLowerCase()
  //     return name.includes(str)
  //   })
  //   setDataSource(filteredArr)
  // }

  const renderActionButtons = (record) => {
    switch (record.leaveStatus) {
      case 'Accepted':
        return <Button style={{ left: '15%' }} onClick={() => updateLeaveStatus(record, false)}>Reject</Button>
      case 'Rejected':
        return <Button style={{ left: '15%' }} onClick={() => updateLeaveStatus(record, true)}>Accept</Button>
      default:
        return <Space size="middle">
          <Button onClick={() => updateLeaveStatus(record, true)}>Accept</Button>
          <Button onClick={() => updateLeaveStatus(record, false)}>Reject</Button>
        </Space>
    }
  }

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      // render: value => formatDuration(value)
    },
    {
      title: 'Type',
      dataIndex: 'leaveType',
      filters: leaveTypeFilter,
      onFilter: (value, record) => record.leaveType === value
    },
    {
      title: 'Requested Days',
      dataIndex: 'leaveDays'
    },
    {
      title: 'Status',
      dataIndex: 'leaveStatus',
      render: (value) => processTags(value)
    },
    {
      title: 'Action',
      dataIndex: 'leaveId',
      render: (value, record) => (
        renderActionButtons(record)
      ),
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
    {/* <Input
      style={{
        width: '25%',
        marginBottom: '20px'
      }}
      onChange={(e) => props.handleSearch(e.target.value)}
      placeholder='Search by employee name...' /> */}
    <Table dataSource={dataSource} columns={tableColumns} />
  </div>;
};

export default LeaveTable;
