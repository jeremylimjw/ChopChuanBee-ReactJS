import { CalendarOutlined, PlusOutlined, TableOutlined } from '@ant-design/icons/lib/icons';
import { Button, Input, message, Modal, Spin, Switch, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import LeaveCalendarView from '../components/humanResourceModule/LeaveCalendarView';
import LeaveForm from '../components/humanResourceModule/LeaveForm'
import LeaveTable from '../components/humanResourceModule/LeaveTable'
import moment from 'moment';
import '../css/LeavePage.css'
import { HRApiHelper } from '../api/humanResource';
import { EmployeeApiHelper } from '../api/employees';

const HRLeavePage = () => {
  const sampleLeaveData = [
    {
      id: '67214447-c743-4ea0-8767-842b4464ff6c',
      name: 'John Tan',
      start_date: moment('2022-02-27').format('ll'),
      end_date: moment('2022-03-04').format('ll'),
      num_days: 5,
      leaveType: 'Annual',
      leave_status_id: 1,
      leaveStatus: 'Pending'
    },
    {
      id: '2',
      name: 'Bobby Koh',
      start_date: moment('2022-02-27').format('ll'),
      end_date: moment('2022-03-04').format('ll'),
      num_days: 5,
      leaveType: 'Annual',
      leave_status_id: 2,
      leaveStatus: 'Pending'
    },
    {
      id: '3',
      name: 'Alice Ng',
      start_date: moment('2022-02-27').format('ll'),
      end_date: moment('2022-03-04').format('ll'),
      num_days: 5,
      leaveType: 'Maternal',
      leave_status_id: 3,
      leaveStatus: 'Rejected'
    },
    {
      id: '4',
      name: 'Lim Ah Ming',
      start_date: moment('2022-02-27').format('ll'),
      end_date: moment('2022-03-04').format('ll'),
      num_days: 5,
      leaveType: 'Sick',
      leave_status_id: 4,
      leaveStatus: 'Accepted'
    }
  ]
  const [modalVisibility, setModalVisibility] = useState(false)
  const [leavesDataSource, setLeavesDataSource] = useState([])
  const [viewMode, setViewMode] = useState()
  const [currView, setCurrView] = useState('TABLE')
  const [loading, setLoading] = useState(true)
  const [employeeList, setEmployeeList] = useState([])
  const [leaveAccounts, setLeaveAccounts] = useState([])


  useEffect(() => {
    if (loading) {
      toggleViewMode()
      initializeLeavesDataSrc()
      initializeEmployeeList()
      setLoading(false)
    } else {
      toggleViewMode('TABLE')
    }
  }, [loading]);

  const submitLeaveApplicationForm = (leaveApplication) => {
    // API call to submit leave form to DB
    HRApiHelper.createNewLeaveApplication(leaveApplication)
      .then((res) => res.status === 200 ? message.success('Leave application success!') : message.error('Leave application failed'))
    setModalVisibility(false)
  }

  const initializeLeavesDataSrc = async () => {
    let dataSrc = sampleLeaveData.map((value) => {
      return {
        ...value,
        duration: formatDuration(value.startDate, value.endDate)
      }
    })
    setLeavesDataSource(dataSrc)
    let leaveAcctData = await HRApiHelper.getAllLeaveAccounts()
    setLeaveAccounts(leaveAcctData.data)
  }

  const initializeEmployeeList = async () => {
    let result = await EmployeeApiHelper.getAllEmployees()
    setEmployeeList(result)
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
      ><PlusOutlined />Create Leave Application</Button>
      <Modal
        title='Create Leave'
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        footer={null}
        width={600}
      >
        <LeaveForm
          submitLeaveApplicationForm={submitLeaveApplicationForm}
          leaveAccounts={leaveAccounts}
          employeeList={employeeList}
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
