import { CalendarOutlined, PlusOutlined, TableOutlined } from '@ant-design/icons/lib/icons';
import { Button, Input, message, Modal, Select, Spin, Switch, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import LeaveCalendarView from '../components/humanResourceModule/LeaveCalendarView';
import LeaveForm from '../components/humanResourceModule/LeaveForm'
import LeaveTable from '../components/humanResourceModule/LeaveTable'
import '../css/LeavePage.css'
import { HRApiHelper } from '../api/humanResource';
import { EmployeeApiHelper } from '../api/employees';
import { useApp } from '../providers/AppProvider';
import moment from 'moment';
import MyLayout from '../components/layout/MyLayout';
import MyCard from '../components/layout/MyCard';
import MyToolbar from '../components/layout/MyToolbar';
import { leaveTypeFilter, leaveStatusFilter } from '../utilities/TableFilters';

const HRLeavePage = () => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const [leavesDataSource, setLeavesDataSource] = useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [componentState, setComponentState] = useState()
  const [currView, setCurrView] = useState('TABLE')
  const [loading, setLoading] = useState(true)
  const [employeeList, setEmployeeList] = useState([])
  const [leaveAccounts, setLeaveAccounts] = useState([])
  const { handleHttpError } = useApp()
  const breadcrumbs = [
    { url: '/', name: 'Human Resource' },
    { url: '', name: 'Leaves' }
  ]

  useEffect(() => {
    if (loading) {
      toggleViewMode()
      initializeLeavesDataSrc()
    } else {
      toggleViewMode('TABLE')
    }
  }, [loading]);

  const submitLeaveApplicationForm = async (leaveApplication) => {
    // API call to submit leave form to DB
    HRApiHelper.createNewLeaveApplication(leaveApplication)
      // .then((res) => res.status === 200 ? HRApiHelper.updateLeaveApplicationStatus({
      //   id: res.data.id,
      //   leave_status_id: 2
      // }) : message.error('Leave application failed'))
      .then(() => {
        setLoading(true)
        setModalVisibility(false)
      })
      .catch(handleHttpError)
  }

  const initializeLeavesDataSrc = async () => {
    let dataSrc = await HRApiHelper.getAllLeaveApplications()
      .then((res) => res.map((value) => {
        return {
          ...value,
          name: value.leave_account.employee.name,
          leave_type_id: value.leave_account.leave_type_id
        }
      }))
      .catch(handleHttpError)
    dataSrc.sort((a, b) => {
      return moment(b.created_at) - moment(a.created_at)
    })
    setLeavesDataSource(dataSrc)
    setFilteredDataSource(dataSrc)
    let leaveAcctData = await HRApiHelper.getAllLeaveAccounts()
      .catch(handleHttpError)
    setLeaveAccounts(leaveAcctData.data)
    let employeeData = await EmployeeApiHelper.getAllEmployees()
      .catch(handleHttpError)
    setEmployeeList(employeeData)
    setLoading(false)
  }


  const handleLeaveTypeFilterChange = (value) => {
    let comparedVal = leaveTypeFilter[value]
    let filteredArr = leavesDataSource.filter((value) => value.leave_type_id === comparedVal.value)
    setComponentState(
      <LeaveTable
        leavesDataSource={filteredArr}
        setLoading={setLoading}
      />
    )
  }

  const handleLeaveStatusFilterChange = (value) => {
    let comparedVal = leaveStatusFilter[value]
    let filteredArr = leavesDataSource.filter((value) => value.leave_status_id === comparedVal.value)
    setComponentState(
      <LeaveTable
        leavesDataSource={filteredArr}
        setLoading={setLoading}
      />
    )
  }

  /**
   * 
   * @param {String} view - 'TABLE' for table view || 'CALENDAR' for calendar view
   */
  const toggleViewMode = (view) => {
    setCurrView(view)
    switch (view) {
      case 'TABLE':
        setComponentState(
          <LeaveTable
            leavesDataSource={filteredDataSource}
            setLoading={setLoading}
          />
        )
        break
      case 'CALENDAR':
        setComponentState(<LeaveCalendarView />)
        break
      default:
        setComponentState(<div><Spin /></div>)
        break
    }
  }

  const handleSearch = (str) => {
    str = str.toLowerCase()
    let filteredArr = leavesDataSource.filter((value) => {
      let name = value.name.toLowerCase()
      return name.includes(str)
    })
    setComponentState(<LeaveTable
      leavesDataSource={filteredArr}
      setLoading={setLoading}
    />
    )
  }

  const resetFilters = () => {
    setComponentState(
      <LeaveTable
        leavesDataSource={leavesDataSource}
        setLoading={setLoading}
      />
    )
  }

  return <MyLayout
    breadcrumbs={breadcrumbs}
    bannerTitle='Leave Management'
  >
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      {/* <span>
        <TableOutlined style={{ marginRight: '10px' }} />
        <Switch
          className='view-toggle-button'
          onClick={() => currView === 'TABLE' ? toggleViewMode('CALENDAR') : toggleViewMode('TABLE')}
        />
        <CalendarOutlined style={{ marginLeft: '10px' }} />
      </span> */}
    </div>
    {currView === 'TABLE'
      ? <MyCard>
        <MyToolbar
          title='Leave Applications'
        >
          <Input
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search by name' />
          <Select
            onChange={(e) => handleLeaveTypeFilterChange(e)}
            placeholder='Filter by Leave Type'
          >
            <Select.Option value='0'>Annual</Select.Option>
            <Select.Option value='1'>Compassionate</Select.Option>
            <Select.Option value='2'>Maternity/Paternity</Select.Option>
            <Select.Option value='3'>Sick</Select.Option>
            <Select.Option value='4'>Childcare</Select.Option>
          </Select>

          <Select
            onChange={(e) => handleLeaveStatusFilterChange(e)}
            placeholder='Filter by Leave Status'
          >
            <Select.Option value='0'>Pending</Select.Option>
            <Select.Option value='1'>Accepted</Select.Option>
            <Select.Option value='2'>Rejected</Select.Option>
            <Select.Option value='3'>Cancelled</Select.Option>
          </Select>
          <Button onClick={() => resetFilters()}>Reset</Button>
          <Button
            onClick={() => setModalVisibility(true)}
          ><PlusOutlined />Create Leave Application</Button>
        </MyToolbar>
        {componentState}
      </MyCard>
      : <div />}
  </MyLayout>
}

export default HRLeavePage

