import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Input, Menu, message, Select, Space, Table } from 'antd';
import { leaveTypeFilter } from '../../utilities/TableFilters';
import { MoreOutlined } from '@ant-design/icons/lib/icons';


const LeaveTable = (props) => {
  // Array list of objects to be placed inside table
  const updateLeaveStatus = (leaveId, status) => {
    console.log(leaveId)
    switch (status) {
      case true:
        message.success('Leave Approved!')
        break
      case false:
        message.success('Leave Rejected!')
        break
      default:
        break
    }
  }

  const toolsMenu = (record) => {
    return (
      <Menu>
        <Menu.Item key='1'> <Button type='link' onClick={() => handleEdit(record.leaveId)}>Edit </Button> </Menu.Item>
        <Menu.Item key='2'> <Button type='link' onClick={() => handleDelete(record.leaveId)}> Delete</Button> </Menu.Item>
      </Menu>
    )
  }

  const handleEdit = (leaveId) => {
    console.log(`${leaveId} edit`)
  }

  const handleDelete = (leaveId) => {
    console.log(`${leaveId} del`)
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
      dataIndex: 'leaveStatus'
    },
    {
      title: 'Action',
      dataIndex: 'leaveId',
      render: (value) => (
        <Space size="middle">
          <Button onClick={() => updateLeaveStatus(value, true)}>Accept</Button>
          <Button onClick={() => updateLeaveStatus(value, false)}>Reject</Button>
        </Space>
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
    <Input></Input>
    <Table dataSource={props.leavesDataSource} columns={tableColumns} />


  </div>;
};

export default LeaveTable;
