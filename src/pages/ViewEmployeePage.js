import { EditOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, message, Spin, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { EmployeeApiHelper } from '../api/employees';
import { HRApiHelper } from '../api/humanResource';
import EmployeeLeaveTable from '../components/humanResourceModule/EmployeeLeaveTable';
import LeaveAccountForm from '../components/humanResourceModule/LeaveAccountForm';
import LeaveForm from '../components/humanResourceModule/LeaveForm';

const ViewEmployeePage = (props) => {
    const location = useLocation()
    const employeeData = location.state.employeeData
    const [leavesDataSource, setLeavesDataSource] = useState([])
    const [leaveAccounts, setLeaveAccounts] = useState([])
    const [modalVisibility, setModalVisibility] = useState(false)
    const [replenishLeaveModalVisibility, setReplenishLeaveModalVisibility] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading) {
            fetchEmployeeLeaveApplications()
            fetchEmployeeLeaveAccounts()
            setLoading(false)
        }
    }, [])

    const fetchEmployeeLeaveApplications = async () => {
        let employeeLeaveApplications = await HRApiHelper.getLeaveApplicationByEmployeeId(employeeData.id)
        setLeavesDataSource(employeeLeaveApplications)
    }

    const fetchEmployeeLeaveAccounts = async () => {
        let leaveAcct = await HRApiHelper.getEmployeeLeaveAccounts(employeeData.id)
        setLeaveAccounts(leaveAcct)
    }

    const updateEntitledLeaves = (values) => {
        let leave_accounts = []
        leaveAccounts.forEach((leaveAccount) => {
            leave_accounts.push({
                id: leaveAccount.id,
                entitled_days: parseInt(values[leaveAccount.leave_type.id])
            })
        })
        HRApiHelper.updateEmployeeLeaveAccounts(leave_accounts)
            .then((res) => res.status === 200 ? message.success('Entitled leaves updated!') : message.error('Error, please try again.'))
        fetchEmployeeLeaveAccounts() // Re-initialize leave account state
        setReplenishLeaveModalVisibility(false)
    }

    const submitLeaveApplicationForm = (leaveApplication) => {
        HRApiHelper.createNewLeaveApplication(leaveApplication)
            .then((res) => res.status === 200 ? message.success('Leave application success!') : message.error('Leave application failed'))
        setModalVisibility(false)
    }

    return <div>
        <Typography.Title>View an Employee</Typography.Title>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography.Title level={2}>{employeeData.name}</Typography.Title>
            <Button size='large'><EditOutlined />Edit Particulars</Button>
        </div>
        <Modal
            title='Create Leave'
            visible={modalVisibility}
            onCancel={() => setModalVisibility(false)}
            footer={null}
            width={600}
        >
            <LeaveForm
                submitLeaveApplicationForm={submitLeaveApplicationForm}
                selectedEmployee={employeeData}
                leaveAccounts={leaveAccounts}
            />
        </Modal>
        <Modal
            title='Manage Entitled Leaves'
            visible={replenishLeaveModalVisibility}
            footer={null}
            width={400}
            onCancel={() => setReplenishLeaveModalVisibility(false)}
        >
            <LeaveAccountForm
                updateEntitledLeaves={updateEntitledLeaves}
                leaveAccountList={leaveAccounts}
            />
        </Modal>
        <Button onClick={() => setModalVisibility(true)}><PlusOutlined />Apply leave for {employeeData.name}</Button>
        <Button
            style={{ marginLeft: '20px' }}
            onClick={() => setReplenishLeaveModalVisibility(true)}
        ><PlusOutlined />Manage Entitled Leaves</Button>
        {loading
            ? <Spin />
            : <EmployeeLeaveTable
                setLeavesDataSource={setLeavesDataSource}
                leavesDataSource={leavesDataSource} />
        }

    </div>
};

export default ViewEmployeePage;
