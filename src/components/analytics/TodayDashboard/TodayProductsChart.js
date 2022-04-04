import React, { useEffect, useState } from "react";
import { Bar } from "@ant-design/plots";

export default function TodayProductsChart() {
  const data = [
    {
      type: "Product A",
      sales: 78,
    },
    {
      type: "Product B",
      sales: 52,
    },
    {
      type: "Product C",
      sales: 51,
    },
    {
      type: "Product D",
      sales: 40,
    },
    {
      type: "Product E",
      sales: 28,
    },
  ];

  const config = {
    data,
    xField: "sales",
    yField: "type",
    barWidthRatio: 0.8,
    meta: {
      type: {
        alias: "类别",
      },
      sales: {
        alias: "销售额",
      },
    },
  };

  return <Bar {...config} />;
}
