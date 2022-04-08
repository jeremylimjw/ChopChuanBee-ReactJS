import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import { Column } from '@ant-design/charts';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';

export default function InventoryLevelGraph() {
    const [data, setData] = useState([]);

    useEffect(() => {
        AnalyticsApiHelper.getRankedInventory()
            .then(results => {
                setData(transformToChartData(results))
            })
    }, [setData])

    return (
        <>
            <MyCard style={{ margin:'3px' }}>
                <Typography>The Inventory Level chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>Top 10 inventories with the lowest percentage ratio of current inventory level and the minimum inventory level</span>.</Typography>
            </MyCard>
            
            <MyCard style={{ marginLeft: '3px', marginRight: '3px' }}>
                <Column {...chartConfig} data={data} />
            </MyCard>
        </>
    )
}

function transformToChartData(results) {
    const transformed = results.map(x => ({
        product: x.name,
        value: Math.round(x.ratio*100),
    }))
    return transformed;
}

const chartConfig = {
    xField: 'product',
    yField: 'value',
    xAxis: {
        title: {
            text: "Product",
            style: {
                fill: "black",
                fillOpacity: 0.5,
                stroke: "black",
            },
        },
    },
    yAxis: {
        title: {
            text: 'Stock Level (%)',
            style: {
                fill: "black",
                fillOpacity: 0.5,
                stroke: "black",
            },
        }
    },
    legend: {
        position: 'top',
    },
    meta: {
      product: {
        alias: 'Product',
      },
      value: {
        alias: 'Stock Level (%)',
      },
    },
}