import { Button, Table, Input, Select, Form, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { useApp } from "../../providers/AppProvider";
import MyLayout from "../common/MyLayout";
import MyCard from "../common/MyCard";
import { showTotal } from "../../utilities/table";
import { parseDate, parseDateTimeSeconds } from "../../utilities/datetime";
import { sortByDate, sortByNumber, sortByString } from "../../utilities/sorters";
import MyToolbar from "../common/MyToolbar";
import { View } from "../../enums/View";
import { DeliveryApiHelper } from "../../api/DeliveryApiHelper";
import moment from "moment";

const breadcrumbs = [
    { url: "/dispatch/itinerarys", name: "Dispatch" },
    { url: "/dispatch/itinerarys", name: "Itineraries" },
];

export default function ManageItinerarysPage() {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState();
    const [itinerarys, setItinerarys] = useState([]);

    useEffect(() => {
        setLoading(true);
        DeliveryApiHelper.getItinerarys()
        .then(results => {
            setItinerarys(results);
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
        DeliveryApiHelper.getItinerarys({...form, start_date, end_date })
            .then(results => {
                setItinerarys(results);
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
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Itineraries">
            <MyCard>
                <MyToolbar title="Itineraries">
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="employee_name">
                            <Input placeholder='Search Driver' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="date">
                            <DatePicker.RangePicker />
                        </Form.Item>
                        <Form.Item name="session">
                            <Select style={{ width: 160 }} placeholder="Filter by Session">
                                <Select.Option value={null}>All</Select.Option>
                                <Select.Option key="AM" value="AM">AM</Select.Option>
                                <Select.Option key="PM" value="PM">PM</Select.Option>
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    { hasWriteAccessTo(View.DISPATCH.name) && 
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('./new')}>New</Button>
                    }
                </MyToolbar>

                <Table 
                    dataSource={itinerarys} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="id" 
                    pagination={{ showTotal: showTotal }}
                />
            </MyCard>

        </MyLayout>
    );
}

const columns = [
    {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        ellipsis: true,
        render: (created_at) => parseDate(created_at),
        sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
        title: 'Assigned Driver',
        dataIndex: 'employee',
        key: 'employee',
        ellipsis: true,
        render: (employee) => employee?.name ? <Link to={`/humanResource/employees/${employee.id}`}>{employee.name}</Link> : '-',
        sorter: (a, b) => sortByDate(a.employee?.name || '-', b.employee?.name || '-'),
    },
    {
        title: 'Start Date',
        dataIndex: 'start_time',
        key: 'start_time',
        width: '15%',
        ellipsis: true,
        render: (start_time) => parseDateTimeSeconds(start_time),
        sorter: (a, b) => sortByDate(a.start_time, b.start_time),
    },
    {
        title: 'Session',
        dataIndex: 'session',
        key: 'session',
        width: '15%',
        ellipsis: true,
        sorter: (a, b) => sortByString(a.session, b.session),
    },
    {
        title: 'No of Orders',
        dataIndex: 'order_length',
        key: 'order_length',
        width: '15%',
        ellipsis: true,
        render: (_, record) => record.delivery_orders.length,
        sorter: (a, b) => sortByNumber(a.id, b.id),
    },
    { 
        title: "Action", 
        dataIndex: "id", 
        key: "link", 
        width: 100,
        ellipsis: true,
        render: (id) => <Link to={`./${id}`}>View</Link> 
    }
];
