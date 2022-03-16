import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button } from 'antd';
import { Line } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import debounce from 'lodash.debounce';
import moment from 'moment';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { useApp } from '../../../../providers/AppProvider';

export default function ProfitabilityGraph(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { handleHttpError, hasWriteAccessTo } = useApp();

    

    useEffect(() => {
        setData([...revenue, ...cogs, ...profitsEarned]);
        setLoading(true);

        //Figure out why this has error
        //Add "name: cogs" to each data retrieved
        //Change "cogs" to "price" to each data
        //Change "period" to "date" to each data
        // AnalyticsApiHelper.getCOGS(props.oneYearAgo, props.currDate)
        //     .then(result => { console.log("init cogs: " + result) })
        //     .catch(handleHttpError)
        //     .catch(() => setLoading(false));

        //Figure out why this has error
        //Add "name: revenue" to each data retrieved
        //Change "revenue" to "price" to each data
        //Change "period" to "date" to each data
        // AnalyticsApiHelper.getRevenue(oneYearAgo, currDate)
        //     .then(result => { console.log(result) })
        //     .catch(handleHttpError)
        //     .catch(() => setLoading(false));

        const profits = AnalyticsApiHelper.getProfits(props.oneYearAgo, props.currDate)
            .then(result => { console.log("init profits: " + result) })
            //Add "name: profits" to each data retrieved
            //Change "profit" to "price" to each data
            //Extract and edit "month" for each data
            .catch(handleHttpError)
            .catch(() => setLoading(false));

        // setData([...profits]);

    }, [handleHttpError, setLoading]);

    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }

        //Update COGS

        //Update Revenue

        const profits = AnalyticsApiHelper.getProfits(start_date, end_date)
            .then(result => { console.log("input profits: " + result) })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    const revenue = [
        {
            name: 'Revenue',
            month: 'January 2021',
            price: 1212.24,
        },
        {
            name: 'Revenue',
            month: 'February 2021',
            price: 212.24,
        },
        {
            name: 'Revenue',
            month: 'March 2021',
            price: 512.24,
        },
        {
            name: 'Revenue',
            month: 'April 2021',
            price: 212.24,
        },
        {
            name: 'Revenue',
            month: 'May 2021',
            price: 562.24,
        },
        {
            name: 'Revenue',
            month: 'June 2021',
            price: 912.24,
        },
        {
            name: 'Revenue',
            month: 'July 2021',
            price: 1212.24,
        },
        {
            name: 'Revenue',
            month: 'August 2021',
            price: 1512.24,
        },
        {
            name: 'Revenue',
            month: 'September 2021',
            price: 1512.24,
        },
        {
            name: 'Revenue',
            month: 'October 2021',
            price: 1712.24,
        },
        {
            name: 'Revenue',
            month: 'November 2021',
            price: 1212.24,
        },
        {
            name: 'Revenue',
            month: 'December 2021',
            price: 1512.24,
        },
    ];

    const cogs = [
        {
            name: 'Cost of Goods Sold',
            month: 'January 2021',
            price: 912.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'February 2021',
            price: 612.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'March 2021',
            price: 312.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'April 2021',
            price: 212.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'May 2021',
            price: 562.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'June 2021',
            price: 912.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'July 2021',
            price: 1212.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'August 2021',
            price: 1512.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'September 2021',
            price: 1512.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'October 2021',
            price: 1712.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'November 2021',
            price: 1212.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'December 2021',
            price: 1512.24,
        },
    ];

    const profitsEarned = [
        {
            name: 'Profits',
            month: 'January 2021',
            price: 312.24,
        },
        {
            name: 'Profits',
            month: 'February 2021',
            price: 512.24,
        },
        {
            name: 'Profits',
            month: 'March 2021',
            price: 612.24,
        },
        {
            name: 'Profits',
            month: 'April 2021',
            price: 212.24,
        },
        {
            name: 'Profits',
            month: 'May 2021',
            price: 562.24,
        },
        {
            name: 'Profits',
            month: 'June 2021',
            price: 912.24,
        },
        {
            name: 'Profits',
            month: 'July 2021',
            price: 1212.24,
        },
        {
            name: 'Profits',
            month: 'August 2021',
            price: 1212.24,
        },
        {
            name: 'Profits',
            month: 'September 2021',
            price: 1412.24,
        },
        {
            name: 'Profits',
            month: 'October 2021',
            price: 1612.24,
        },
        {
            name: 'Profits',
            month: 'November 2021',
            price: 1012.24,
        },
        {
            name: 'Profits',
            month: 'December 2021',
            price: 1312.24,
        },
    ];

    const config = {
        data,
        xField: 'month',
        yField: 'price',
        seriesField: 'name',
        // xField: 'date',
        // yField: 'profit',
        // seriesField: 'date',
        xAxis: { 
            title: {
                text: "Month",
                style: {
                    fill: "black",
                    fillOpacity: 0.5,
                    stroke: "black",
                },
            },
        },
        yAxis: {
            title: {
                text: "Amount (SGD)",
                style: {
                    fill: "black",
                    fillOpacity: 0.5,
                    stroke: "black",
                },
            },
            label: {
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };

    return (
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='Profitability Trend'>
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name='date'>
                        <DatePicker.RangePicker />
                    </Form.Item>
                    <Button onClick={resetForm}>Reset</Button>
                </Form>
            </MyToolbar>
            <Line {...config} />
        </MyCard>
    );
}
