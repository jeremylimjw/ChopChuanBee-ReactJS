import { PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, Col, Input, List, message, Row, Select, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { useLocation } from 'react-router-dom'
import { EmployeeApiHelper } from '../../api/employees';
import { GeneralApiHelper } from '../../api/general';
import { HRApiHelper } from '../../api/humanResource';
import UserProfileForm from '../../components/general/UserProfileForm';
import EmployeeLeaveTable from '../../components/humanResourceModule/EmployeeLeaveTable';
import LeaveForm from '../../components/humanResourceModule/LeaveForm';
import E1Form from '../../components/humanResourceModule/ViewEmployee/E1Form';
import E2LeaveBalance from '../../components/humanResourceModule/ViewEmployee/E2LeaveBalance';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import MyToolbar from '../../components/layout/MyToolbar';
import { useApp } from '../../providers/AppProvider';
import { leaveTypeFilter, leaveStatusFilter } from '../../utilities/TableFilters';

/**
 * HR Module
 * Employee's page to view and manage their personal particulars and leave related applications 
 * 
 */
const ViewEmployeePage = (props) => {
  const location = useLocation()
  // const employee = location.state?.employeeData || {}
  const [leavesDataSource, setLeavesDataSource] = useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [leaveAccounts, setLeaveAccounts] = useState([])
  const [profileData, setProfileData] = useState({})
  const [modalVisibility, setModalVisibility] = useState(false)
  const [replenishLeaveModalVisibility, setReplenishLeaveModalVisibility] = useState(false)
  const [loading, setLoading] = useState(false)


  const { id } = useParams();
  const navigate = useNavigate();

  const { handleHttpError } = useApp()

  const [employee, setEmployee] = useState()

  const breadcrumbs = [
    { url: '/humanResource/employees', name: 'Human Resource' },
    { url: '/humanResource/employees', name: 'Employees' },
    { url: `/humanResource/employees/${employee?.id}`, name: employee?.name },
  ]

  useEffect(() => {
    EmployeeApiHelper.get({ id: id }) // Get employee by ID
      .then((result) => {
        if (result.length === 0) {
          navigate('../');
          return;
        }
        setEmployee(result[0]);
      })
      .catch(handleHttpError);
  }, [id, handleHttpError, navigate]);


  useEffect(() => {
    if (employee) {
      initializeData()
    }
  }, [employee])

  const initializeData = async () => {
    fetchEmployeeLeaveApplications()
    fetchEmployeeLeaveAccounts()
    fetchEmployeeProfileData()
    setLoading(false)
  }

  const fetchEmployeeLeaveApplications = async () => {
    let employeeLeaveApplications = await HRApiHelper.getLeaveApplicationByEmployeeId(employee.id)
      .catch(handleHttpError)
    employeeLeaveApplications.sort((a, b) => moment(b.created_at) - moment(a.created_at))
    setLeavesDataSource(employeeLeaveApplications)
    setFilteredDataSource(employeeLeaveApplications)
  }

  const fetchEmployeeLeaveAccounts = async () => {
    let leaveAcct = await HRApiHelper.getEmployeeLeaveAccounts(employee.id)
      .catch(handleHttpError)
    leaveAcct.sort((a, b) => a.leave_type.id - b.leave_type.id)
    setLeaveAccounts(leaveAcct)
  }

  const fetchEmployeeProfileData = async () => {
    let profileData = await GeneralApiHelper.getProfile(employee.id)
      .catch(handleHttpError)
    setProfileData(profileData[0])
  }

  const updateEntitledLeaves = async (values) => {
    let leave_accounts = []
    leaveAccounts.forEach((leaveAccount) => {
      leave_accounts.push({
        id: leaveAccount.id,
        entitled_days: parseInt(values[leaveAccount.leave_type.id])
      })
    })
    HRApiHelper.updateEmployeeLeaveAccounts(leave_accounts)
      .then((res) => res.status === 200 ? message.success('Entitled leaves updated!') : message.error('Error, please try again.'))
      .catch(handleHttpError)
    fetchEmployeeLeaveAccounts() // Re-initialize leave account state
    setReplenishLeaveModalVisibility(false)
  }

  const submitLeaveApplicationForm = async (leaveApplication) => {
    HRApiHelper.createNewLeaveApplication(leaveApplication)
      .then((res) => res.status === 200 ? HRApiHelper.updateLeaveApplicationStatus({
        id: res.data.id,
        leave_status_id: 2
      }) : message.error('Leave application failed'))
      .then(() => fetchEmployeeLeaveApplications())
      .catch(handleHttpError)
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
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle={employee?.name}>

      <Row>

        <Col xl={10} xs={24}>
          <MyCard>
            <E1Form employee={employee} setEmployee={setEmployee} />
          </MyCard>
        </Col>

        <Col xl={14} xs={24}>
          <MyCard>
            <E2LeaveBalance employee={employee} />
          </MyCard>
        </Col>

      </Row>

      <MyCard>
        <MyToolbar title='Leave Applications'>
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
          <Button onClick={() => setModalVisibility(true)}><PlusOutlined />Apply leave for {employee?.name}</Button>
        </MyToolbar>
        <Modal
          title='Create Leave'
          visible={modalVisibility}
          onCancel={() => setModalVisibility(false)}
          footer={null}
          width={600}
        >
          <LeaveForm
            submitLeaveApplicationForm={submitLeaveApplicationForm}
            selectedEmployee={employee}
            leaveAccounts={leaveAccounts}
          />
        </Modal>

        {loading
          ? <Spin />
          : <EmployeeLeaveTable
            leavesDataSource={filteredDataSource}
            viewMode='HR_LEAVES'
            setLoading={setLoading}
          />
        }
      </MyCard>
    </MyLayout>
  )
};

export default ViewEmployeePage;
