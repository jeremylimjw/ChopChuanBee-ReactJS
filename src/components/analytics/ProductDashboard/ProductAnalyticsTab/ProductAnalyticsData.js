import React, { useEffect, useState } from 'react';
import ProductAnalyticsTable from './ProductAnalyticsTable';
import { Form, Input, DatePicker, Space, Button } from 'antd';
import MyCard from '../../../common/MyCard';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import ProductAnalyticsCard from './ProductAnalyticsCard';
import ProductAnalyticsGraph from './ProductAnalyticsGraph';

export default function ProductAnalyticsData(props) {
    const [searchInputForm] = Form.useForm();
    const [productAnalysed, setProductAnalysed] = useState();

    useEffect(() => {
        setProductAnalysed('Product ABC');
    }, [])

    const handleFinish = (values) => {}

    const dateFormat = 'YYYY/MM/DD';

    return (
    <>
        <MyCard style={{margin: '3px'}}>
            <Form form={searchInputForm} layout='inline' onFinish={handleFinish}>
                <Form.Item name="name">
                    <Input placeholder={productAnalysed ? productAnalysed : 'Search Product Name'} suffix={<SearchOutlined className='grey' />} />
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

        {productAnalysed ? <><ProductAnalyticsCard /> <ProductAnalyticsGraph oneYearAgo={props.oneYearAgo} currDate={props.currDate} /></> : ""}
        <ProductAnalyticsTable oneYearAgo={props.oneYearAgo} currDate={props.currDate} />
    </>
    )
}