import React, { useState, useEffect } from "react";
import { Typography } from 'antd';
import { Column } from "@ant-design/plots";
import MyCard from "../../../common/MyCard";
import MyToolbar from "../../../common/MyToolbar";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import { parseDateTime } from '../../../../utilities/datetime';

export default function AgingReceivableGraph(props) {
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
          console.log(results);
          results.forEach((x) => {
            const tempLessThan30 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.over_less_than_60),
              aged_duration: "Less Than 30 Days",
            };
            lessThan30Days.push(tempLessThan30);
            const tempOver30 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.overdue_61_to_180_days),
              aged_duration: "Over 30 Days",
            };
            over30Days.push(tempOver30);
            const tempOver60 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.overdue_181_to_270_days),
              aged_duration: "Over 60 Days",
            };
            over60Days.push(tempOver60);
            const tempOver90 = {
              customer_id: x.customer_id,
              company_name: x.company_name,
              accounts_receivable: parseFloat(x.overdue_more_than_271_days),
              aged_duration: "Over 90 Days",
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
      // formatter: (x) => "",
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
      <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>
      <MyCard style={{ marginLeft: "3px", marginRight: "3px" }}>
        <MyToolbar title="Aging Accounts Receivable"></MyToolbar>
        <Column {...config} />
      </MyCard>
    </>
  );
}
