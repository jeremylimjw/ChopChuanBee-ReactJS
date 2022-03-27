import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import MyCard from '../../../common/MyCard';

export default function ProductAnalyticsGraph(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleHttpError, hasWriteAccessTo } = useApp();

    useEffect(() => {
        getData(props.oneYearAgo, props.currDate);     
    }, [handleHttpError, loading]);

    //Dummy data for now, have not implemented the relevant API methods to get product analytics by product name and sort it by month in the backend yet
    const getData = async (start, end) => {
        let cogs = await AnalyticsApiHelper.getCOGS(start, end);
        cogs.map(x => { x.name = 'Quantity Sold'; x.value = parseFloat(x.value) * -1 });
        let profits = await AnalyticsApiHelper.getProfits(start, end);
        profits.map(x => { x.name = 'Average Cost of Goods Sold'; x.value = parseFloat(x.value) });
        let revenue = await AnalyticsApiHelper.getRevenue(start, end);
        revenue.map(x => { x.name = 'Average Selling Price'; x.value = parseFloat(x.value) });
        let contribution = await AnalyticsApiHelper.getRevenue(start, end);
        contribution.map(x => { x.name = 'Total Contribution Value'; x.value = parseFloat(x.value) });
        setData([...cogs, ...revenue, ...profits, ...contribution]);
        setLoading(false);
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

    return (
    <>
    <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
        <Line {...config} />
    </MyCard>
    </> 
    )
}
