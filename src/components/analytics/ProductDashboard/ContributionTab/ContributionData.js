import React, { useState } from 'react';
import { Form, Button, DatePicker, Space } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import moment from 'moment';
import { parseDate } from '../../../../utilities/datetime';
import { REQUIRED } from "../../../../utilities/form";
import ContributionCard from './ContributionCard';
import ContributionChart from './ContributionChart';

export default function ContributionData(props) {
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
                <Form.Item name="date" rules={[REQUIRED]}>
                    <DatePicker.RangePicker defaultValue={[moment(props.oneYearAgo, dateFormat), moment(props.currDate, dateFormat)]} />
                </Form.Item>
                
                <Form.Item name="button" style={{marginLeft: '20px'}}>
                    <Button type="primary" htmlType="submit"> Analyse </Button>
                </Form.Item>
            </Form>
        </MyCard>

        <ContributionCard userInput={userInput} startDate={startDate} endDate={endDate} />
        <ContributionChart userInput={userInput} setUserInput={setUserInput} startDate={startDate} endDate={endDate}/>
        </>
    )
}