import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { EmployeeApiHelper } from '../../api/employees';
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

      <MyCard>
        <E3ApplicationsTable employee={employee} refreshBalances={refreshBalances} />
      </MyCard>

    </MyLayout>
  )
};

export default ViewEmployeePage;
