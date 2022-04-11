import React, { useState, useEffect, useCallback } from "react";
import { Column } from "@ant-design/plots";
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function InventoryReturnsGraph(props) {//
  const { handleHttpError } = useApp();
  const [data, setData] = useState([]);

  const fetchData = useCallback(
    async () => {
      await AnalyticsApiHelper.getSupplierReturnedGoodsOrderByValueDesc(props.startDate, props.endDate)
        .then((result) => {
          const quantityReturned = [];
          const totalValueLoss = [];

          result.forEach((x) => { 
            const tempQtyReturned = {
              product_name: x.product_name,
              metric_name: "Quantity Returned",
              value: parseInt(x.quantity_returned),
            };
            quantityReturned.push(tempQtyReturned);
            const tempTotalValueLoss = {
              product_name: x.product_name,
              metric_name: "Total Value Loss",
              value: parseFloat(x.supplier_returned_goods_total_value),
            };
            totalValueLoss.push(tempTotalValueLoss);

            setData([...quantityReturned, ...totalValueLoss]);
            props.setUserInput(false);
          });
        })
        .catch(handleHttpError);
    },
    [props, handleHttpError, setData],
  )

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      label: {
        autoHide: true,
        autoRotate: true,
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

  return <> { data.length === 0 ? "" : <Column {...config} /> } </>;
}
