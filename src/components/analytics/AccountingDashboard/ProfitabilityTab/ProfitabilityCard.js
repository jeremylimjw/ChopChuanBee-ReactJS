import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { parseDateTime } from '../../../../utilities/datetime';

export default function ProfitabilityCard(props) {
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();
    const [cogsMonth, setCogsMonth] = useState();
    // const [cogsDay, setCogsDay] = useState();
    const [revMonth, setRevMonth] = useState();
    // const [revDay, setRevDay] = useState();
    const [profMonth, setProfMonth] = useState();
    // const [profDay, setProfDay] = useState();

    // const cogsMonth = [];

    useEffect(() => {
        const startOfMonth = props.currDate.startOf('month').toDate();
        const endOfMonth = props.currDate.endOf('month').toDate();
        const getData = async () => {
            // const startOfLastMonth = props.currDate.startOf('month').subtract(1, "month").toDate();
            // const endOfLastMonth = props.currDate.endOf('month').toDate();
    
            // const currDayTime = props.currTime.toDate();
            // const startOfDay = props.currDate.toDate();
    
            let cogsThisMonth = await AnalyticsApiHelper.getCOGS(startOfMonth, endOfMonth);
            cogsThisMonth.map(x => { 
                x.value = x.value >= 0 ? 0 : parseFloat(x.value);
                return x;
            });
            setCogsMonth(cogsThisMonth[0]);
            // cogsMonth.push(cogsThisMonth[0]);
    
            let revThisMonth = await AnalyticsApiHelper.getRevenue(startOfMonth, endOfMonth);
            revThisMonth.map(x => { 
                x.value = x.value <= 0 ? 0 : parseFloat(x.value);
                return x;
            });
            setRevMonth(revThisMonth[0]);
    
            let profThisMonth = await AnalyticsApiHelper.getProfits(startOfMonth, endOfMonth);
            profThisMonth.map(x => { 
                x.value = x.value <= 0 ? 0 : parseFloat(x.value); 
                return x;
            });
            setProfMonth(profThisMonth[0]);
            setLoading(false);
        }
        getData();
    },[handleHttpError, loading]);

    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>THIS MONTH COGS</Typography>
                <Typography.Title level={2} style={{margin:0}}>$1,200.00</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}><CaretDownFilled style={{color:'red'}}/>10% from last month</Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY COGS</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$96.00</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>THIS MONTH REVENUE</Typography>
                <Typography.Title level={2} style={{margin:0}}>$5,600.00</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}><CaretUpFilled style={{color:'green'}}/>5% from last month</Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY REVENUE</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$300.00</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
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