import { EditOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, Collapse, message, Spin, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { EmployeeApiHelper } from '../api/employees';
import { GeneralApiHelper } from '../api/general';
import { HRApiHelper } from '../api/humanResource';
import UserProfileForm from '../components/general/UserProfileForm';
import EmployeeLeaveTable from '../components/humanResourceModule/EmployeeLeaveTable';
import LeaveAccountForm from '../components/humanResourceModule/LeaveAccountForm';
import LeaveForm from '../components/humanResourceModule/LeaveForm';
import { useApp } from '../providers/AppProvider';

/**
 * HR Module
 * Employee's page to view and manage their personal particulars and leave related applications 
 * 
 */
const ViewEmployeePage = (props) => {
    const location = useLocation()
    const employeeData = location.state.employeeData
    const [leavesDataSource, setLeavesDataSource] = useState([])
    const [leaveAccounts, setLeaveAccounts] = useState([])
    const [profileData, setProfileData] = useState({})
    const [modalVisibility, setModalVisibility] = useState(false)
    const [replenishLeaveModalVisibility, setReplenishLeaveModalVisibility] = useState(false)
    const [loading, setLoading] = useState(true)
    const { handleHttpError } = useApp()

    useEffect(() => {
        if (loading) {
            fetchEmployeeLeaveApplications()
            fetchEmployeeLeaveAccounts()
            fetchEmployeeProfileData()
            setLoading(false)
        }
    }, [])

    const fetchEmployeeLeaveApplications = async () => {
        let employeeLeaveApplications = await HRApiHelper.getLeaveApplicationByEmployeeId(employeeData.id)
            .catch(handleHttpError)
        setLeavesDataSource(employeeLeaveApplications)
    }

    const fetchEmployeeLeaveAccounts = async () => {
        let leaveAcct = await HRApiHelper.getEmployeeLeaveAccounts(employeeData.id)
            .catch(handleHttpError)
        setLeaveAccounts(leaveAcct)
    }

    const fetchEmployeeProfileData = async () => {
        let profileData = await GeneralApiHelper.getProfile(employeeData.id)
        setProfileData(profileData)
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
            .then((res) => res.status === 200 ? HRApiHelper.updateLeaveApplicationStatus({
                id: res.data.id,
                leave_status_id: 2
            }) : message.error('Leave application failed'))
            .then(() => fetchEmployeeLeaveApplications())
            .catch(handleHttpError)
        setModalVisibility(false)
    }

    return <div>
        <Typography.Title>View an Employee</Typography.Title>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography.Title level={2}>{employeeData.name}</Typography.Title>
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

        {/* <Collapse
            defaultActiveKey={['1']}
        >
            <Collapse.Panel
                showArrow={false}
                header='View and Edit Personal Particulars'
                key='1'>
                <UserProfileForm
                    profileData={profileData}
                />
            </Collapse.Panel>
        </Collapse> */}

        <Button onClick={() => setModalVisibility(true)}><PlusOutlined />Apply leave for {employeeData.name}</Button>
        <Button
            style={{ marginLeft: '20px' }}
            onClick={() => setReplenishLeaveModalVisibility(true)}
        ><PlusOutlined />Manage Entitled Leaves</Button>
        {loading
            ? <Spin />
            : <EmployeeLeaveTable
                leavesDataSource={leavesDataSource}
                viewMode='HR_LEAVES'
                setLoading={setLoading}
            />
        }

    </div>
};

export default ViewEmployeePage;
