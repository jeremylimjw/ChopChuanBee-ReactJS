import { Button, Form, Modal, Select, Table } from 'antd'
import debounce from 'lodash.debounce'
import React, { useEffect, useState } from 'react'
import { getLeaveAccountTag, LeaveType } from '../../../enums/LeaveType'
import { getLeaveStatusTag, LeaveStatus } from '../../../enums/LeaveStatus'
import { useApp } from '../../../providers/AppProvider'
import MyToolbar from '../../layout/MyToolbar'
import { PlusOutlined } from '@ant-design/icons'
import { parseDate } from '../../../utilities/datetime'
import { sortByDate, sortByNumber } from '../../../utilities/sorters'
import { Link } from 'react-router-dom'
import { View } from '../../../enums/View'
import { HRApiHelper } from '../../../api/humanResource'
import NewLeaveForm from './NewLeaveForm'

export default function E3ApplicationsTable({ employee, leaveAccounts, setLeaveAccounts }) {
    
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [loading, setLoading] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [leaveApplications, setLeaveApplications] = useState([]);
    const [form] = Form.useForm();

    tableColumns[6].render = function(record, action) {
        return (
            <>
                {/* <Link onClick={() => updateLeaveStatus(record, 'ACCEPT')}>Accept</Link> MUST HAVE 'to' field
                <Link onClick={() => updateLeaveStatus(record, 'REJECT')}>Reject</Link> */}
            </>
        )
    }

    // TODO: backend order by created_at
    useEffect(() => {
        if (employee) {
            setLoading(true);
            HRApiHelper.getLeaveApplicationByEmployeeId(employee.id)
                .then(results => {
                    setLeaveApplications(results);
                    setLoading(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        }
    }, [handleHttpError, setLoading, employee])

    // TODO: backend dynamic query
    function onValuesChange(_, form) {
        // EmployeeApiHelper.get(form)
        //     .then(results => {
        //         setEmployees(results);
        //         setLoading(false);
        //     })
        //     .catch(handleHttpError)
        //     .catch(() => setLoading(false))
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    function createLeaveApplication(leaveApplication) {

    }

    function updateLeaveStatus(record, action) {
        
    }

    function myCallback(newApplication) {
        setLeaveApplications([newApplication, ...leaveApplications])
        setIsModalVisible(false)
    }

    return (
        <>
            <MyToolbar title='Leave Applications'>
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name="leave_type_id">
                        <Select style={{ width: 180 }} placeholder="Filter by Type">
                            <Select.Option value={null}>All</Select.Option>
                            { Object.keys(LeaveType).map((key, idx) => 
                                <Select.Option key={idx} value={LeaveType[key].id}>{LeaveType[key].name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item name="leave_status_id">
                        <Select style={{ width: 180 }} placeholder="Filter by Status">
                            <Select.Option value={null}>All</Select.Option>
                            { Object.keys(LeaveStatus).map((key, idx) => 
                                <Select.Option key={idx} value={LeaveStatus[key].id}>{LeaveStatus[key].name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Button onClick={resetForm}>Reset</Button>
                </Form>
                
                <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} disabled={!hasWriteAccessTo(View.HR.name)}>New</Button>
            </MyToolbar>

            <Table 
                columns={tableColumns} 
                dataSource={leaveApplications}
                rowKey={()=>Math.random()}
            />

            <NewLeaveForm 
                selectedEmployee={employee}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                myCallback={myCallback}
            />
        </>
    )
}

const tableColumns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        width: 150,
        ellipsis: true,
        render: (created_at) => parseDate(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Start Date',
        dataIndex: 'start_date',
        width: 150,
        ellipsis: true,
        render: (start_date) => parseDate(start_date),
        sorter: (a, b) => sortByDate(a.start_date, b.start_date),
    },
    {
        title: 'End Date',
        dataIndex: 'end_date',
        width: 150,
        ellipsis: true,
        render: (end_date) => parseDate(end_date),
        sorter: (a, b) => sortByDate(a.end_date, b.end_date),
    },
    {
        title: 'Type',
        dataIndex: 'leave_account_id',
        key: 'leave_account_id',
        width: 100,
        align: 'center',
        ellipsis: true,
        render: (leave_account_id) => getLeaveAccountTag(leave_account_id),
        sorter: (a, b) => sortByNumber(a.leave_account_id, b.leave_account_id),
    },
    {
        title: 'Days',
        dataIndex: 'num_days',
        width: 100,
    },
    {
        title: 'Status',
        dataIndex: 'leave_status_id',
        key: 'leave_status_id',
        width: 100,
        align: 'center',
        ellipsis: true,
        render: (leave_status_id) => getLeaveStatusTag(leave_status_id),
        sorter: (a, b) => sortByNumber(a.leave_status_id, b.leave_status_id),
    },
    { 
        dataIndex: "id", 
        title: "Action", 
        key: "link", 
        width: 200,
        ellipsis: true,
    },
]
