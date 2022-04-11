import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { parseDate } from "../../../../utilities/datetime";

export default function ContributionChart(props) {
  const { handleHttpError } = useApp();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsApiHelper.getProductAnalytics(props.startDate, props.endDate)
      .then((results) => {
        results.map((x) => {
          x.contribution_margin = parseFloat(x.contribution) / parseFloat(x.average_selling_price) * 100;
          return x;
        });
        setData(results);
        setLoading(false);
        props.setUserInput(false);
      })
      .catch(handleHttpError);
  }, [handleHttpError, loading, props.userInput]);

  const config = {
    data,
    xField: "product_name",
    yField: "contribution_margin",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
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
        text: "Margin",
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
    tooltip: {
      fields: ["product_name", "contribution_margin", "contribution", "average_selling_price", "average_cogs"],
      showTitle: false,
    },
    meta: {
      product_name: {
        alias: "Product Name",
      },
      contribution_margin: {
        alias: "Contribution Margin",
        formatter: (v) => `${(v / 1).toFixed(2)}`,
      },
      contribution: {
        alias: "Contribution Value",
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
      average_selling_price: {
        alias: "Avg Selling Price",
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
      average_cogs: {
        alias: "Avg Cost of Goods Sold",
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
    },
  };

  return <> { data.length === 0 ? "" : 
  <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
    <MyToolbar title={'Product Contribution Margin From ' + parseDate(props.startDate) + ' to ' + parseDate(props.endDate)}></MyToolbar>
    <Column {...config} /> 
  </MyCard>
  } </>;
}
