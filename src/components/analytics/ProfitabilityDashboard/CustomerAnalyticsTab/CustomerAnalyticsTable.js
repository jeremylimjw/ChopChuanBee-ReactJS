import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Input } from 'antd';
import MyToolbar from '../../../common/MyToolbar';
import { showTotal } from '../../../../utilities/table';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

export default function CustomerAnalyticsTable(props) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        setData(props.data)
    }, [props.data])

    const handleSearch = (str) => {
        if (str) {
            let arr = props.data.filter((item) => {
                return item.sales_order_id.toString().includes(str.toLowerCase())
            })
            setData(arr)
        } else {
            setData(props.data)
        }
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
            title: 'Total Revenue ($)',
            dataIndex: 'total_revenue',
            key: 'total_revenue',
            width: '23%',
            render: (x) => parseFloat(x).toFixed('2')
        },
        {
            title: 'Total Cost of Goods Sold ($)',
            dataIndex: 'total_cogs',
            key: 'total_cogs',
            width: '23%',
            render: (x) => parseFloat(x).toFixed('2')
        },
        {
            title: 'Total Profits ($)',
            dataIndex: 'total_profits',
            key: 'total_profits',
            width: '23%',
            render: (x) => parseFloat(x).toFixed('2')
        },
        {
            title: 'Action',
            dataIndex: 'sales_order_id',
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