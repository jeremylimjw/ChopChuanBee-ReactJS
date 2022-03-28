import React, { useState, useEffect } from "react";
import { Form, DatePicker } from 'antd';
import { Column } from "@ant-design/plots";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import MyCard from "../../../common/MyCard";
import MyToolbar from "../../../common/MyToolbar";
import debounce from 'lodash.debounce';
import moment from 'moment';

export default function ContributionChart(props) {
  const { handleHttpError } = useApp();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    AnalyticsApiHelper.getProductAnalytics(props.oneYearAgo, props.currDate)
      .then((results) => {
        results.map((x) => {
          x.total_contribution = parseFloat(x.total_contribution);
          return x;
        });
        setData(results);
        setLoading(false);
      })
      .catch(handleHttpError);
  }, [handleHttpError, loading]);

  function onValuesChange(_, form) {
    let start_date, end_date;
    if (form.date && form.date[0] && form.date[1]) {
        start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
        end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
    }

    AnalyticsApiHelper.getProductAnalytics(start_date, end_date)
      .then((results) => {
        results.map((x) => {
          x.total_contribution = parseFloat(x.total_contribution);
          return x;
        });
        setData(results);
        setLoading(false);
      })
      .catch(handleHttpError);
  }

  const config = {
    data,
    xField: "product_name",
    yField: "total_contribution",
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
    tooltip: {
      fields: ["product_name", "total_contribution", "quantity_sold", "average_cogs", "average_selling_price", "inventory_turnaround_period"],
      showTitle: false,
    },
    meta: {
      product_name: {
        alias: "Product Name",
      },
      total_contribution: {
        alias: "Total Contribution Value",
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
      quantity_sold: {
        alias: "Quantity Sold",
      },
      average_cogs: {
        alias: "Avg Cost of Goods Sold",
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
      average_selling_price: {
        alias: "Avg Selling Price",
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      },
      inventory_turnaround_period: {
        alias: "Inventory Turnaround Period",
        formatter: (v) => `${(v / 1).toFixed(2)} `,
      }
    },
  };
  
  const dateFormat = 'YYYY/MM/DD';

  return (
    <>
      <MyCard style={{ marginLeft: "3px", marginRight: "3px" }}>
        <MyToolbar title="Product Total Contribution Chart">
            <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                <Form.Item name='date'>
                    <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currDate, dateFormat)]} />
                </Form.Item>
            </Form>
        </MyToolbar>
        <Column {...config} />
      </MyCard>
    </>
  );
}
