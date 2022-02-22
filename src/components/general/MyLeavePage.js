import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, message, Popconfirm, Select, Space, Table } from 'antd';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { HRApiHelper } from '../../api/HRApiHelper';
import { getLeaveStatusTag, LeaveStatus } from '../../enums/LeaveStatus';
import { getLeaveType, getLeaveTypeTag, LeaveType } from '../../enums/LeaveType';
import { useApp } from '../../providers/AppProvider';
import { parseDate, parseDateTime } from '../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { showTotal } from '../../utilities/table';
import MyCard from '../common/MyCard';
import MyLayout from '../common/MyLayout/MyLayout';
import MyToolbar from '../common/MyToolbar';
import NewLeaveFormModal from '../humanResource/ManageLeaves/NewLeaveFormModal';

const breadcrumbs = [{ url: '/myLeaves', name: 'Leaves' }];

export default function MyLeavePage() {

    const { user, handleHttpError } = useApp();

    const [leaveAccounts, setLeaveAccounts] = useState([]);
  
    useEffect(() => {
        if (user) {
            HRApiHelper.getLeaveAccountsById(user.id)
                .then((results) => {
                    setLeaveAccounts(results)
                })
                .catch(handleHttpError);
        }
    }, [user, handleHttpError, setLeaveAccounts]);

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle='My Leaves'>
        { true &&
            <>
                <Space direction='horizontal' wrap>
                    { leaveAccounts.filter(x => x.entitled_days > 0).map((x, idx) => (
                        <MyCard key={idx} title={`${getLeaveType(x.leave_type_id).name} Leaves`}>
                            <span className='grey'>{`${x.balance} out of ${x.entitled_days} Days Remaining`}</span>
                        </MyCard>
                    ))}
                </Space>

                <MyCard>
                    <MyTable />
                </MyCard>
            </>
        }
        </MyLayout>
    )
}

function MyTable() {

    const { user, handleHttpError } = useApp();

    const [loading, setLoading] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [leaveApplications, setLeaveApplications] = useState([]);

    tableColumns[7].render = (record) => (
        <>
        <Popconfirm title="Confirm cancel?" onConfirm={() => updateLeaveStatus(record, LeaveStatus.CANCELLED)} disabled={loading || record.leave_status_id !== LeaveStatus.PENDING.id}>
            <Button type="link" style={{ paddingLeft: 0 }} disabled={loading || record.leave_status_id !== LeaveStatus.PENDING.id}>Cancel</Button>
        </Popconfirm>
        </>
    )

    useEffect(() => {
        if (user) {
            setLoading(true);
            HRApiHelper.getLeaveApplications({ employee_id: user.id })
                .then(results => {
                    setLeaveApplications(results);
                    setLoading(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        }
    }, [user, handleHttpError, setLeaveApplications]);

    function onValuesChange(_, form) {
        setLoading(true);
        HRApiHelper.getLeaveApplications({ employee_id: user.id, ...form })
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
                
                <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>New</Button>
            </MyToolbar>
            
            <Table loading={loading}
                columns={tableColumns} 
                dataSource={leaveApplications}
                pagination={{ showTotal: showTotal }}
                rowKey="id"
            />

            <NewLeaveFormModal 
                selectedEmployee={user}
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
        width: 100,
        ellipsis: true,
    },
]
