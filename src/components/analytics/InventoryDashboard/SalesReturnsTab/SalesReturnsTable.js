import React, { useEffect, useState } from "react";
import { useApp } from "../../../../providers/AppProvider";
import { Table } from "antd";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import { showTotal } from "../../../../utilities/table";
import { sortByNumber, sortByString } from '../../../../utilities/sorters';
import { formatCurrency } from '../../../../utilities/currency';

export default function SalesReturnsTable(props) {
  const { handleHttpError } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    AnalyticsApiHelper.getCustomerReturnedGoods(props.startDate, props.endDate)
      .then((results) => {
        setData(results);
        setLoading(false);
      })
      .catch(handleHttpError);
  }, [handleHttpError, loading, props.userInput]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => sortByString(a.name, b.name),
    },
    {
      title: "Quantity Returned",
      dataIndex: "quantity_returned",
      key: "quantity_returned",
      width: "30%",
      sorter: (a, b) => sortByNumber(a.quantity_returned, b.quantity_returned),
    },
    {
      title: "Total Value Loss",
      dataIndex: "customer_returned_goods_total_value",
      key: "customer_returned_goods_total_value",
      width: "30%",
      sorter: (a, b) => sortByNumber(a.customer_returned_goods_total_value, b.customer_returned_goods_total_value),
      render: (x) => formatCurrency(x),
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
