import React, { useEffect, useState } from 'react';
import { Table, Form, DatePicker, Input, Button } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { showTotal } from '../../../../utilities/table';
import { formatCurrency } from '../../../../utilities/currency';
import { sortByNumber, sortByString } from '../../../../utilities/sorters';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';

export default function ProductAnalyticsTable(props) {
    const { handleHttpError } = useApp();
    const dateFormat = 'YYYY/MM/DD';
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([])
    const [originalData, setOriginalData] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        setOriginalData(props.data)
        setFilteredData(props.data)
        setDateRange([props.dateRange[0], props.dateRange[1]])
        setLoading(false)
    }, [handleHttpError]);

    function onValuesChange(_, form) {
        // setLoading(true)
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        setDateRange([start_date, end_date])
        AnalyticsApiHelper.getProductAnalytics(start_date, end_date)
            .then(results => {
                setOriginalData(results);
                setFilteredData(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    const handleViewData = (product_uuid) => {
        let data = {
            dateRange,
            product_uuid
        }
        props.handleViewMode(data)
    }

    const handleSearch = (str) => {
        let results = originalData.filter((x) => x.product_name.toLowerCase().includes(str.toLowerCase()))
        setFilteredData(results)
    }

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            width: '28%',
            sorter: (a, b) => sortByString(a.product_name, b.product_name),
        },
        {
            title: 'Quantity Sold',
            dataIndex: 'quantity_sold',
            key: 'quantity_sold',
            width: '10%',
            sorter: (a, b) => sortByNumber(a.quantity_sold, b.quantity_sold),
        },
        {
            title: 'Avg Cost of Goods Sold',
            dataIndex: 'average_cogs',
            key: 'average_cogs',
            width: '20%',
            render: (average_cogs) => formatCurrency(average_cogs),
            sorter: (a, b) => sortByNumber(a.average_cogs, b.average_cogs),
        },
        {
            title: 'Avg Selling Price',
            dataIndex: 'average_selling_price',
            key: 'average_selling_price',
            width: '17%',
            render: (average_selling_price) => formatCurrency(average_selling_price),
            sorter: (a, b) => sortByNumber(a.average_selling_price, b.average_selling_price),
        },
        {
            title: 'Contribution Value',
            dataIndex: 'contribution',
            key: 'contribution',
            width: '2%',
            render: (contribution) => formatCurrency(contribution),
            sorter: (a, b) => sortByNumber(a.contribution, b.contribution),
        },
        {
            title: 'Total Contribution Value',
            dataIndex: 'total_contribution',
            key: 'total_contribution',
            width: '14%',
            render: (total_contribution) => formatCurrency(total_contribution),
            sorter: (a, b) => sortByNumber(a.total_contribution, b.total_contribution),
        },
        {
            title: 'Inventory Turnover',
            dataIndex: 'inventory_turnaround_period',
            key: 'inventory_turnaround_period',
            width: '2%',
            render: (inventory_turnaround_period) => parseFloat(inventory_turnaround_period).toFixed(2),
            sorter: (a, b) => sortByNumber(a.inventory_turnaround_period, b.inventory_turnaround_period),
        },
        {
            title: 'View Chart',
            dataIndex: 'product_uuid',
            key: 'product_uuid',
            width: '8%',
            render: (product_uuid) => <Button onClick={() => handleViewData(product_uuid)} type='link'>View</Button>
        }
    ]

    // cards only on single product

    return (
        <>
            <MyCard style={{ marginLeft: '3px', marginRight: '3px' }}>
                <MyToolbar title="All Products Analytics">
                    <Input
                        placeholder='Search Product Name'
                        suffix={<SearchOutlined className='grey' />}
                        onChange={(e) => handleSearch(e.target.value)}
                        allowClear={true}
                    />

                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name='date'>
                            <DatePicker.RangePicker defaultValue={[moment(props.dateRange[0], dateFormat), moment(props.dateRange[1], dateFormat)]} />
                        </Form.Item>
                    </Form>
                </MyToolbar>

                <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{ showTotal: showTotal }}
                />
            </MyCard>
        </>
    )
}