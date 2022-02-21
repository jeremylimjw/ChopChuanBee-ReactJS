import { PlusOutlined } from '@ant-design/icons/lib/icons'
import { Button, Card, List, message, Select, Space, Spin, Typography } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { HRApiHelper } from '../api/humanResource'
import EmployeeLeaveTable from '../components/humanResourceModule/EmployeeLeaveTable'
import NewLeaveForm from '../components/humanResourceModule/ViewEmployee/NewLeaveForm'
import MyCard from '../components/layout/MyCard'
import MyLayout from '../components/layout/MyLayout'
import MyToolbar from '../components/layout/MyToolbar'
import { useApp } from '../providers/AppProvider'
import { leaveTypeFilter, leaveStatusFilter } from '../utilities/TableFilters';

const MyLeavesPage = () => {
  const [leavesDataSource, setLeavesDataSource] = useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [leaveAccounts, setLeaveAccounts] = useState([])
  const [modalVisibility, setModalVisibility] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, handleHttpError } = useApp()
  const breadcrumbs = [
    { url: '/', name: 'Homepage' },
    { url: '', name: 'Leaves' }
  ]
  const renderLeaveTypes = (type) => {
    const leaveTypes = ['Annual', 'Compassionate', 'Maternity/Paternity', 'Sick', 'Childcare']
    return leaveTypes[type]
  }

  useEffect(() => {
    if (loading) {
      initializeEmployeeLeaveData()
    }
  }, [loading])


  const initializeEmployeeLeaveData = async () => {
    let leaveData = await HRApiHelper.getLeaveApplicationByEmployeeId(user.id)
      .catch(handleHttpError)
    leaveData = leaveData.sort((a, b) => {
      return moment(b.created_at) - moment(a.created_at)
    })
    setLeavesDataSource(leaveData)
    setFilteredDataSource(leaveData)
    let leaveAcct = await HRApiHelper.getLeaveAccountsById(user.id)
      .catch(handleHttpError)
    leaveAcct.sort((a, b) => a.leave_type.id - b.leave_type.id)
    setLeaveAccounts(leaveAcct)
    setLoading(false)
  }

  const submitLeaveApplicationForm = async (leaveApplication) => {
    HRApiHelper.createNewLeaveApplication(leaveApplication)
      .then((res) => res.status === 200 ? message.success('Leave Application has been submitted!')
        : message.error('Error submitting leave application, please try again'))
    setLoading(true)
    setModalVisibility(false)
  }

  const handleLeaveTypeFilterChange = (value) => {
    let comparedVal = leaveTypeFilter[value]
    let filteredArr = leavesDataSource.filter((value) => value.leave_account.leave_type.id === comparedVal.value)
    setFilteredDataSource(filteredArr)
  }

  const handleLeaveStatusFilterChange = (value) => {
    let comparedVal = leaveStatusFilter[value]
    let filteredArr = leavesDataSource.filter((value) => value.leave_status_id === comparedVal.value)
    setFilteredDataSource(filteredArr)
  }

  const resetFilters = () => {
    setFilteredDataSource(leavesDataSource)
  }

  return (
    <MyLayout
      breadcrumbs={breadcrumbs}
      bannerTitle='My Leaves'
    >

      <Modal
        title='Create Leave'
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        footer={null}
        width={600}
      >
        <NewLeaveForm
          submitLeaveApplicationForm={submitLeaveApplicationForm}
          selectedEmployee={user}
          leaveAccounts={leaveAccounts}
        />
      </Modal>
      {loading
        ? <Spin />
        :
        <React.Fragment>
          <div className='flex-side-by-side'
            style={{ marginTop: '24px' }}>
            <MyCard
              title='Leave Balance'
            >
              <List
                itemLayout='horizontal'
                dataSource={leaveAccounts}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.leave_type.name}
                      description={`${item.balance} Days`}
                    />
                  </List.Item>
                )}
              >
              </List>
            </MyCard>
            <MyCard
              title='Entitled Days'
            >
              <List
                itemLayout='horizontal'
                dataSource={leaveAccounts}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.leave_type.name}
                      description={`${item.entitled_days} Days`}
                    />
                  </List.Item>
                )}
              >
              </List>
            </MyCard>
          </div>
          <MyCard>
            <MyToolbar
              title='Leave Applications'
            >
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
                onClick={() => setModalVisibility(true)}>
                <PlusOutlined />Apply for leave
              </Button>
            </MyToolbar>
            <EmployeeLeaveTable
              leavesDataSource={filteredDataSource}
              setLoading={setLoading}
            />
          </MyCard>

        </React.Fragment>
      }
    </MyLayout>
  )
}

export default MyLeavesPage

