import React, { useEffect, useState } from "react";
import { useApp } from "../../../../providers/AppProvider";
import { Table } from "antd";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import { showTotal } from "../../../../utilities/table";
import { sortByNumber, sortByString } from '../../../../utilities/sorters';
import { formatCurrency } from '../../../../utilities/currency';
import { Link } from 'react-router-dom';

export default function DamagedGoodsTable(props) {
  const { handleHttpError } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    AnalyticsApiHelper.getDamagedGoodsOrderByValueDesc(props.startDate, props.endDate)
      .then((results) => {
        setData(results);
        setLoading(false);
      })
      .catch(handleHttpError);
      props.setUserInput(false);
  }, [handleHttpError, loading, props]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
      sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
      title: "Quantity Damaged",
      dataIndex: "quantity_damaged",
      key: "quantity_damaged",
      width: "20%",
      sorter: (a, b) => sortByNumber(a.quantity_damaged, b.quantity_damaged),
    },
    {
      title: "Total Value Loss",
      dataIndex: "total_damaged_inventory_value",
      key: "total_damaged_inventory_value",
      width: "20%",
      sorter: (a, b) => sortByNumber(a.total_damaged_inventory_value, b.total_damaged_inventory_value),
      render: (x) => formatCurrency(x),
    },
    {
      title: "Action",
      dataIndex: "product_uuid",
      key: "link",
      width: "10%",
      render: (product_uuid) => <Link to = {`/inventory/products/${product_uuid}`}>View</Link>
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="name"
        pagination={{ showTotal }}
      />
    </>
  );
}
