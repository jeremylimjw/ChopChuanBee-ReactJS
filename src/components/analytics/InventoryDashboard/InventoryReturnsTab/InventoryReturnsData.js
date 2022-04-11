import React, { useState } from 'react';
import { Tabs, Form, Button, DatePicker, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import moment from 'moment';
import { parseDate } from '../../../../utilities/datetime';
import { REQUIRED } from "../../../../utilities/form";
import InventoryReturnsCard from './InventoryReturnsCard';
import InventoryReturnsTable from './InventoryReturnsTable';
import InventoryReturnsGraph from './InventoryReturnsGraph';

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
            <Typography>The Inventory Returns chart displays <span style={{color:"#1890ff", fontWeight:"bold"}}>a list of products that have been returned to our suppliers</span>, along with its corresponding quantity and value, during the period below.</Typography>
            <Form form={searchInputForm} layout='inline' onFinish={handleFinish} style={{marginTop: "20px"}}>
                <Form.Item name="date" rules={[REQUIRED]}>
                    <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currDate, dateFormat)]} />
                </Form.Item>
                
                <Form.Item name="button" style={{marginLeft: '20px'}}>
                    <Button type="primary" htmlType="submit"> Analyse </Button>
                </Form.Item>
            </Form>
        </MyCard>

        <InventoryReturnsCard userInput={userInput} startDate={startDate} endDate={endDate} />

        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title={'Inventory Returns From ' + parseDate(startDate) + ' to ' + parseDate(endDate)}></MyToolbar>
            <Tabs defaultActiveKey='1' type="card">
                <TabPane tab='Graph' key='1'>
                    <InventoryReturnsGraph userInput={userInput} setUserInput={setUserInput} startDate={startDate} endDate={endDate}/>
                </TabPane>
                <TabPane tab='Table' key='2'>
                    <InventoryReturnsTable userInput={userInput} setUserInput={setUserInput} startDate={startDate} endDate={endDate}/>
                </TabPane>
            </Tabs>
        </MyCard>
        </>
    )
}