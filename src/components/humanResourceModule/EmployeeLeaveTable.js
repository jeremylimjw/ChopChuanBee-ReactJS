import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Space, Table, Tag } from 'antd';
import { leaveTypeFilter } from '../../utilities/TableFilters';
import { CheckOutlined, CloseOutlined, MoreOutlined } from '@ant-design/icons/lib/icons';
import { HRApiHelper } from '../../api/humanResource';
import moment from 'moment';

const EmployeeLeaveTable = (props) => {
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        setDataSource(sortLeaveApplicationsByStartDate(props.leavesDataSource))
    }, [props.leavesDataSource])

    const renderLeaveTypes = (type) => {
        const leaveTypes = ['Annual', 'Compassionate', 'Maternity/Paternity', 'Sick', 'Childcare']
        return leaveTypes[type]
    }

    const processTags = (status) => {
        switch (status) {
            case 1:
                return (<Tag color='orange'>Pending</Tag>)
            case 2:
                return (<Tag color='green'><CheckOutlined />Accepted</Tag>)
            case 3:
                return (<Tag color='volcano'><CloseOutlined />Rejected</Tag>)
            case 4:
                return (<Tag color='purple'>Cancelled</Tag>)
            default:
                return (<Tag color='geekblue'>{status}</Tag>)
        }
    }

    const renderActionButtons = (record) => {
        switch (record.leave_status_id) {
            case 1:
                return <Space size="middle">
                    <Button onClick={() => updateLeaveStatus(record, true)}>Accept</Button>
                    <Button onClick={() => updateLeaveStatus(record, false)}>Reject</Button>
                </Space>
            default:
                return <div />
        }
    }

    const sortLeaveApplicationsByStartDate = (data) => {
        let sortedArr = data.sort((a, b) => moment(a.start_date) - moment(b.start_date))
        return sortedArr
    }

    // Array list of objects to be placed inside table
    const updateLeaveStatus = async (record, status) => {
        let updatedDataSrc = [...dataSource]
        switch (status) {
            case true:
                // Accept Leave  
                await HRApiHelper.updateLeaveApplicationStatus({
                    id: record.id,
                    leave_status_id: 2
                })
                updatedDataSrc[record] = {
                    ...record,
                    leave_status_id: 2,
                }
                setDataSource(updatedDataSrc)
                message.success('Leave Approved!')
                break
            case false:
                // Reject Leave
                await HRApiHelper.updateLeaveApplicationStatus({
                    id: record.id,
                    leave_status_id: 3
                })
                updatedDataSrc[record] = {
                    ...record,
                    leave_status_id: 3,
                }
                setDataSource(updatedDataSrc)
                message.success('Leave Rejected!')
                break
            default:
                break
        }
    }

    const tableColumns = [
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            render: (value) => moment(value).format('ll'),
            sorter: (a, b) => moment(a.start_date) - moment(b.start_date)
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            render: (value) => moment(value).format('ll'),
            sorter: (a, b) => moment(a.end_date) - moment(b.end_date)
        },
        {
            title: 'Type',
            dataIndex: 'leave_account',
            filters: leaveTypeFilter,
            render: (value) => value.leave_type.name,
            onFilter: (value, record) => record.leaveType === value
        },
        {
            title: 'Requested Days',
            dataIndex: 'num_days'
        },
        {
            title: 'Status',
            dataIndex: 'leave_status_id',
            render: (value) => processTags(value)
        },
        {
            title: 'Action',
            dataIndex: 'leaveId',
            render: (value, record) => (
                renderActionButtons(record)
            ),
        }
    ]
    return <div>
        <Table dataSource={dataSource} columns={tableColumns} />
    </div>;
};

export default EmployeeLeaveTable;
