import { EditOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import LeaveForm from '../components/humanResourceModule/LeaveForm';
import LeaveTable from '../components/humanResourceModule/LeaveTable';

const ViewEmployeePage = (props) => {
    const location = useLocation()
    const employeeData = location.state.employeeData
    const [leavesDataSource, setLeavesDataSource] = useState([])
    const [modalVisibility, setModalVisibility] = useState(false)
    const [replenishLeaveModalVisibility, setReplenishLeaveModalVisibility] = useState(false)

    useEffect(() => {

    })

    const replenishLeave = () => {

    }

    const submitLeaveForm = () => {
        // API call to submit leave form to DB
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
                submitLeaveForm={submitLeaveForm}
            />
        </Modal>
        <Modal
            title='Replenish leave'
            visible={replenishLeaveModalVisibility}
            onOk={() => replenishLeave()}
            onCancel={() => setReplenishLeaveModalVisibility(false)}
            width={600}
        >
            <p>The total entitled leave for {employeeData.name} is 14</p>
            <p>Replenish leave?</p>
        </Modal>
        <Button onClick={() => setModalVisibility(true)}><PlusOutlined />Apply leave for {employeeData.name}</Button>
        <Button
            style={{ marginLeft: '20px' }}
            onClick={() => setReplenishLeaveModalVisibility(true)}
        ><PlusOutlined />Replenish leave entitlement days</Button>
        <LeaveTable leavesDataSource={leavesDataSource} />
    </div>
};

export default ViewEmployeePage;
