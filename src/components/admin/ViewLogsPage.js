import { Button, Input, Select, Table, DatePicker, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';
import { useApp } from '../../providers/AppProvider';
import { LogApiHelper } from '../../api/LogApiHelper';
import MyLayout from '../common/MyLayout';
import MyCard from '../common/MyCard';
import MyToolbar from '../common/MyToolbar';
import { getViewTag, View } from '../../enums/View';
import { parseDateTimeSeconds } from '../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { showTotal } from '../../utilities/table';

const breadcrumbs = [
    { url: '/admin/logs', name: 'Admin' },
    { url: '/admin/logs', name: 'Logs' },
]

export default function ViewLogsPage() {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        LogApiHelper.get()
            .then(results => {
                setLogs(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])


    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        LogApiHelper.get(form.name, start_date, end_date, form.view_id)
            .then(results => {
                setLogs(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="View Logs">

            <MyCard>

                <MyToolbar title="Logs">
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="name">
                            <Input placeholder='Search Name' suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="date">
                            <DatePicker.RangePicker />
                        </Form.Item>
                        <Form.Item name="view_id">
                            <Select style={{ width: 150 }} placeholder="Filter by View" >
                                { Object.keys(View).map((key, index) => <Select.Option key={index} value={View[key].id}>{View[key].name}</Select.Option>) }
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                </MyToolbar>

                <Table 
                    dataSource={logs} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="id"
                    pagination={{ showTotal }} 
                />
                
            </MyCard>
        
        </MyLayout>
    )
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 200,
    render: (created_at) => parseDateTimeSeconds(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Name',
    dataIndex: 'employee',
    key: 'employee',
    width: '15%',
    render: (employee) => employee?.name,
    sorter: (a, b) => sortByString(a.employee.name, b.employee.name),
  },
  {
    title: 'Event',
    dataIndex: 'text',
    key: 'text',
    sorter: (a, b) => sortByString(a.text, b.text),
  },
  {
    title: 'View',
    dataIndex: 'view_id',
    key: 'view_id',
    align: 'center',
    width: 120,
    render: (view_id) => getViewTag(view_id),
    sorter: (a, b) => sortByNumber(a.view_id, b.view_id),
  },
]
