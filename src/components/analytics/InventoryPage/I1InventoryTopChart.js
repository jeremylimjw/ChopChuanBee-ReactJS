import React, { useState, useEffect } from "react";
import { Pie, Column } from "@ant-design/plots";
// import MyToolbar from '../../common/MyToolbar';
import { Tabs, Radio, Space } from "antd";

export default function I1InventoryTopChart() {
  const { TabPane } = Tabs;

  const TabNames = {
    AVG_COST_PRICE: { id: 1, name: "Avg Cost Price" },
    AVG_SELL_PRICE: { id: 2, name: "Avg Selling Price" },
    AVG_CONTRIBUTION: { id: 3, name: "Avg Contribution" },
    NUM_UNIT_SOLD: { id: 4, name: "No. of Units Sold" },
    TOTAL_CONTRIBUTION: { id: 5, name: "Total Contribution" },
    TURNOVER_PERIOD: { id: 6, name: "Turnover Period" },
    INVENTORY_WASTAGE: { id: 7, name: "Inventory Wastage" },
  };

  const data = [
    {
      type: "Ketchup Sauce ABC",
      price: 1.5,
    },
    {
      type: "Ikan Bilis A",
      price: 2.3,
    },
    {
      type: "Dried Abalone",
      price: 2.5,
    },
    {
      type: "Dried Scallop A",
      price: 2.8,
    },
    {
      type: "Dried Sotong A",
      price: 1.8,
    },
    {
      type: "Chilli Sauce ABC",
      price: 1.3,
    },
    {
      type: "Ketchup Sauce DEF",
      price: 1.8,
    },
    {
      type: "Ikan Bilis AA",
      price: 2.3,
    },
    {
      type: "Dried Scallop AA",
      price: 2.8,
    },
    {
      type: "Dried Sotong AA",
      price: 3.0,
    },
    // {
    //   type: "Others",
    //   price: 5,
    // },
  ];

  //Pie Chart Demo
  const config = {
    appendPadding: 10,
    data,
    angleField: "price",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [
      {
        type: "pie-legend-active",
      },
      {
        type: "element-active",
      },
    ],
  };

  //Bar Chart Demo
  const barConfig = {
    data,
    xField: "type",
    yField: "price",
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
        autoRotate: false,
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
    meta: {
      type: {
        alias: "Product Name",
      },
      price: {
        alias: "Price (SGD)",
      },
    },
  };

  return (
    <>
      <Tabs tabPosition={"left"}>
        {/* {Object.keys(TabNames).map((key, idx) => {
          <TabPane key={idx} tab={TabNames[key].name}>
            <Pie {...config} />
          </TabPane>;
        })} */}
        <TabPane
          tab={TabNames.AVG_COST_PRICE.name}
          key={TabNames.AVG_COST_PRICE.id}
        >
          <Column {...barConfig} />
        </TabPane>
        <TabPane
          tab={TabNames.AVG_SELL_PRICE.name}
          key={TabNames.AVG_SELL_PRICE.id}
        >
          <Pie {...config} />
        </TabPane>
        <TabPane
          tab={TabNames.AVG_CONTRIBUTION.name}
          key={TabNames.AVG_CONTRIBUTION.id}
        >
          <Pie {...config} />
        </TabPane>
        <TabPane
          tab={TabNames.NUM_UNIT_SOLD.name}
          key={TabNames.NUM_UNIT_SOLD.id}
        >
          <Pie {...config} />
        </TabPane>
        <TabPane
          tab={TabNames.TOTAL_CONTRIBUTION.name}
          key={TabNames.TOTAL_CONTRIBUTION.id}
        >
          <Pie {...config} />
        </TabPane>
        <TabPane
          tab={TabNames.TURNOVER_PERIOD.name}
          key={TabNames.TURNOVER_PERIOD.id}
        >
          <Pie {...config} />
        </TabPane>
        <TabPane
          tab={TabNames.INVENTORY_WASTAGE.name}
          key={TabNames.INVENTORY_WASTAGE.id}
        >
          <Pie {...config} />
        </TabPane>
      </Tabs>
    </>
  );
}
