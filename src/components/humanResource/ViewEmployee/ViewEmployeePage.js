import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { EmployeeApiHelper } from '../../../api/EmployeeApiHelper';
import { HRApiHelper } from '../../../api/HRApiHelper';
import { useApp } from '../../../providers/AppProvider';
import MyCard from '../../common/MyCard';
import MyLayout from '../../common/MyLayout/MyLayout';
import E1Form from './E1Form';
import E2LeaveBalance from './E2LeaveBalance';
import E3ApplicationsTable from './E3ApplicationsTable';

/**
 * HR Module
 * Employee's page to view and manage their personal particulars and leave related applications 
 * 
 */
const ViewEmployeePage = (props) => {
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

  const refreshBalances = useCallback(() => {
    if (employee) {
      HRApiHelper.getLeaveAccountsById(employee.id)
        .then((results) => {
            setLeaveAccounts(results)
        })
        .catch(handleHttpError);
    }
  }, [employee, handleHttpError])
  
  useEffect(() => {
    refreshBalances()
  }, [employee, handleHttpError, setLeaveAccounts, refreshBalances]);

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

      <MyCard style={{ marginTop: 0 }}>
        <E3ApplicationsTable employee={employee} refreshBalances={refreshBalances} />
      </MyCard>

    </MyLayout>
  )
};

export default ViewEmployeePage;
