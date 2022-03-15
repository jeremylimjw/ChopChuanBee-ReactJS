import React, { useEffect, useState } from 'react';
import { Tabs, Form, Button, Input, DatePicker, Space } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import CustomerAnalyticsTable from './CustomerAnalyticsTable';
import CustomerAnalyticsGraph from './CustomerAnalyticsGraph';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import moment from 'moment';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';

export default function CustomerAnalyticsData() {
    const { TabPane } = Tabs;
    const [searchInputForm] = Form.useForm();
    const [customerName, setCustomerName] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const handleFinish = (values) => {
        let start_date, end_date;
        if (values.date && values.date[0] && values.date[1]) {
            start_date = moment(values.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(values.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }

        setCustomerName(values.name);
        setStartDate(start_date);
        setEndDate(end_date);
    }

    return (
        <>
        <MyCard style={{margin: '3px'}}>
            <Form form={searchInputForm} layout='inline' onFinish={handleFinish}>
                <Form.Item name="name">
                    <Input placeholder='Search Customer Name' suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
                <Form.Item name="date">
                    <DatePicker.RangePicker />
                </Form.Item>
                
                <Space direction='horizontal' wrap >
                    <Button onClick={searchInputForm.resetFields()}>Reset</Button>
                    <Form.Item name="date">
                    <Button type="primary" htmlType="submit"> Analyse </Button>
                    </Form.Item>
                </Space>
            </Form>
        </MyCard>

        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='Customer Profitability'></MyToolbar>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='Graph' key='1'>
                    <CustomerAnalyticsGraph />
                </TabPane>
                <TabPane tab='Table' key='2'>
                    <CustomerAnalyticsTable customerName={customerName} startDate={startDate} endDate={endDate}/>
                </TabPane>
            </Tabs>
        </MyCard>
        </>
    )
}