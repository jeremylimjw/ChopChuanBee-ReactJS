import { Button, Form, Input, message, Popconfirm, Select, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';
import { useApp } from '../../../providers/AppProvider';
import { getLeaveStatusTag, LeaveStatus } from '../../../enums/LeaveStatus';
import { HRApiHelper } from '../../../api/HRApiHelper';
import { View } from '../../../enums/View';
import { showTotal } from '../../../utilities/table';
import { parseDate, parseDateTime } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { getLeaveTypeTag, LeaveType } from '../../../enums/LeaveType';
import NewLeaveFormModal from './NewLeaveFormModal';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import MyLayout from '../../common/MyLayout';

const breadcrumbs = [
    { url: '/humanResource/leaveApplications', name: 'Human Resource' },
    { url: '/humanResource/leaveApplications', name: 'Leave Applications' }
]

export default function ManageLeavesPage() {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [leaveApplications, setLeaveApplications] = useState([]);
    const [form] = Form.useForm();

    columns[8].render = (record) => (
        <>
            <Popconfirm title="Confirm approve?" onConfirm={() => updateLeaveStatus(record, LeaveStatus.APPROVED)} disabled={loading || record.leave_status_id !== LeaveStatus.PENDING.id}>
                <Button type="link" style={{ paddingLeft: 0 }} disabled={record.leave_status_id !== LeaveStatus.PENDING.id}>Accept</Button>
            </Popconfirm>
            <Popconfirm title="Confirm reject?" onConfirm={() => updateLeaveStatus(record, LeaveStatus.REJECTED)} disabled={loading || record.leave_status_id !== LeaveStatus.PENDING.id}>
                <Button type="link" style={{ paddingLeft: 0 }} disabled={record.leave_status_id !== LeaveStatus.PENDING.id}>Reject</Button>
            </Popconfirm>
        </>
    )

    const getLeaveApplications = useCallback((query) => {
        HRApiHelper.getLeaveApplications(query)
            .then(results => {
                setLeaveApplications(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading, setLeaveApplications])
    

    useEffect(() => {
        getLeaveApplications()
    }, [getLeaveApplications])

    function onValuesChange(_, form) {
        getLeaveApplications(form);
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    function updateLeaveStatus(record, leaveStatus) {
        setLoading(true);
        HRApiHelper.updateLeaveApplication({...record, leave_status_id: leaveStatus.id })
            .then(() => {
                setLoading(false);
                const newItems = [...leaveApplications];
                const idx = newItems.findIndex(x => x.id === record.id);
                if (idx > -1) {
                    newItems[idx] = {...newItems[idx], leave_status_id: leaveStatus.id }
                }
                setLeaveApplications(newItems);
                message.success(`Application successfully ${leaveStatus.name.toLowerCase()}!`)
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function myCallback(newApplication) {
        setLeaveApplications([newApplication, ...leaveApplications])
        setIsModalVisible(false)
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Leave Applications">
  
          <MyCard>
  
            <MyToolbar title="Leave Applications">
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name="employee_name">
                        <Input placeholder='Search Name' />
                    </Form.Item>
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
                { hasWriteAccessTo(View.HR.name) && 
                  <Button type='primary' onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>New</Button>
                }
            </MyToolbar>
  
            <Table 
                dataSource={leaveApplications} 
                columns={columns}
                loading={loading} 
                rowKey="id" 
                pagination={{ showTotal: showTotal }}
            />
                
            </MyCard>
            
            <NewLeaveFormModal 
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                myCallback={myCallback}
            />
        </MyLayout>
    )
}

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        width: 180,
        ellipsis: true,
        render: (created_at) => parseDateTime(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Name',
        dataIndex: 'leave_account',
        key: 'leave_account',
        width: '14%',
        ellipsis: true,
        render: (leave_account) => <Link to={`../employees/${leave_account.employee.id}`}>{leave_account.employee.name}</Link>,
        sorter: (a, b) => sortByString(a.leave_account.employee.name, b.leave_account.employee.name),
    },
    {
        title: 'Type',
        dataIndex: 'leave_account',
        key: 'leave_account',
        align: 'center',
        width: 120,
        ellipsis: true,
        render: (leave_account) => getLeaveTypeTag(leave_account.leave_type_id),
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
        width: 120,
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
        width: 120,
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
