import { Button, message, Space, Table } from 'antd';
import React, { useState, useEffect } from 'react';

const LeaveTable = (props) => {
  console.log(props)
  // Array list of objects to be placed inside table
  const updateLeaveStatus = (status) => {
    console.log(status)
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

  const tableColumns = [{
    title: 'Date Created',
    dataIndex: 'startDate'
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    // render: value => formatDuration(value)
  },
  {
    title: 'Days',
    dataIndex: 'leaveDays'
  },
  {
    title: 'Type',
    dataIndex: 'leaveType'
  },
  {
    title: 'Status',
    dataIndex: 'leaveStatus'
  },
  {
    title: 'Action',
    render: (text, record) => (
      <Space size="middle">
        <Button onClick={() => updateLeaveStatus(true)}>Accept</Button>
        <Button onClick={() => updateLeaveStatus(false)}>Reject</Button>
      </Space>
    ),
  }]

  return <div>
    <Table dataSource={props.leavesDataSource} columns={tableColumns} />


  </div>;
};

export default LeaveTable;
