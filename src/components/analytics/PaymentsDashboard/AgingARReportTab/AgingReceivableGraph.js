import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";

export default function AgingReceivableGraph() {
  const { handleHttpError } = useApp();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lessThan30Days = [];
    const over30Days = [];
    const over60Days = [];
    const over90Days = [];

    const fetchData = async () => {
      await AnalyticsApiHelper.getAgedReceivable()
        .then((results) => {
          results.forEach((x) => {
            const tempLessThan30 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.over_less_than_30),
              aged_duration: "Less than 30 Days",
            };
            lessThan30Days.push(tempLessThan30);
            const tempOver30 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.overdue_31_to_60_days),
              aged_duration: "Over 30 to 60 Days",
            };
            over30Days.push(tempOver30);
            const tempOver60 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.overdue_61_to_90_days),
              aged_duration: "Over 60 to 90 Days",
            };
            over60Days.push(tempOver60);
            const tempOver90 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.overdue_more_than_91_days),
              aged_duration: "More than 90 Days",
            };
            over90Days.push(tempOver90);
          });
        })
        .catch(handleHttpError);
      setData([...over90Days, ...over60Days, ...over30Days, ...lessThan30Days]);
      setLoading(false);
    };

    fetchData();
  }, [handleHttpError, loading]);

  const config = {
    data,
    isStack: true,
    xField: "company_name",
    yField: "accounts_receivable",
    seriesField: "aged_duration",
    xAxis: {
      title: {
        text: "Customer Company Name",
        style: {
          fill: "black",
          fillOpacity: 0.5,
          stroke: "black",
        },
      },
      label: {
        autoHide: true,
        autoRotate: true,
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
      formatter: (x) => "",
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

  return <> { data.length === 0 ? "" : <Column {...config} /> } </>;
}
