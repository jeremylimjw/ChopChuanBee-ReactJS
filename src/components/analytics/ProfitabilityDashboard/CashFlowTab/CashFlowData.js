import React, { useState, useEffect } from 'react';
import { Form, Button, DatePicker, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import moment from 'moment';
import { REQUIRED } from "../../../../utilities/form";
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { Column } from '@ant-design/charts';
import MyToolbar from '../../../common/MyToolbar';
import { parseDate } from '../../../../utilities/datetime';

export default function CashFlowData({ oneYearAgo, currTime }) {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState([oneYearAgo, currTime]);

    useEffect(() => {
        AnalyticsApiHelper.getCashFlow(oneYearAgo, currTime)
            .then(results => {
                setData(transformToChartData(results))
            })
    }, [setData])

    function handleFinish(values) {
        let start_date, end_date;
        if (values.date && values.date[0] && values.date[1]) {
            start_date = moment(values.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            end_date = moment(values.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

            setSelectedDateRange([start_date, end_date])

            AnalyticsApiHelper.getCashFlow(start_date, end_date)
                .then(results => {
                    setData(transformToChartData(results))
                })
        }
    };

    return (
        <>
            <MyCard style={{margin: '3px'}}>

                <Typography>The Cash Flow chart displays the monthly trends for <span style={{color:"#1890ff", fontWeight:"bold"}}>Cash Inflow, Cash Outflow and Net Cash Flow</span> during the period below. All the figures account for Customer Returns and Supplier Returns. </Typography>
                
                <Form form={form} layout='inline' onFinish={handleFinish} style={{marginTop: "20px"}} initialValues={{ date: [oneYearAgo, currTime]}}>
                    <Form.Item name="date" rules={[REQUIRED]}>
                        <DatePicker.RangePicker />
                    </Form.Item>
                    
                    <Form.Item name="button" style={{ marginLeft: '20px' }}>
                        <Button type="primary" htmlType="submit"> Analyse </Button>
                    </Form.Item>
                </Form>
            </MyCard>
            
            <MyCard style={{ marginLeft: '3px', marginRight: '3px' }}>
                <MyToolbar title={'Cash Flow From ' + parseDate(selectedDateRange[0]) + ' to ' + parseDate(selectedDateRange[1])} />
                <Column {...chartConfig} data={data} />
            </MyCard>
            
        </>
    )
}

function transformToChartData(results) {
    const transformed = [];
    for (let row of results) {
        const date = moment(row.period, 'YYYY-MM');
        transformed.push({
            name: 'Net Cash Flow',
            value: +row.net_cash_flow,
            date: date.format('MMMM YY')
        })
        transformed.push({
            name: 'Cash Inflow',
            value: +row.cash_inflow,
            date: date.format('MMMM YY')
        })
        transformed.push({
            name: 'Cash Outflow',
            value: +row.cash_outflow,
            date: date.format('MMMM YY')
        })
    }
    return transformed;
}

const chartConfig = {
    /**
     * Default colors:
     * Blue: #6395f9
     * Green: #62daab
     * Dark Blue: #657798
     */
    color: ['#6395f9', '#657798', '#ff4473'],
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
    xAxis: {
        title: {
            text: "Date",
            style: {
                fill: "black",
                fillOpacity: 0.5,
                stroke: "black",
            },
        },
    },
    yAxis: {
        title: {
            text: 'Amount (SGD)',
            style: {
                fill: "black",
                fillOpacity: 0.5,
                stroke: "black",
            },
            label: {
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
        }
    },
    legend: {
        position: 'top',
    },
    tooltip: {
        showTitle: false
    }
}