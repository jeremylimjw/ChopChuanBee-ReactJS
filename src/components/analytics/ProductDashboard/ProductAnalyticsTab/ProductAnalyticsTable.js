import React, { useEffect, useState } from 'react';
import { Table, Form, DatePicker, Button} from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { showTotal } from '../../../../utilities/table';
import { formatCurrency } from '../../../../utilities/currency';
import { sortByNumber, sortByString } from '../../../../utilities/sorters';
import debounce from 'lodash.debounce';
import moment from 'moment';

export default function ProductAnalyticsTable(props) {
    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [loading, setLoading] = useState(false);
    const [productAnalytics, setProductAnalytics] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
      setLoading(true);
      AnalyticsApiHelper.getProductAnalytics(props.oneYearAgo, props.currDate)
            .then(results => {
                setProductAnalytics(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading]);

    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        
        AnalyticsApiHelper.getProductAnalytics(start_date, end_date)
            .then(results => {
                setProductAnalytics(results);
              setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    // function resetForm() {
    //     form.resetFields();
    //     onValuesChange(null, form.getFieldsValue());
    // }  

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            width: '34%',
            sorter: (a, b) => sortByString(a.product_name, b.product_name),
        },
        {
            title: 'Quantity Sold',
            dataIndex: 'quantity_sold',
            key: 'quantity_sold',
            width: '2%',
            sorter: (a, b) => sortByNumber(a.quantity_sold, b.quantity_sold),
        },
        {
            title: 'Avg Cost of Goods Sold',
            dataIndex: 'average_cogs',
            key: 'average_cogs',
            width: '22%',
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
            width: '24%',
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
    ]

    const dateFormat = 'YYYY/MM/DD';

    return (
        <>
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title="All Products Analytics">
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name='date'>
                        <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currDate, dateFormat)]}/>
                    </Form.Item>
                    {/* <Button onClick={resetForm}>Reset</Button> */}
                </Form>
            </MyToolbar>

            <Table 
                dataSource={productAnalytics} 
                columns={columns} 
                loading={loading} 
                rowKey="id" 
                pagination={{ showTotal: showTotal }}
            />
        </MyCard>
        </>
    )
}