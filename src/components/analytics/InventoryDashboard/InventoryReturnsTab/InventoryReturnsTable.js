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

export default function InventoryReturnsTable(props) {
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState();
    const [searchInputForm] = Form.useForm();
    const [form] = Form.useForm();

    //For Testing:
    const march2021start = moment("03-01-2021").toDate();
    const today = moment().toDate();

    useEffect(() => {
        AnalyticsApiHelper.getInventoryReturns(march2021start, today)
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

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Quantity Returned',
            dataIndex: 'quantity_returned',
            key: 'quantity_returned',
            width: '30%',
        },
        {
            title: 'Total Value',
            dataIndex: 'supplier_returned_goods_total_value',
            key: 'supplier_returned_goods_total_value',
            width: '30%',
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'link',
            width: '10%',
            render: (id) => <Link to={`./customer/sales${id}`}>View Product</Link> 
        },
    ]

    return (
        <>
        <MyToolbar>
            <Form form={form} layout='inline' autoComplete='off'>
                <Form.Item name="sales_order_id">
                    <Input placeholder='Search Product Name' suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
                <Button onClick={resetForm()}>Reset</Button>
            </Form>
        </MyToolbar>

        <Table 
            dataSource={data} 
            columns={columns} 
            loading={loading} 
            rowKey="name"
            pagination={{ showTotal }} 
        />
        </>
    )
}