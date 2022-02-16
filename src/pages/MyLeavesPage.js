import { PlusOutlined } from '@ant-design/icons/lib/icons'
import { Button, Card, List, message, Space, Spin, Typography } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { HRApiHelper } from '../api/humanResource'
import EmployeeLeaveTable from '../components/humanResourceModule/EmployeeLeaveTable'
import LeaveForm from '../components/humanResourceModule/LeaveForm'
import { useApp } from '../providers/AppProvider'

const MyLeavesPage = () => {
    const [leavesDataSource, setLeavesDataSource] = useState([])
    const [leaveAccounts, setLeaveAccounts] = useState([])
    const [leaveBalance, setLeaveBalance] = useState([])
    const [modalVisibility, setModalVisibility] = useState(false)
    const [loading, setLoading] = useState(true)
    const { user, handleHttpError } = useApp()
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
        setLeavesDataSource(leaveData)
        let leaveAcct = await HRApiHelper.getEmployeeLeaveAccounts(user.id)
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

    return (
        <div>
            <Typography.Title>My Leaves</Typography.Title>
            <Button
                onClick={() => setModalVisibility(true)}>
                <PlusOutlined />Apply for leave
            </Button>
            <Modal
                title='Create Leave'
                visible={modalVisibility}
                onCancel={() => setModalVisibility(false)}
                footer={null}
                width={600}
            >
                <LeaveForm
                    submitLeaveApplicationForm={submitLeaveApplicationForm}
                    selectedEmployee={user}
                    leaveAccounts={leaveAccounts}
                />
            </Modal>



            {loading
                ? <Spin />
                :
                <React.Fragment>
                    <Space>
                        <Card
                            title='Leave Balance'
                            style={{ margin: '24px', width: 400 }}
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
                        </Card>
                        <Card
                            title='Entitled Days'
                            style={{ margin: '24px', width: 400 }}
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
                        </Card>
                    </Space>

                    <EmployeeLeaveTable
                        leavesDataSource={leavesDataSource}
                        viewMode='MY_LEAVES'
                        setLoading={setLoading}
                    />
                </React.Fragment>
            }
        </div>
    )
}

export default MyLeavesPage

