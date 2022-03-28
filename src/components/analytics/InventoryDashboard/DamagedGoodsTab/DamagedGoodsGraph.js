import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function DamagedGoodsGraph(props) {
  const { handleHttpError } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const quantityReturned = [];
  const totalValueLoss = [];

  useEffect(() => {
    fetchData();
  }, [handleHttpError, loading, props.userInput]);

  const fetchData = async () => {
    await AnalyticsApiHelper.getDamagedGoods(props.startDate, props.endDate)
      .then((result) => {
        result.forEach((x) => { 
          const tempQtyReturned = {
            product_name: x.name,
            metric_name: "Quantity Damaged",
            value: parseInt(x.quantity_returned),
          };
          quantityReturned.push(tempQtyReturned);
          const tempTotalValueLoss = {
            product_name: x.name,
            metric_name: "Total Value Loss",
            value: parseFloat(x.total_damaged_inventory_value),
          };
          totalValueLoss.push(tempTotalValueLoss);
        });
      })
      .catch(handleHttpError);
    setData([...quantityReturned, ...totalValueLoss]);
    setLoading(false);
  }

  const config = {
    data,
    isGroup: true,
    xField: "product_name",
    yField: "value",
    seriesField: "metric_name",
    xAxis: {
      title: {
        text: "Product Name",
        style: {
          fill: "black",
          fillOpacity: 0.5,
          stroke: "black",
        },
      },
    },
    yAxis: {
      title: {
        text: "Value",
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
      position: 'top-right'
    },
    label: {
      position: "middle",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
    meta: {
      value: {
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
    },
  };

  return <Column {...config} />;
}
