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
    const [data, setData] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const handleSearch = (str) => {
        let arr = props.data.filter((item) => {
            return item.sales_order_id.toString() === str.toLowerCase()
        })
        setData(arr)
    }

    function resetForm() {
        form.resetFields();
        setData(props.data)
    }

    const columns = [
        {
            title: 'Sales Order ID',
            dataIndex: 'sales_order_id',
            key: 'sales_order_id',
            width: '23%',
        },
        {
            title: 'Total Revenue',
            dataIndex: 'total_revenue',
            key: 'total_revenue',
            width: '23%',
        },
        {
            title: 'Total Cost of Goods Sold',
            dataIndex: 'total_cogs',
            key: 'total_cogs',
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
            render: (id) => <Link to={`/customer/sales/${id}`}>View</Link>
        },
    ]

    return (
        <>
            <MyToolbar>
                <Form form={form} layout='inline' autoComplete='off'>
                    <Form.Item name="sales_order_id">
                        <Input
                            placeholder='Search Sales Order ID'
                            suffix={<SearchOutlined className='grey' />}
                            onChange={e => handleSearch(e.target.value)}
                        />
                    </Form.Item>
                    <Button onClick={() => resetForm()}>Reset</Button>
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