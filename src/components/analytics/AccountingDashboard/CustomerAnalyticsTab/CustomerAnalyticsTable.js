import React, { useEffect, useState } from 'react';
import { useApp } from '../../../../providers/AppProvider';
import { Table, Form, Button, Input, DatePicker, Space } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { showTotal } from '../../../../utilities/table';
import moment from 'moment';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

export default function CustomerAnalyticsTable(props) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [searchInputForm] = Form.useForm();
    const [form] = Form.useForm();

    //For Testing:
    const march2021start = moment("03-01-2021").toDate();
    const today = moment().toDate();

    useEffect(() => {
        AnalyticsApiHelper.getCustomerProfits(march2021start, today)
            .then((results) => { setData(results) })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }, [handleHttpError, setLoading])

    function onValuesChange(_, form) {
        //Search within the table based on the columns
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    // const handleFinish = (values) => {
    //     let customer_name = values.name;
    //     let start_date, end_date;
    //     if (values.date && values.date[0] && values.date[1]) {
    //         start_date = moment(values.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    //         end_date = moment(values.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
    //     }

    //     AnalyticsApiHelper.getCustomerProfits(start_date, end_date)
    //         .then((results) => { setData(results) })
    //         .catch(handleHttpError)
    //         .catch(() => setLoading(false));
    // }

    const columns = [
        {
            title: 'Sales Order ID',
            dataIndex: 'sales_order_id',
            key: 'sales_order_id',
            width: '23%',
        },
        {
            title: 'Total Cost of Goods Sold',
            dataIndex: 'total_cogs',
            key: 'total_cogs',
            width: '23%',
        },
        {
            title: 'Total Revenue',
            dataIndex: 'total_revenue',
            key: 'total_revenue',
            width: '23%',
        },
        {
            title: 'Total Profits',
            dataIndex: 'total_profits',
            key: 'total_profits',
            width: '23%',
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'link',
            width: '8%',
            render: (id) => <Link to={`./customer/sales${id}`}>View</Link> 
        },
    ]

    return (
        <>
            <MyToolbar>
                <Form form={form} layout='inline' autoComplete='off'>
                    <Form.Item name="sales_order_id">
                        <Input placeholder='Search Sales Order ID' suffix={<SearchOutlined className='grey' />} />
                    </Form.Item>
                    <Button onClick={resetForm()}>Reset</Button>
                </Form>
            </MyToolbar>

            <Table 
                    dataSource={data} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="sales_order_id"
                    pagination={{ showTotal }} 
                />
        </>
    )
}