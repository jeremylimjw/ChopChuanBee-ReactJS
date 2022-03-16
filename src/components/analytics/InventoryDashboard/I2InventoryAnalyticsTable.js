import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export default function I2InventoryAnalyticsTable() {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
      width: "12%",
    },
    {
      title: "Avg Cost Price",
      dataIndex: "avg_cost_price",
      key: "avg_cost_price",
      width: "12%",
    },
    {
      title: "Avg Selling Price",
      dataIndex: "avg_selling_price",
      key: "avg_selling_price",
      width: "12%",
    },
    {
      title: "Avg Contribution",
      dataIndex: "avg_contribution",
      key: "avg_contribution",
      width: "12%",
    },
    {
      title: "No. of Units Sold",
      dataIndex: "num_units_sold",
      key: "num_units_sold",
      width: "12%",
    },
    {
      title: "Total Contribution",
      dataIndex: "total_contribution",
      key: "total_contribution",
      width: "12%",
    },
    {
      title: "Turnover Period",
      dataIndex: "turnover_period",
      key: "turnover_period",
      width: "12%",
    },
    {
      title: "Inventory Wastage",
      dataIndex: "inventory_wastage",
      key: "inventory_wastage",
      width: "12%",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "link",
      width: "4%",
      //   render: (id) => <Link to={`./${id}`}>View</Link>,
      render: (id) => (
        <Button
          style={{ padding: "0" }}
          onClick={() => navigate("/analytics/productDashboard")}
          type="link"
        >
          View
        </Button>
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      product_name: "Ketchup Sauce ABC",
      avg_cost_price: "$1.50",
      avg_selling_price: "$2.80",
      avg_contribution: "$1.30",
      num_units_sold: "35",
      total_contribution: "$45.50",
      turnover_period: "40.5",
      inventory_wastage: "$10.30",
    },
    {
      key: "2",
      product_name: "Dried Scallop",
      avg_cost_price: "$1.50",
      avg_selling_price: "$2.80",
      avg_contribution: "$1.30",
      num_units_sold: "35",
      total_contribution: "$45.50",
      turnover_period: "40.5",
      inventory_wastage: "$10.30",
    },
  ];

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
