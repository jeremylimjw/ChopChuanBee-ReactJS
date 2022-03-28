import React, { useState, useEffect } from 'react';
import { Form, DatePicker } from 'antd';
import { Line } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import debounce from 'lodash.debounce';
import moment from 'moment';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { useApp } from '../../../../providers/AppProvider';

export default function ProfitabilityGraph(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const { handleHttpError } = useApp();

    useEffect(() => {
        getData(props.oneYearAgo, props.currDate);
    }, [handleHttpError, loading]);

    const getData = async (start, end) => {
        let cogs = await AnalyticsApiHelper.getCOGS(start, end);
        cogs.map(x => { 
            x.name = 'Cost of Goods Sold'; 
            x.value = x.value >= 0 ? 0 : parseFloat(x.value) * -1; 
            return x;
        });
        let profits = await AnalyticsApiHelper.getProfits(start, end);
        profits.map(x => { 
            x.name = 'Profits'; 
            x.value = x.value <= 0 ? 0 : parseFloat(x.value);
            return x;
        });
        let revenue = await AnalyticsApiHelper.getRevenue(start, end);
        revenue.map(x => { 
            x.name = 'Revenue'; 
            x.value = x.value <= 0 ? 0 : parseFloat(x.value);
            return x;
        });
        setData([...cogs, ...revenue, ...profits]);
        setLoading(false);
    }

    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }

        getData(start_date, end_date);
    }

    const config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'name',
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
        meta: {
            value: {
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            }
        }
    };

    const dateFormat = 'YYYY/MM/DD';

    return (
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='Profitability Trend'>
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name='date'>
                        <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currDate, dateFormat)]} />
                    </Form.Item>
                </Form>
            </MyToolbar>
            {loading ? "" : <Line {...config} /> }
        </MyCard>
    );
}
