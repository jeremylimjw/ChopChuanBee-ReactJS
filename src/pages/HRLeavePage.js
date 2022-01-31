import { CalendarOutlined, TableOutlined } from '@ant-design/icons/lib/icons';
import { Button, Modal, Spin, Switch, Typography } from 'antd'
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react'
import { axiosObject } from '../api/axiosWrapper';
import LeaveCalendarView from '../components/humanResourceModule/LeaveCalendarView';
import LeaveForm from '../components/humanResourceModule/LeaveForm'
import LeaveTable from '../components/humanResourceModule/LeaveTable'
import '../css/LeavePage.css'

const HRLeavePage = () => {
  const sampleLeaveData = [
    {
      leaveId: '1',
      name: 'John Tan',
      startDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
      endDate: format(new Date(2022, 3, 3), 'yyyy-MM-dd'),
      leaveDays: 12,
      leaveType: 'Annual',
      leaveStatus: 'Pending'
    },
    {
      leaveId: '2',
      name: 'Bobby Koh',
      startDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
      endDate: format(new Date(2022, 3, 3), 'yyyy-MM-dd'),
      leaveDays: 12,
      leaveType: 'Annual',
      leaveStatus: 'Pending'
    },
    {
      leaveId: '3',
      name: 'Alice Ng',
      startDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
      endDate: format(new Date(2022, 3, 3), 'yyyy-MM-dd'),
      leaveDays: 12,
      leaveType: 'Maternal',
      leaveStatus: 'Pending'
    },
    {
      leaveId: '4',
      name: 'Lim Ah Ming',
      startDate: format(new Date(2022, 2, 20), 'yyyy-MM-dd'),
      endDate: format(new Date(2022, 3, 3), 'yyyy-MM-dd'),
      leaveDays: 12,
      leaveType: 'Sick',
      leaveStatus: 'Pending'
    }
  ]
  const [modalVisibility, setModalVisibility] = useState(false)
  const [leavesDataSource, setLeavesDataSource] = useState([])
  const [viewMode, setViewMode] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loading) {
      toggleViewMode()
      initializeLeavesDataSrc()
    } else {
      toggleViewMode(false)
    }
  }, [loading]);

  const submitLeaveForm = () => {
    // API call to submit leave form to DB
    setModalVisibility(false)
  }

  const initializeLeavesDataSrc = () => {
    let dataSrc = sampleLeaveData.map((value) => {
      return {
        ...value,
        duration: formatDuration(value.startDate, value.endDate)
      }
    })
    setLeavesDataSource(dataSrc)
    setLoading(false)
  }

  /**
   * 
   * @param {String} view - 'TABLE' for table view || 'CALENDAR' for calendar view
   */
  const toggleViewMode = (view) => {
    switch (view) {
      case false:
        setViewMode(<LeaveTable
          leavesDataSource={leavesDataSource}
        />)
        break
      case true:
        setViewMode(<LeaveCalendarView />)
        break
      default:
        setViewMode(<div><Spin /></div>)
        break
    }
  }

  const formatDuration = (startDate, endDate) => {
    return `From ${startDate} to ${endDate}`
  }



  return <div>
    <Typography.Title>Leave Management</Typography.Title>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        style={{ marginBottom: '20px' }}
        onClick={() => setModalVisibility(true)}
      >Create Leave Application</Button>
      <Modal
        title='Create Leave'
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        footer={null}
        width={600}
      >
        <LeaveForm
          submitLeaveForm={submitLeaveForm}
        />
      </Modal>
      <span>
        <TableOutlined style={{ marginRight: '10px' }} />
        <Switch
          className='view-toggle-button'
          onClick={toggleViewMode}
        />
        <CalendarOutlined style={{ marginLeft: '10px' }} />
      </span>
    </div>
    {viewMode}
  </div>
}

export default HRLeavePage
