import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import MyCard from "../../../common/MyCard";
import MyToolbar from "../../../common/MyToolbar";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";

export default function AgingReceivableGraph(props) {
  const { handleHttpError, hasWriteAccessTo } = useApp();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [over60Data, setOver60Data] = useState([]);
  const [over180Data, setOver180Data] = useState([]);
  const [over270Data, setOver270Data] = useState([]);

  useEffect(() => {
    fetchData();
  }, [handleHttpError, loading]);

  const fetchData = async () => {
    await AnalyticsApiHelper.getAgedReceivable()
      .then((results) => {
        console.log(results);
        results.forEach((x) => {
          const tempCurr = {
            customer_id: x.customer_id,
            company_name: x.company_name,
            accounts_receivable: parseFloat(x.over_less_than_60),
            aged_duration: "Current",
          };
          currentData.push(tempCurr);
          const tempOver60 = {
            customer_id: x.customer_id,
            company_name: x.company_name,
            accounts_receivable: parseFloat(x.overdue_61_to_180_days),
            aged_duration: "Over 60 Days",
          };
          over60Data.push(tempOver60);
          const tempOver180 = {
            customer_id: x.customer_id,
            company_name: x.company_name,
            accounts_receivable: parseFloat(x.overdue_181_to_270_days),
            aged_duration: "Over 180 Days",
          };
          over180Data.push(tempOver180);
          const tempOver270 = {
            customer_id: x.customer_id,
            company_name: x.company_name,
            accounts_receivable: parseFloat(x.overdue_more_than_271_days),
            aged_duration: "Over 270 Days",
          };
          over270Data.push(tempOver270);
        });
      })
      .catch(handleHttpError);
    setData([...over270Data, ...over180Data, ...over60Data, ...currentData]);
    // setData([...over270, ...over180, ...over60, ...current]);
    setLoading(false);
  };

  const current = [
    {
      company_name: "Customer A",
      accounts_receivable: 3,
      aged_duration: "Current",
    },
    {
      company_name: "Customer B",
      accounts_receivable: 4,
      aged_duration: "Current",
    },
    {
      company_name: "Customer C",
      accounts_receivable: 3.5,
      aged_duration: "Current",
    },
    {
      company_name: "Customer D",
      accounts_receivable: 5,
      aged_duration: "Current",
    },
    {
      company_name: "Customer E",
      accounts_receivable: 4.9,
      aged_duration: "Current",
    },
    {
      company_name: "Customer F",
      accounts_receivable: 6,
      aged_duration: "Current",
    },
    {
      company_name: "Customer G",
      accounts_receivable: 7,
      aged_duration: "Current",
    },
    {
      company_name: "Customer H",
      accounts_receivable: 9,
      aged_duration: "Current",
    },
    {
      company_name: "Customer I",
      accounts_receivable: 13,
      aged_duration: "Current",
    },
  ];

  const over60 = [
    {
      company_name: "Customer A",
      accounts_receivable: 3,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer B",
      accounts_receivable: 4,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer C",
      accounts_receivable: 3.5,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer D",
      accounts_receivable: 5,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer E",
      accounts_receivable: 4.9,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer F",
      accounts_receivable: 6,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer G",
      accounts_receivable: 7,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer H",
      accounts_receivable: 9,
      aged_duration: "Over 60 Days",
    },
    {
      company_name: "Customer I",
      accounts_receivable: 13,
      aged_duration: "Over 60 Days",
    },
  ];

  const over180 = [
    {
      company_name: "Customer A",
      accounts_receivable: 3,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer B",
      accounts_receivable: 4,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer C",
      accounts_receivable: 3.5,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer D",
      accounts_receivable: 5,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer E",
      accounts_receivable: 4.9,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer F",
      accounts_receivable: 6,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer G",
      accounts_receivable: 7,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer H",
      accounts_receivable: 9,
      aged_duration: "Over 180 Days",
    },
    {
      company_name: "Customer I",
      accounts_receivable: 13,
      aged_duration: "Over 180 Days",
    },
  ];

  const over270 = [
    {
      company_name: "Customer A",
      accounts_receivable: 3,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer B",
      accounts_receivable: 4,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer C",
      accounts_receivable: 3.5,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer D",
      accounts_receivable: 5,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer E",
      accounts_receivable: 4.9,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer F",
      accounts_receivable: 6,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer G",
      accounts_receivable: 7,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer H",
      accounts_receivable: 9,
      aged_duration: "Over 270 Days",
    },
    {
      company_name: "Customer I",
      accounts_receivable: 13,
      aged_duration: "Over 270 Days",
    },
  ];

  const config = {
    data,
    isStack: true,
    xField: "company_name",
    yField: "accounts_receivable",
    seriesField: "aged_duration",
    xAxis: {
      title: {
        text: "Customer Name",
        style: {
          fill: "black",
          fillOpacity: 0.5,
          stroke: "black",
        },
      },
    },
    yAxis: {
      title: {
        text: "Amount (SGD)",
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
    label: {
      position: "middle",
    },
    interactions: [
      {
        aged_duration: "active-region",
        enable: false,
      },
    ],
    columnBackground: {
      style: {
        fill: "rgba(0,0,0,0.1)",
      },
    },
    meta: {
      accounts_receivable: {
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
    },
  };

  return (
    <>
      <MyCard style={{ marginLeft: "3px", marginRight: "3px" }}>
        <MyToolbar title="Aging Accounts Receivable"></MyToolbar>
        <Column {...config} />
      </MyCard>
    </>
  );
}
