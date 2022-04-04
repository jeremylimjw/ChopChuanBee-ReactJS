import React, { useEffect, useState, useCallback } from 'react';
import ProductAnalyticsTable from './ProductAnalyticsTable';
import { Form, Input, DatePicker, Space, Button, Select, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import ProductAnalyticsCard from './ProductAnalyticsCard';
import ProductAnalyticsGraph from './ProductAnalyticsGraph';
import { useApp } from '../../../../providers/AppProvider';
import { ProductApiHelper } from '../../../../api/ProductApiHelper';

export default function ProductAnalyticsData(props) {
    const { handleHttpError } = useApp();
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [product, setProduct] = useState();
    const [searchInputForm] = Form.useForm();

    useEffect(() => {
    }, [])

    const onSearch = useCallback((name) => {
        ProductApiHelper.get({ name: name, limit: 10 })
          .then((results) => {
            setAllProducts(results)
          })
          .catch(handleHttpError);
      },
      [handleHttpError, setAllProducts])    

    const handleFinish = (values) => {}

    const dateFormat = 'YYYY/MM/DD';

    return (
    <>
        <MyCard style={{margin: '3px'}}>
        <Typography>The Product Analytics table displays a list of all the products with the following information during the period below: 
            <ul><li><span style={{color:"#1890ff", fontWeight:"bold"}}>Quantity Sold</span>.</li>
            <li><span style={{color:"#1890ff", fontWeight:"bold"}}>Average Cost of Goods Sold</span>: Average price paid to suppliers.</li>
            <li><span style={{color:"#1890ff", fontWeight:"bold"}}>Average Selling Price</span>: Average price paid by customers.</li>
            <li><span style={{color:"#1890ff", fontWeight:"bold"}}>Contribution Value</span>: Average Selling Price less Average Cost of Goods Sold.</li>
            <li><span style={{color:"#1890ff", fontWeight:"bold"}}>Total Contribution Value</span>: Quantity Sold multiplied by Contribution Value.</li>
            <li><span style={{color:"#1890ff", fontWeight:"bold"}}>Inventory Turnover Ratio</span>: Number of times an inventory has been sold and replaced during a given period, calculated by: <span style={{fontFamily:"monospace", backgroundColor:"lightgrey", borderRadius:"5px", padding:"0 5px"}}>2 * Average Cost of Goods Sold / (Beginning Inventory + Ending Inventory)</span> for each product.</li></ul>
        These financial metrics help to make better decision on pricing, minimising inventory holding costs, and procurement of new inventory.
        </Typography>
            <Form form={searchInputForm} layout='inline' onFinish={handleFinish} style={{marginTop:"20px"}}>
                <Form.Item name="product_id">
                    <Select showSearch
                        options={allProducts.map(x => ({ label: x.name, value: x.id, product: x }))}
                        placeholder="Search for Product" 
                        onSearch={onSearch}
                        onSelect={(_, option) => setProduct(option.product)}
                        filterOption={false}
                    />
                </Form.Item>
                <Form.Item name="date">
                    <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currDate, dateFormat)]} />
                </Form.Item>
                
                <Space direction='horizontal' wrap >
                    <Form.Item name="date">
                    <Button type="primary" htmlType="submit"> Analyse </Button>
                    </Form.Item>
                </Space>
            </Form>
        </MyCard>

        {product ? <><ProductAnalyticsCard /> <ProductAnalyticsGraph oneYearAgo={props.oneYearAgo} currDate={props.currDate} /></> : ""}
        <ProductAnalyticsTable oneYearAgo={props.oneYearAgo} currDate={props.currDate} />
    </>
    )
}