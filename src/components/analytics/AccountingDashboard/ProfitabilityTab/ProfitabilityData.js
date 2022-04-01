import React, { useState } from 'react';
import { Tabs, Form, Button, DatePicker } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import moment from 'moment';
import { parseDate } from '../../../../utilities/datetime';
import { REQUIRED } from "../../../../utilities/form";
import ProfitabilityCard from './ProfitabilityCard';
import ProfitabilityGraph from './ProfitabilityGraph';

export default function ProfitabilityData(props) {
    const [searchInputForm] = Form.useForm();
    const [startDate, setStartDate] = useState(props.oneYearAgo);
    const [endDate, setEndDate] = useState(props.currTime);
    const [userInput, setUserInput] = useState(false);

    const handleFinish = (values) => {
        let start_date, end_date;
        if (values.date && values.date[0] && values.date[1]) {
            start_date = moment(values.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            end_date = moment(values.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
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
                <Form.Item name="date" rules={[REQUIRED]}>
                    <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currTime, dateFormat)]} />
                </Form.Item>
                
                <Form.Item name="button" style={{marginLeft: '20px'}}>
                    <Button type="primary" htmlType="submit"> Analyse </Button>
                </Form.Item>
            </Form>
        </MyCard>

        <ProfitabilityCard userInput={userInput} startDate={startDate} endDate={endDate} />

        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title={'Profitability Trend From ' + parseDate(startDate) + ' to ' + parseDate(endDate)}></MyToolbar>
            <ProfitabilityGraph userInput={userInput} setUserInput={setUserInput} startDate={startDate} endDate={endDate}/>
        </MyCard>
        </>
    )
}