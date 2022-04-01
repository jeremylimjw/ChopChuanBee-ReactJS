import React, { useEffect, useState, useCallback } from 'react';
import ProductAnalyticsTable from './ProductAnalyticsTable';
import { Form, Input, DatePicker, Space, Button, Select } from 'antd';
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
            <Form form={searchInputForm} layout='inline' onFinish={handleFinish}>
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