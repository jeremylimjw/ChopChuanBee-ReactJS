import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { DatePicker, Form, Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import moment from 'moment';
import debounce from 'lodash.debounce';
import MyToolbar from '../../../common/MyToolbar';
import { parseDateTime } from '../../../../utilities/datetime';

export default function ARTrendsGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([])
  const { handleHttpError } = useApp();
  const [form] = Form.useForm()
  let start = moment().subtract(1, 'year').endOf('month')
  let end = moment().startOf('day')

  useEffect(() => {
    setDateRange([start, end])
    AnalyticsApiHelper.getAPARSummaryData(start, end)
      .then((results) => {
        formatChartData(results)
        setLoading(false)
      })
      .catch(handleHttpError)
  }, [handleHttpError, loading])

  function onValuesChange(_, form) {
    // setLoading(true)
    let start_date, end_date;
    if (form.date && form.date[0] && form.date[1]) {
      start_date = moment(form.date[0]).endOf('month').toDate();
      end_date = moment(form.date[1]).endOf('month').add(1, 'day').toDate();
    }
    setDateRange([start_date, end_date])
    AnalyticsApiHelper.getAPARSummaryData(start_date, end_date)
      .then((results) => {
        formatChartData(results)
        setLoading(false)
      })
  }

  const formatChartData = (data) => {
    let arBalance = []
    let arSettled = []
    data.forEach((item) => {
      arBalance.push({
        name: 'Outstanding AR',
        value: parseFloat(item.balance_ar),
        date: moment(item.all_months).subtract(1, 'day').format('MMMM YY')
      })
      arSettled.push({
        name: 'AR Settled',
        value: parseFloat(item.ar_settled),
        date: moment(item.all_months).subtract(1, 'day').format('MMMM YY')
      })
    })
    setData([...arBalance, ...arSettled])
  }

  const config = {
    data: data,
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
    xAxis: {
      title: {
        text: "Date",
        style: {
          fill: "black",
          fillOpacity: 0.5,
          stroke: "black",
        },
      },
    },
    yAxis: {
      title: {
        text: 'Amount (SGD)',
        style: {
          fill: "black",
          fillOpacity: 0.5,
          stroke: "black",
        },
        label: {
          formatter: (v) => `${(v / 1).toFixed(2)} `,
        },
      }
    },
    tooltip: {
      showTitle: false
    }
  }

  return <>
    <Typography style={{ fontSize: '0.8rem', marginBottom: 5, fontStyle: 'italic' }}>{"Last Updated: " + parseDateTime(moment())}</Typography>

    <MyCard style={{ margin: '3px' }}>
      <Typography>The Accounts Receivable Trends chart below displays the <span style={{ color: "#1890ff", fontWeight: "bold" }}>monthly accounts receivables amount and the amount of accounts receivables being settled (cash owed by customers)</span>.</Typography>
    </MyCard>
    <MyCard style={{ marginLeft: '3px', marginRight: '3px' }}>
      <MyToolbar title='Accounts Receivables Trend'>  <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
        <Form.Item name='date'>
          <DatePicker.RangePicker picker="month" defaultValue={[start, end]} />
        </Form.Item>
      </Form></MyToolbar>
      <Column {...config} />
    </MyCard>
  </>
}