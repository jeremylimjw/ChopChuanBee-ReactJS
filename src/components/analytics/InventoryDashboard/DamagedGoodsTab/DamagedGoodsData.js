import React, { useState } from 'react';
import { Tabs, Form, Button, DatePicker, Space } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import moment from 'moment';
import { parseDate } from '../../../../utilities/datetime';
import DamagedGoodsCard from './DamagedGoodsCard';
import DamagedGoodsTable from './DamagedGoodsTable';
import DamagedGoodsGraph from './DamagedGoodsGraph';

export default function DamagedGoodsData(props) {
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

        <DamagedGoodsCard userInput={userInput} startDate={startDate} endDate={endDate} />

        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title={'Sales Returns from ' + parseDate(props.oneYearAgo) + ' to ' + parseDate(props.currDate)}></MyToolbar>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='Graph' key='1'>
                    <DamagedGoodsGraph userInput={userInput} startDate={startDate} endDate={endDate}/>
                </TabPane>
                <TabPane tab='Table' key='2'>
                    <DamagedGoodsTable userInput={userInput} startDate={startDate} endDate={endDate}/>
                </TabPane>
            </Tabs>
        </MyCard>
        </>
    )
}