import React, { useEffect, useState } from "react";
import { useApp } from "../../../../providers/AppProvider";
import { Table } from "antd";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import { showTotal } from "../../../../utilities/table";
import { sortByNumber, sortByString } from '../../../../utilities/sorters';
import { formatCurrency } from '../../../../utilities/currency';
import { Link } from 'react-router-dom';
import { LoadingOutlined } from "@ant-design/icons";

export default function AgingReceivableTable() {
  const { handleHttpError } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    AnalyticsApiHelper.getAgedReceivable()
      .then((results) => {
        setData(results);
        setLoading(false);
      })
      .catch(handleHttpError);
  }, [handleHttpError, loading]);

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "company_name",
      key: "company_name",
      width: "20%",
      sorter: (a, b) => sortByString(a.company_name, b.company_name),
    },
    {
      title: "Less Than 30 Days",
      dataIndex: "over_less_than_30",
      key: "over_less_than_30",
      width: "20%",
      sorter: (a, b) => sortByNumber(a.over_less_than_30, b.over_less_than_30),
    },
    {
      title: "Over 30 to 60 Days",
      dataIndex: "overdue_31_to_60_days",
      key: "overdue_31_to_60_days",
      width: "20%",
      sorter: (a, b) => sortByNumber(a.overdue_31_to_60_days, b.overdue_31_to_60_days),
      render: (x) => formatCurrency(x),
    },
    {
        title: "Over 60 to 90 Days",
        dataIndex: "overdue_61_to_90_days",
        key: "overdue_61_to_90_days",
        width: "20%",
        sorter: (a, b) => sortByNumber(a.overdue_61_to_90_days, b.overdue_61_to_90_days),
        render: (x) => formatCurrency(x),
    },
    {
        title: "Over 90 Days",
        dataIndex: "overdue_more_than_91_days",
        key: "overdue_more_than_91_days",
        width: "15%",
        sorter: (a, b) => sortByNumber(a.overdue_more_than_91_days, b.overdue_more_than_91_days),
        render: (x) => formatCurrency(x),
    },
    {
      title: "Action",
      dataIndex: "customer_id",
      key: "link",
      width: "5%",
      render: (customer_id) => <Link to = {`/customer/customers/${customer_id}`}>View</Link>
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="company_name"
        pagination={{ showTotal }}
      />
    </>
  );
}
