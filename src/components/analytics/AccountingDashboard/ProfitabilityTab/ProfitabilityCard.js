import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import moment from 'moment';

export default function ProfitabilityCard(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [thisMonthProfit, setThisMonthProfit] = useState();
    const [lastMonthProfit, setLastMonthProfit] = useState();
    const [todayProfit, setTodayProfit] = useState();

    //This Month
    // const currMonthStartDay = moment().startOf('month').toDate();
    // const currMonthEndDay = moment().endOf('month').toDate();

    //Today
    // const currDateStartTime = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    // const currTime = moment().toDate();

    //For Testing: This Month is March 2021
    const march2021start = moment("03-01-2021").toDate();
    const march2021end = moment("03-31-2021").toDate();

    //For Testing: Today is March 14 2021
    const testTodayStartTime = moment("03-14-2021").toDate();
    const testTodayCurrTime = moment("03-14-2021").set({ hour: 15, minute: 48, second: 35, millisecond: 0 }).toDate();

    useEffect(() => { 
        setLoading(true);
        AnalyticsApiHelper.getProfits(march2021start, march2021end)
            .then(result => { console.log("this month profits: " + result); setThisMonthProfit(result) })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

        AnalyticsApiHelper.getProfits(testTodayStartTime, testTodayCurrTime)
            .then(result => { console.log("today profits: " + result); setTodayProfit(result) })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

    },[handleHttpError, setLoading])

    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + props.currTime}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'220px', marginLeft: '3px'}}>
                <Typography>THIS MONTH COGS</Typography>
                <Typography.Title level={2} style={{margin:0}}>$1,200.00</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}><CaretDownFilled style={{color:'red'}}/>10% from last month</Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY COGS</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$96.00</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px', marginLeft: '3px'}}>
                <Typography>THIS MONTH REVENUE</Typography>
                <Typography.Title level={2} style={{margin:0}}>$5,600.00</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}><CaretUpFilled style={{color:'green'}}/>5% from last month</Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY REVENUE</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$300.00</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px', marginLeft: '3px'}}>
                <Typography>THIS MONTH PROFITS</Typography>
                <Typography.Title level={2} style={{margin:0}}>$5,000.00</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}><CaretUpFilled style={{color:'green'}}/>5% from last month</Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY PROFITS</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$200.00</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}