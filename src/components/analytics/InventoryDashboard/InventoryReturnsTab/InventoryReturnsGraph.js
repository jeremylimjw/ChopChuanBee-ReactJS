import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";

export default function InventoryReturnsGraph() {
  
  
    const data = [
    {
      name: "Quantity Returned",
      月份: "Product A",
      月均降雨量: 3,
    },
    {
      name: "Quantity Returned",
      月份: "Product B",
      月均降雨量: 2,
    },
    {
      name: "Quantity Returned",
      月份: "Product C",
      月均降雨量: 4,
    },
    {
      name: "Quantity Returned",
      月份: "Product D",
      月均降雨量: 2,
    },
    {
      name: "Quantity Returned",
      月份: "Product E",
      月均降雨量: 10,
    },
    {
      name: "Quantity Returned",
      月份: "Product F",
      月均降雨量: 2,
    },

    {
      name: "Total Loss",
      月份: "Product A",
      月均降雨量: 12.4,
    },
    {
      name: "Total Loss",
      月份: "Product B",
      月均降雨量: 23.2,
    },
    {
      name: "Total Loss",
      月份: "Product C",
      月均降雨量: 34.5,
    },
    {
      name: "Total Loss",
      月份: "Product D",
      月均降雨量: 99.7,
    },
    {
      name: "Total Loss",
      月份: "Product E",
      月均降雨量: 52.6,
    },
    {
      name: "Total Loss",
      月份: "Product F",
      月均降雨量: 35.5,
    },    
  ];

  const config = {
    data,
    isGroup: true,
    xField: "月份",
    yField: "月均降雨量",
    seriesField: "name",

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
  };

  return <Column {...config} />;
}
