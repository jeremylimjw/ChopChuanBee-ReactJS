import React, { useEffect, useState } from 'react';
import { Tabs, Form, Button, Input, DatePicker, Space } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import InventoryReturnsTable from './InventoryReturnsTable';
import InventoryReturnsGraph from './InventoryReturnsGraph';
import moment from 'moment';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';
import { parseDate } from '../../../../utilities/datetime';

export default function InventoryReturnsData(props) {
    const { TabPane } = Tabs;
    const [searchInputForm] = Form.useForm();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const handleFinish = (values) => {
        let start_date, end_date;
        if (values.date && values.date[0] && values.date[1]) {
            start_date = moment(values.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(values.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }

        setStartDate(start_date);
        setEndDate(end_date);
    }

    return (
        <>
        <MyCard style={{margin: '3px'}}>
            <Form form={searchInputForm} layout='inline' onFinish={handleFinish}>
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
            <MyToolbar title={'Inventory Returns from ' + parseDate(props.oneYearAgo) + ' to ' + parseDate(props.currDate)}></MyToolbar>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='Graph' key='1'>
                    <InventoryReturnsGraph />
                </TabPane>
                <TabPane tab='Table' key='2'>
                    <InventoryReturnsTable startDate={startDate} endDate={endDate}/>
                </TabPane>
            </Tabs>
        </MyCard>
        </>
    )
}