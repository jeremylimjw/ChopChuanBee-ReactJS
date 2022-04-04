import React, { useState, useEffect } from 'react';
import { Column } from "@ant-design/plots";
import { useApp } from '../../../../providers/AppProvider';

export default function CustomerAnalyticsGraph(props) {
  const [data, setData] = useState([])

  useEffect(() => {
    formatData(props.data)
  }, [props.data]);

  const formatData = (data) => {
    const cogs = []
    const profits = []
    data.forEach((item) => {
      let obj = {
        sales_order_id: item.sales_order_id,
        company_name: item.company_name,
        revenue: `Total Revenue:  $${parseFloat(item.total_revenue)}`
      }
      cogs.push({
        ...obj,
        value: parseFloat(item.total_cogs),
        indicator: 'COGS'
      })
      profits.push({
        ...obj,
        value: parseFloat(item.total_profits),
        indicator: 'Profits'
      })
    })
    setData([...profits, ...cogs])
  }

  const config = {
    data,
    isStack: true,
    xField: "sales_order_id",
    yField: "value",
    seriesField: "indicator",
    xAxis: {
      title: {
        text: "Sales Order ID",
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
    },
    columnBackground: {
      style: {
        fill: "rgba(0,0,0,0.1)",
      },
    },
    tooltip: {
      title: 'revenue',
      formatter: (data) => {
        return {
          name: data.indicator,
          value: `$${data.value}`
        }
      }
    }
  }

  return <>
    <Column {...config} />
  </>
}
