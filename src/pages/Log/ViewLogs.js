import { Button, Input, Select, Table, DatePicker, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { LogApiHelper } from '../../api/log';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import MyToolbar from '../../components/layout/MyToolbar';
import { getViewTag, View } from '../../enums/view';
import { useApp } from '../../providers/AppProvider';
import { parseDateTime } from '../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import moment from 'moment';

const breadcrumbs = [
  { url: '/logs', name: 'Logs' },
]

export default function ViewLogs() {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
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
            end_date = moment(form.date[0]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
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
                    <Form form={form} onValuesChange={onValuesChange} layout='inline' autoComplete='off'>
                        <Form.Item name="name">
                            <Input placeholder='Search Name' />
                        </Form.Item>
                        <Form.Item name="date">
                            <DatePicker.RangePicker />
                        </Form.Item>
                        <Form.Item name="view_id">
                            <Select style={{ width: 150 }} placeholder="Filter by View" >
                                { Object.keys(View).map(key => <Select.Option value={View[key].id}>{View[key].name}</Select.Option>) }
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                </MyToolbar>

                <Table dataSource={logs} columns={columns} loading={loading} />
                
            </MyCard>
        
        </MyLayout>
    )
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '16%',
    render: (created_at) => parseDateTime(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Name',
    dataIndex: 'employee',
    key: 'employee',
    width: '15%',
    render: (employee) => employee?.name,
    sorter: (a, b) => sortByString(a.employee?.name, b.employee?.name),
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
