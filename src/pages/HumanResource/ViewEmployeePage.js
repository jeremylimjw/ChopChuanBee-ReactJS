import { Button, Col, Input, List, message, Row, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { EmployeeApiHelper } from '../../api/employees';
import { GeneralApiHelper } from '../../api/general';
import { HRApiHelper } from '../../api/humanResource';
import E1Form from '../../components/humanResourceModule/ViewEmployee/E1Form';
import E2LeaveBalance from '../../components/humanResourceModule/ViewEmployee/E2LeaveBalance';
import E3ApplicationsTable from '../../components/humanResourceModule/ViewEmployee/E3ApplicationsTable';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import { useApp } from '../../providers/AppProvider';

/**
 * HR Module
 * Employee's page to view and manage their personal particulars and leave related applications 
 * 
 */
const ViewEmployeePage = (props) => {
  const [leavesDataSource, setLeavesDataSource] = useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [profileData, setProfileData] = useState({})
  const [modalVisibility, setModalVisibility] = useState(false)
  const [loading, setLoading] = useState(false)

  const { id } = useParams();
  const navigate = useNavigate();

  const { handleHttpError } = useApp()

  const [employee, setEmployee] = useState();
  const [leaveAccounts, setLeaveAccounts] = useState([]);

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
          HRApiHelper.getLeaveAccountsById(employee.id)
              .then((results) => {
                  setLeaveAccounts(results)
              })
              .catch(handleHttpError);
      }
  }, [employee, handleHttpError, setLeaveAccounts]);


  // useEffect(() => {
  //   if (employee) {
  //     initializeData()
  //   }
  // }, [employee])

  // const initializeData = async () => {
  //   fetchEmployeeLeaveApplications()
  //   fetchEmployeeLeaveAccounts()
  //   fetchEmployeeProfileData()
  //   setLoading(false)
  // }

  // const fetchEmployeeLeaveApplications = async () => {
  //   let employeeLeaveApplications = await HRApiHelper.getLeaveApplicationByEmployeeId(employee.id)
  //     .catch(handleHttpError)
  //   employeeLeaveApplications.sort((a, b) => moment(b.created_at) - moment(a.created_at))
  //   setLeavesDataSource(employeeLeaveApplications)
  //   setFilteredDataSource(employeeLeaveApplications)
  // }

  // const fetchEmployeeLeaveAccounts = async () => {
  //   let leaveAcct = await HRApiHelper.getLeaveAccountsById(employee.id)
  //     .catch(handleHttpError)
  //   leaveAcct.sort((a, b) => a.leave_type.id - b.leave_type.id)
  //   setLeaveAccounts(leaveAcct)
  // }

  // const fetchEmployeeProfileData = async () => {
  //   let profileData = await GeneralApiHelper.getProfile(employee.id)
  //     .catch(handleHttpError)
  //   setProfileData(profileData[0])
  // }

  // const submitLeaveApplicationForm = async (leaveApplication) => {
  //   HRApiHelper.createNewLeaveApplication(leaveApplication)
  //     .then((res) => res.status === 200 ? HRApiHelper.updateLeaveApplicationStatus({
  //       id: res.data.id,
  //       leave_status_id: 2
  //     }) : message.error('Leave application failed'))
  //     .then(() => fetchEmployeeLeaveApplications())
  //     .catch(handleHttpError)
  //   setModalVisibility(false)
  // }

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle={employee?.name}>

      <Row>
        <Col>
          <MyCard style={{ width: 500 }}>
            <E1Form employee={employee} setEmployee={setEmployee} />
          </MyCard>
        </Col>

        <Col>
          <MyCard style={{ width: 500 }}>
            <E2LeaveBalance employee={employee} leaveAccounts={leaveAccounts} setLeaveAccounts={setLeaveAccounts} />
          </MyCard>
        </Col>
      </Row>

      <MyCard>
        <E3ApplicationsTable employee={employee} leaveAccounts={leaveAccounts} setLeaveAccounts={setLeaveAccounts} />
      </MyCard>

    </MyLayout>
  )
};

export default ViewEmployeePage;
