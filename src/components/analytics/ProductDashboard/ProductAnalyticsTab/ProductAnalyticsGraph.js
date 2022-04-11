import React, { useState, useEffect } from 'react';
import { DualAxes, Line } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import debounce from 'lodash.debounce';
import { Button, DatePicker, Form, Space, Tabs } from 'antd';
import moment from 'moment';
import { LeftOutlined } from '@ant-design/icons';
import ProductAnalyticsCard from './ProductAnalyticsCard';

export default function ProductAnalyticsGraph(props) {
  const [lineData, setLineData] = useState([]);
  const [contributionLineData, setContributionLineData] = useState([])
  const [barData, setBarData] = useState([])
  const [product, setProduct] = useState()
  const [dateRange, setDateRange] = useState([])
  const [loading, setLoading] = useState(true);
  const { handleHttpError } = useApp();
  const [form] = Form.useForm();
  const dateFormat = 'YYYY/MM/DD';

  useEffect(() => {
    setProduct(props.data)
    setDateRange(props.dateRange)
    formatChartData(props.data.data)
    setLoading(false)
  }, [handleHttpError]);

  async function onValuesChange(_, form) {
    let productID = product.info.product_uuid
    let productName = product.info.product_name
    setLoading(true)
    let start_date, end_date;
    if (form.date && form.date[0] && form.date[1]) {
      start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
      setDateRange([start_date, end_date])
    }
    let result = await AnalyticsApiHelper.getProductMonthlyInsights(product.info.product_uuid, start_date, end_date)
    let consolidatedResult = await AnalyticsApiHelper.getProductAnalytics(start_date, end_date)
    let newPeriodData = {
      data: result,
      info: consolidatedResult.length > 0
        ? { ...consolidatedResult.find(x => x.product_uuid === product.info.product_uuid), product_uuid: productID, product_name: productName }
        : {
          product_uuid: productID,
          product_name: productName
        },
      dateRange: [start_date, end_date],
    }
    setProduct(newPeriodData)
    formatChartData(result)

  }

  const formatChartData = (data) => {
    let avgCOGS = []
    let avgPrice = []
    let totalContribution = []
    let qtySold = []

    data.forEach((item) => {
      avgCOGS.push({
        name: 'Average Cost of Goods Sold',
        value: parseFloat(item.average_cogs),
        date: item.date
      })
      avgPrice.push({
        name: ' Average Selling Price',
        value: parseFloat(item.average_selling_price),
        date: item.date
      })
      totalContribution.push({
        name: 'Total Contribution Value',
        value: parseFloat(item.total_contribution),
        date: item.date
      })
      qtySold.push({
        name: 'Quantity Sold',
        count: parseInt(item.quantity_sold),
        date: item.date
      })
    })
    setLineData([...avgCOGS, ...avgPrice])
    setContributionLineData([...totalContribution])
    setBarData(qtySold)
    setLoading(false)
  }


  const lineConfig = {
    data: lineData,
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
      }
    }
  }

  const dualAxisConfig = {
    data: [contributionLineData, barData],
    xField: 'date',
    yField: ['value', 'count'],
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
      value: {
        title: {
          text: 'Amount (SGD)',
          style: {
            fill: "black",
            fillOpacity: 0.5,
            stroke: "black",
          },
        }
      },
      count: {
        title: {
          text: 'Quantity',
          style: {
            fill: "black",
            fillOpacity: 0.5,
            stroke: "black",
          },
        }
      }
    },
    geometryOptions: [
      {
        geometry: 'line',
        seriesField: 'name',
      },
      {
        geometry: 'column',
        columnWidthRatio: 0.4,
        seriesField: 'name',
      },
    ],
  }


  return (
    <>
      <Space>
        <ProductAnalyticsCard
          title='Average Cost of Goods Sold'
          productName=''
          indicatorValue={`$${parseFloat(product?.info?.average_cogs || 0).toFixed('2')}` || '$0'}
        />
        <ProductAnalyticsCard
          title='Average Selling Price'
          productName=''
          indicatorValue={`$${parseFloat(product?.info?.average_selling_price || 0).toFixed('2')}` || '$0'}
        />
        <ProductAnalyticsCard
          title='Quantity Sold'
          productName=''
          indicatorValue={product?.info?.quantity_sold || 0}
        />
        <ProductAnalyticsCard
          title='Total Contribution Value'
          productName=''
          indicatorValue={`$${parseFloat(product?.info?.total_contribution || 0).toFixed('2')}` || '$0'}
        />
        <ProductAnalyticsCard
          title='Inventory Turnover'
          productName=''
          indicatorValue={`${parseFloat(product?.info?.inventory_turnaround_period || 0).toFixed('2')}` || '0.00'}
        />
      </Space>
      <MyCard style={{ marginLeft: '3px', marginRight: '3px' }}>
        <MyToolbar title={product?.info?.product_name}>
          <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
            <Form.Item name='date'>
              <DatePicker.RangePicker defaultValue={[moment(props.data.dateRange[0], dateFormat), moment(props.data.dateRange[1], dateFormat)]} />
            </Form.Item>
          </Form>
        </MyToolbar>
        {loading ? <div /> :
          <Tabs defaultActiveKey='1' type="card">
            <Tabs.TabPane tab='Price' key='1'>
              <Line {...lineConfig} />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Sales' key='2'>
              <DualAxes {...dualAxisConfig} />
            </Tabs.TabPane>
          </Tabs>
        }
        <Button
          icon={<LeftOutlined />}
          onClick={() => props.handleViewMode({
            dateRange: dateRange,
            product_uuid: null
          })}
        >Return to Table</Button>
      </MyCard>
    </>
  )
}
