import React, { useEffect, useState } from 'react';
import ProductAnalyticsTable from './ProductAnalyticsTable';
import { Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import moment from 'moment';
import ProductAnalyticsGraph from './ProductAnalyticsGraph';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';

export default function ProductAnalyticsData(props) {
  const { handleHttpError } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([])
  const [productData, setProductData] = useState()
  const [dateRange, setDateRange] = useState()
  const [tableMode, setTableMode] = useState(true)

  useEffect(() => {
    let start = moment().subtract(1, 'year')
    let end = moment().startOf('day')
    setDateRange([start, end])
    AnalyticsApiHelper.getProductAnalytics(start, end)
      .then(results => {
        setData(results);
        setLoading(false);
      })
      .catch(handleHttpError);
  }, [handleHttpError, loading]);

  useEffect(() => {
    if (productData) {
      setTableMode(false)
    }
  }, [productData])

  const handleViewMode = async (item) => {
    // If product exists, switch to chart view of that particular product, 
    // else return all products of the previously selected period
    if (item.product_uuid) {
      let [start, end] = item.dateRange
      let result = await AnalyticsApiHelper.getProductMonthlyInsights(item.product_uuid, start, end)
      setProductData({
        info: data.filter((x) => x.product_uuid === item.product_uuid)[0],
        dateRange: item.dateRange,
        data: result
      })
    } else {
      setTableMode(true)
    }
  }

  return (
    <>
      <MyCard style={{ margin: '3px' }}>
        <Typography>Product Analytics displays a list of all the products with the following information during the period below:
          <ul><li><span style={{ color: "#1890ff", fontWeight: "bold" }}>Quantity Sold</span>: Number sold during the period</li>
            <li><span style={{ color: "#1890ff", fontWeight: "bold" }}>Average Cost of Goods Sold</span>: Average price paid to suppliers.</li>
            <li><span style={{ color: "#1890ff", fontWeight: "bold" }}>Average Selling Price</span>: Average price paid by customers.</li>
            <li><span style={{ color: "#1890ff", fontWeight: "bold" }}>Contribution Value</span>: Average Selling Price less Average Cost of Goods Sold.</li>
            <li><span style={{ color: "#1890ff", fontWeight: "bold" }}>Total Contribution Value</span>: Quantity Sold multiplied by Contribution Value.</li>
            <li><span style={{ color: "#1890ff", fontWeight: "bold" }}>Inventory Turnover Ratio</span>: Number of times an inventory has been sold and replaced during a given period, calculated by: <span style={{ fontFamily: "monospace", backgroundColor: "lightgrey", borderRadius: "5px", padding: "0 5px" }}>2 * Average Cost of Goods Sold / (Beginning Inventory + Ending Inventory)</span> for each product.</li></ul>
          These financial metrics help to make better decision on pricing, minimising inventory holding costs, and procurement of new inventory.
        </Typography>
      </MyCard>
      {loading
        ? <div />
        : <>
          {tableMode
            ? <ProductAnalyticsTable
              data={data}
              dateRange={dateRange}
              handleViewMode={handleViewMode}
            />
            :
            <>
              <ProductAnalyticsGraph
                data={productData}
                dateRange={dateRange}
                handleViewMode={handleViewMode}
              />
            </>
          }
        </>
      }
    </>
  )
}