import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";

export default function P1ProductPricingChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // asyncFetch();
    setData([...avg_cost_price, ...avg_selling_price, ...avg_contribution]);
  }, []);

  //   const asyncFetch = () => {
  //     fetch(
  //       "https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json")
  //       .then((response) => response.json())
  //       .then((json) => setData(json))
  //       .catch((error) => {
  //         console.log("fetch data failed", error);
  //       });
  //   };

  const avg_cost_price = [
    {
      name: "Average Cost Price",
      month: "January 2021",
      price: 1212.24,
    },
    {
      name: "Average Cost Price",
      month: "February 2021",
      price: 212.24,
    },
    {
      name: "Average Cost Price",
      month: "March 2021",
      price: 512.24,
    },
    {
      name: "Average Cost Price",
      month: "April 2021",
      price: 212.24,
    },
    {
      name: "Average Cost Price",
      month: "May 2021",
      price: 562.24,
    },
    {
      name: "Average Cost Price",
      month: "June 2021",
      price: 912.24,
    },
    {
      name: "Average Cost Price",
      month: "July 2021",
      price: 1212.24,
    },
    {
      name: "Average Cost Price",
      month: "August 2021",
      price: 1512.24,
    },
    {
      name: "Average Cost Price",
      month: "September 2021",
      price: 1512.24,
    },
    {
      name: "Average Cost Price",
      month: "October 2021",
      price: 1712.24,
    },
    {
      name: "Average Cost Price",
      month: "November 2021",
      price: 1212.24,
    },
    {
      name: "Average Cost Price",
      month: "December 2021",
      price: 1512.24,
    },
  ];

  const avg_selling_price = [
    {
      name: "Average Selling Price",
      month: "January 2021",
      price: 912.24,
    },
    {
      name: "Average Selling Price",
      month: "February 2021",
      price: 612.24,
    },
    {
      name: "Average Selling Price",
      month: "March 2021",
      price: 312.24,
    },
    {
      name: "Average Selling Price",
      month: "April 2021",
      price: 212.24,
    },
    {
      name: "Average Selling Price",
      month: "May 2021",
      price: 562.24,
    },
    {
      name: "Average Selling Price",
      month: "June 2021",
      price: 912.24,
    },
    {
      name: "Average Selling Price",
      month: "July 2021",
      price: 1212.24,
    },
    {
      name: "Average Selling Price",
      month: "August 2021",
      price: 1512.24,
    },
    {
      name: "Average Selling Price",
      month: "September 2021",
      price: 1512.24,
    },
    {
      name: "Average Selling Price",
      month: "October 2021",
      price: 1712.24,
    },
    {
      name: "Average Selling Price",
      month: "November 2021",
      price: 1212.24,
    },
    {
      name: "Average Selling Price",
      month: "December 2021",
      price: 1512.24,
    },
  ];

  const avg_contribution = [
    {
      name: "Average Contribution",
      month: "January 2021",
      price: 312.24,
    },
    {
      name: "Average Contribution",
      month: "February 2021",
      price: 512.24,
    },
    {
      name: "Average Contribution",
      month: "March 2021",
      price: 612.24,
    },
    {
      name: "Average Contribution",
      month: "April 2021",
      price: 212.24,
    },
    {
      name: "Average Contribution",
      month: "May 2021",
      price: 562.24,
    },
    {
      name: "Average Contribution",
      month: "June 2021",
      price: 912.24,
    },
    {
      name: "Average Contribution",
      month: "July 2021",
      price: 1212.24,
    },
    {
      name: "Average Contribution",
      month: "August 2021",
      price: 1212.24,
    },
    {
      name: "Average Contribution",
      month: "September 2021",
      price: 1412.24,
    },
    {
      name: "Average Contribution",
      month: "October 2021",
      price: 1612.24,
    },
    {
      name: "Average Contribution",
      month: "November 2021",
      price: 1012.24,
    },
    {
      name: "Average Contribution",
      month: "December 2021",
      price: 1312.24,
    },
  ];

  const config = {
    data,
    xField: "month",
    yField: "price",
    seriesField: "name",
    xAxis: {
      title: {
        text: "Month",
        style: {
          fill: "black",
          fillOpacity: 0.5,
          stroke: "black",
        },
      },
    },
    yAxis: {
      title: {
        text: "Price (SGD)",
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
      position: "top",
    },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 5000,
      },
    },
  };

  return <Line {...config} />;
}
