import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag } from 'antd';
import { leaveTypeFilter } from '../../utilities/TableFilters';
import { CheckOutlined, CloseOutlined, MoreOutlined } from '@ant-design/icons/lib/icons';
import { HRApiHelper } from '../../api/humanResource';
import moment from 'moment';

const LeaveTable = (props) => {
  const leavesDataSource = props.leavesDataSource
  const [dataSource, setDataSource] = useState([])
  const leaveTypes = ['', 'Annual', 'Compassionate', 'Maternity/Paternity', 'Sick', 'Childcare']

  useEffect(() => {
    setDataSource(leavesDataSource)
  }, [leavesDataSource])


  // Array list of objects to be placed inside table
  const updateLeaveStatus = async (record, status) => {
    let updatedDataSrc = [...dataSource]
    switch (status) {
      case true:
        // Accept Leave  
        await HRApiHelper.updateLeaveApplicationStatus({
          id: record.id,
          leave_status_id: 2
        })
        updatedDataSrc[record] = {
          ...record,
          leave_status_id: 2,
        }
        setDataSource(updatedDataSrc)
        message.success('Leave Approved!')
        break
      case false:
        // Reject Leave
        await HRApiHelper.updateLeaveApplicationStatus({
          id: record.id,
          leave_status_id: 3
        })
        updatedDataSrc[record] = {
          ...record,
          leave_status_id: 3,
        }
        setDataSource(updatedDataSrc)
        message.success('Leave Rejected!')
        break
      default:
        break
      }
      props.setLoading(true)
  }

  const processTags = (status) => {
    switch (status) {
      case 1:
        return (<Tag color='orange'>Pending</Tag>)
      case 2:
        return (<Tag color='green'><CheckOutlined />Accepted</Tag>)
      case 3:
        return (<Tag color='volcano'><CloseOutlined />Rejected</Tag>)
      case 4:
        return (<Tag color='purple'>Cancelled</Tag>)
      default:
        return (<Tag color='geekblue'>{status}</Tag>)
    }
  }

  const renderActionButtons = (record) => {
    switch (record.leave_status_id) {
      case 1:
        return <Space size="middle">
          <Button onClick={() => updateLeaveStatus(record, true)}>Accept</Button>
          <Button onClick={() => updateLeaveStatus(record, false)}>Reject</Button>
        </Space>
      default:
        return <div />
    }
  }

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      render: (value) => moment(value).format('ll'),
      sorter: (a, b) => moment(a.start_date) - moment(b.start_date)
  },
  {
      title: 'End Date',
      dataIndex: 'end_date',
      render: (value) => moment(value).format('ll'),
      sorter: (a, b) => moment(a.end_date) - moment(b.end_date)
  },
    {
      title: 'Type',
      dataIndex: 'leave_type_id',
      filters: leaveTypeFilter,
      render: (value) => leaveTypes[value],
      onFilter: (value, record) => record.leave_type_id === value
    },
    {
      title: 'Requested Days',
      dataIndex: 'num_days'
    },
    {
      title: 'Status',
      dataIndex: 'leave_status_id',
      render: (value) => processTags(value)
    },
    {
      title:'Creation Date',
      dataIndex: 'created_at',
      render:(value) => moment(value).format('ll')
    },
    {
      title:'Remarks',
      dataIndex: 'remarks'
    },
    {
      title: 'Action',
      dataIndex: 'leaveId',
      render: (value, record) => (
        renderActionButtons(record)
      ),
    },
  ]

  return <div>
    <Table dataSource={dataSource} columns={tableColumns} />
  </div>;
};

export default LeaveTable;



  // const toolsMenu = (record) => {
  //   return (
  //     <Menu>
  //       <Menu.Item key='1'> <Button type='link' onClick={() => handleEdit(record.leaveId)}>Edit </Button> </Menu.Item>
  //       <Menu.Item key='2'>
  //         <Button type='link' onClick={() => setConfirmationVisibility(true)}> Delete</Button>
  //         <Modal
  //           title='Delete Confirmation'
  //           visible={confirmationVisibility}
  //           onOk={() => handleDelete(record)}
  //           onCancel={() => setConfirmationVisibility(false)}
  //         >
  //           <h3>Confirm deletion of leave application for {record.name}?</h3>
  //           <p>Duration: {record.duration}</p>
  //           <p>Type: {record.leaveType}</p>
  //         </Modal>
  //       </Menu.Item>
  //     </Menu>
  //   )
  // }

    // const handleDelete = (record) => {
  //   let updatedArr = dataSource.filter((value) => {
  //     return value.leaveId !== record.leaveId
  //   })
  //   setDataSource(updatedArr)
  //   setConfirmationVisibility(false)
  //   message.success(`Deleted leave entry for ${record.name} from ${record.startDate} to ${record.endDate}`)
  // }

  
  // const handleSearch = (str) => {
  //   str = str.toLowerCase()
  //   let filteredArr = leavesDataSource.filter((value) => {
  //     let name = value.name.toLowerCase()
  //     return name.includes(str)
  //   })
  //   setDataSource(filteredArr)
  // }