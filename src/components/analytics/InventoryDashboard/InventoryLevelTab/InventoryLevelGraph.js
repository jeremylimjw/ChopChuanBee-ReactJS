import React, { useState, useEffect } from 'react';
import { Table, Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import { Column } from '@ant-design/charts';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { showTotal } from "../../../../utilities/table";
import { Link } from 'react-router-dom';
import { sortByNumber, sortByString } from '../../../../utilities/sorters';

export default function InventoryLevelGraph() {
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        AnalyticsApiHelper.getRankedInventory()
            .then(results => {
                setData(transformToChartData(results))
            })
        AnalyticsApiHelper.getAllInventoryLevel()
            .then(results => {
                setTableData(results)
            })
    }, [setData, setTableData])

    return (
        <>
            <MyCard style={{ margin:'3px' }}>
                <Typography>The Inventory Level chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>Top 10 inventories with the lowest percentage ratio of current inventory level and the minimum inventory level</span>.</Typography>
            </MyCard>
            
            <MyCard style={{ marginLeft: '3px', marginRight: '3px' }}>
                <Tabs defaultActiveKey='1' type="card">
                    <Tabs.TabPane tab='Graph' key='1'>
                        <Column {...chartConfig} data={data} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='Table' key='2'>
                        <Table
                            dataSource={tableData}
                            columns={columns}
                            rowKey={() => Math.random()}
                            pagination={{ showTotal }}
                        />
                    </Tabs.TabPane>
                </Tabs>
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
    color: '#ff4473',
    xAxis: {
        title: {
            text: "Product",
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

const columns = [
    {
        title: "Product",
        key: "product",
        width: "40%",
        render: (_, record) => <Link to={`/inventory/products/${record.id}`}>{record.name}</Link>,
        sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
        title: "Minimum Inventory Level",
        dataIndex: "min",
        key: "min",
        width: "25%",
        align: 'center',
        sorter: (a, b) => sortByNumber(a.min, b.min),
    },
    {
        title: "Current Inventory",
        dataIndex: "current_inventory_level",
        key: "current_inventory_level",
        width: "25%",
        align: 'center',
        sorter: (a, b) => sortByNumber(a.current_inventory_level, b.current_inventory_level),
    },
    {
        title: "Ratio",
        dataIndex: "ratio",
        key: "ratio",
        width: "10%",
        align: 'center',
        render: (ratio) => Math.ceil(ratio*100)+"%",
        sorter: (a, b) => sortByNumber(a.ratio, b.ratio),
    },
];
