import React, { useState } from 'react';
import { Tabs, Form, Button, Input, DatePicker, Space } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import InventoryReturnsTable from './InventoryReturnsTable';
import InventoryReturnsGraph from './InventoryReturnsGraph';
import moment from 'moment';
import { parseDate } from '../../../../utilities/datetime';
import InventoryReturnsCard from './InventoryReturnsCard';

export default function InventoryReturnsData(props) {
    const { TabPane } = Tabs;
    const [searchInputForm] = Form.useForm();
    const [startDate, setStartDate] = useState(props.oneYearAgo);
    const [endDate, setEndDate] = useState(props.currDate);
    const [userInput, setUserInput] = useState(false);

    const handleFinish = (values) => {
        let start_date, end_date;
        if (values.date && values.date[0] && values.date[1]) {
            start_date = moment(values.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(values.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        setStartDate(start_date);
        setEndDate(end_date);
        setUserInput(true);
    };

    const dateFormat = 'YYYY/MM/DD';

    return (
        <>
        <MyCard style={{margin: '3px'}}>
            <Form form={searchInputForm} layout='inline' onFinish={handleFinish}>
                <Form.Item name="date">
                    <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currDate, dateFormat)]} />
                </Form.Item>
                
                <Space direction='horizontal' wrap >
                    <Form.Item name="button">
                        <Button type="primary" htmlType="submit"> Analyse </Button>
                    </Form.Item>
                </Space>
            </Form>
        </MyCard>

        <InventoryReturnsCard userInput={userInput} startDate={startDate} endDate={endDate} />

        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title={'Inventory Returns from ' + parseDate(props.oneYearAgo) + ' to ' + parseDate(props.currDate)}></MyToolbar>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='Graph' key='1'>
                    <InventoryReturnsGraph userInput={userInput} startDate={startDate} endDate={endDate}/>
                </TabPane>
                <TabPane tab='Table' key='2'>
                    <InventoryReturnsTable userInput={userInput} startDate={startDate} endDate={endDate}/>
                </TabPane>
            </Tabs>
        </MyCard>
        </>
    )
}