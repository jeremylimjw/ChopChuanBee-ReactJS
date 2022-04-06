import React from "react";
import { Bar } from "@ant-design/plots";

export default function TodayProductsChart(props) {
  let data = [];

  function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] < b[prop]) {    
            return 1;    
        } else if (a[prop] > b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
  }

  if (props.data.length > 5) {
    data = props.data.slice(0, 5);
  } else {
    data = props.data;
  }

  data = data.sort(GetSortOrder("contribution_margin"));

  const config = {
    data,
    xField: "contribution_margin",
    yField: "product_name",
    barWidthRatio: 0.8,
    tooltip: {
      fields: ["product_name", "contribution_margin"],
      showTitle: false,
    },
    meta: { 
      contribution_margin: { 
        alias: "Contribution Margin"
      },
      product_name: {
        alias: "Product Name"
      }
    }
  };

  return <Bar {...config} />;
}
