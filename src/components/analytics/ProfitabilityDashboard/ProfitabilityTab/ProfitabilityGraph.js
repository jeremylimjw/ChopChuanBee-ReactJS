import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import { parseDate } from '../../../../utilities/datetime';
import MyToolbar from '../../../common/MyToolbar';
import MyCard from '../../../common/MyCard';

export default function ProfitabilityGraph(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();

    const profitability = [];

    useEffect(() => {
        getData();
    }, [handleHttpError, loading, props.userInput]);

    const getData = async () => {
        await AnalyticsApiHelper.getRevenue(props.startDate, props.endDate)
        .then((result) => {
            result.map(x => {
                x.name = 'Revenue'; 
                x.value = x.value <= 0 ? 0 : parseFloat(x.value); 
                profitability.push(x);
                return x;
            });
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getCOGS(props.startDate, props.endDate)
        .then((result) => {
            result.map(x => {
                x.name = 'Cost of Goods Sold'; 
                x.value = x.value <= 0 ? 0 : parseFloat(x.value); 
                profitability.push(x);
                return x;
            });
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getProfits(props.startDate, props.endDate)
        .then((result) => {
            result.map(x => {
                x.name = 'Profits'; 
                x.value = x.value <= 0 ? 0 : parseFloat(x.value); 
                profitability.push(x);
                return x;
            });
        })
        .catch(handleHttpError);
        setData(profitability);
        setLoading(false);
        props.setUserInput(false);
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
            label: {
                autoHide: true,
                autoRotate: true,
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

    return <>
    {data.length === 0 ? "" :             
        <>
            <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title={'Profitability Trend From ' + parseDate(props.startDate) + ' to ' + parseDate(props.endDate)}></MyToolbar>
            <Line {...config} />
            </MyCard>
        </> 
    }
    </>;
}
