import { CalendarOutlined, TableOutlined } from '@ant-design/icons/lib/icons';
import { Button, Input, Modal, Spin, Switch, Typography } from 'antd'
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react'
import LeaveCalendarView from '../components/humanResourceModule/LeaveCalendarView';
import LeaveForm from '../components/humanResourceModule/LeaveForm'
import LeaveTable from '../components/humanResourceModule/LeaveTable'
import moment from 'moment';
import '../css/LeavePage.css'

const HRLeavePage = () => {
  const sampleLeaveData = [
    {
      leaveId: '1',
      name: 'John Tan',
      startDate: moment('2022-02-27').format('ll'),
      endDate: moment('2022-03-04').format('ll'),
      leaveDays: 5,
      leaveType: 'Annual',
      leaveStatus: 'Pending'
    },
    {
      leaveId: '2',
      name: 'Bobby Koh',
      startDate: moment('2022-02-27').format('ll'),
      endDate: moment('2022-03-04').format('ll'),
      leaveDays: 5,
      leaveType: 'Annual',
      leaveStatus: 'Pending'
    },
    {
      leaveId: '3',
      name: 'Alice Ng',
      startDate: moment('2022-02-27').format('ll'),
      endDate: moment('2022-03-04').format('ll'),
      leaveDays: 5,
      leaveType: 'Maternal',
      leaveStatus: 'Rejected'
    },
    {
      leaveId: '4',
      name: 'Lim Ah Ming',
      startDate: moment('2022-02-27').format('ll'),
      endDate: moment('2022-03-04').format('ll'),
      leaveDays: 5,
      leaveType: 'Sick',
      leaveStatus: 'Accepted'
    }
  ]
  const [modalVisibility, setModalVisibility] = useState(false)
  const [leavesDataSource, setLeavesDataSource] = useState([])
  const [viewMode, setViewMode] = useState()
  const [currView, setCurrView] = useState('TABLE')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (loading) {
      toggleViewMode()
      initializeLeavesDataSrc()
    } else {
      toggleViewMode('TABLE')
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
    setCurrView(view)
    switch (view) {
      case 'TABLE':
        setViewMode(<LeaveTable
          leavesDataSource={leavesDataSource}
        />
        )
        // setViewMode(<LeaveTable
        //   leavesDataSource={leavesDataSource}
        //   handleSearch = {handleSearch}
        // />)
        break
      case 'CALENDAR':
        setViewMode(<LeaveCalendarView />)
        break
      default:
        setViewMode(<div><Spin /></div>)
        break
    }
  }

  const handleSearch = (str) => {
    str = str.toLowerCase()
    let filteredArr = leavesDataSource.filter((value) => {
      let name = value.name.toLowerCase()
      return name.includes(str)
    })
    setViewMode(<LeaveTable
      leavesDataSource={filteredArr}
    />
    )
    // setSearchResults(filteredArr)
    // setLeavesDataSource(filteredArr)
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
          onClick={() => currView === 'TABLE' ? toggleViewMode('CALENDAR') : toggleViewMode('TABLE')}
        />
        <CalendarOutlined style={{ marginLeft: '10px' }} />
      </span>
    </div>
    <Input
      style={{
        width: '25%',
        marginBottom: '20px'
      }}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder='Search by employee name...' />
    {viewMode}
  </div>
}

export default HRLeavePage
