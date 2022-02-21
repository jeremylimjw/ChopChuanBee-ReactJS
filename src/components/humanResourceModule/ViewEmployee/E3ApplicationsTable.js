import { Button, Form, message, Select, Space, Table } from 'antd'
import debounce from 'lodash.debounce'
import React, { useEffect, useState } from 'react'
import { getLeaveAccountTag, LeaveType } from '../../../enums/LeaveType'
import { getLeaveStatusTag, LeaveStatus } from '../../../enums/LeaveStatus'
import { useApp } from '../../../providers/AppProvider'
import MyToolbar from '../../layout/MyToolbar'
import { PlusOutlined } from '@ant-design/icons'
import { parseDate, parseDateTime } from '../../../utilities/datetime'
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters'
import { View } from '../../../enums/View'
import { HRApiHelper } from '../../../api/humanResource'
import NewLeaveFormModal from '../NewLeaveFormModal'
import { showTotal } from '../../../utilities/table'

export default function E3ApplicationsTable({ employee, leaveAccounts, setLeaveAccounts }) {
    
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [loading, setLoading] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [leaveApplications, setLeaveApplications] = useState([]);
    const [form] = Form.useForm();

    tableColumns[7].render = (record, action) => (
        <Space size="middle">
            <a onClick={() => updateLeaveStatus(record, LeaveStatus.APPROVED)}>Accept</a>
            <a onClick={() => updateLeaveStatus(record, LeaveStatus.REJECTED)}>Reject</a>
        </Space>
    )

    useEffect(() => {
        if (employee) {
            setLoading(true);
            HRApiHelper.getLeaveApplications({ employee_id: employee.id })
                .then(results => {
                    console.log(results)
                    setLeaveApplications(results);
                    setLoading(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        }
    }, [handleHttpError, setLoading, employee])

    function onValuesChange(_, form) {
        setLoading(true);
        HRApiHelper.getLeaveApplications({ employee_id: employee.id, ...form })
            .then(results => {
                setLeaveApplications(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    function updateLeaveStatus(record, leaveStatus) {
        setLoading(true);
        HRApiHelper.updateLeaveApplicationStatus({...record, leave_status_id: leaveStatus.id })
            .then(() => {
                setLoading(false);
                const newItems = [...leaveApplications];
                const idx = newItems.findIndex(x => x.id === record.id);
                if (idx > -1) {
                    newItems[idx] = {...newItems[idx], leave_status_id: leaveStatus.id }
                }
                setLeaveApplications(newItems);
                message.success(`Application successfully ${leaveStatus.name}!`)
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
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

            <Table loading={loading}
                columns={tableColumns} 
                dataSource={leaveApplications}
                pagination={{ showTotal }}
                rowKey="id"
            />

            <NewLeaveFormModal 
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
        width: 180,
        ellipsis: true,
        render: (created_at) => parseDateTime(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Type',
        dataIndex: 'leave_account',
        key: 'leave_account',
        align: 'center',
        width: 150,
        ellipsis: true,
        render: (leave_account) => getLeaveAccountTag(leave_account.leave_type_id),
        sorter: (a, b) => sortByNumber(a.leave_account.leave_type_id, b.leave_account.leave_type_id),
    },
    {
        title: 'Start Date',
        dataIndex: 'start_date',
        ellipsis: true,
        width: 150,
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
        title: 'Days',
        dataIndex: 'num_days',
        width: 150,
        align: 'center',
        sorter: (a, b) => sortByNumber(a.num_days, b.num_days),
    },
    {
        title: 'Remarks',
        dataIndex: 'remarks',
        ellipsis: true,
        render: (remarks) => remarks || '-',
        sorter: (a, b) => sortByString(a.remarks, b.remarks),
    },
    {
        title: 'Status',
        dataIndex: 'leave_status_id',
        key: 'leave_status_id',
        width: 150,
        align: 'center',
        ellipsis: true,
        render: (leave_status_id) => getLeaveStatusTag(leave_status_id),
        sorter: (a, b) => sortByNumber(a.leave_status_id, b.leave_status_id),
    },
    { 
        title: "Action", 
        key: "link", 
        width: 150,
        ellipsis: true,
    },
]
