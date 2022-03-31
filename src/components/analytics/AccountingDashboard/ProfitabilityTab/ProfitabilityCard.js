import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { formatCurrency } from '../../../../utilities/currency';
import { parseDateTime } from '../../../../utilities/datetime';

export default function ProfitabilityCard(props) {
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();
    const [cogsCurrMonth, setCogsCurrMonth] = useState();
    const [cogsPrevMonth, setCogsPrevMonth] = useState();
    const [cogsToday, setCogsToday] = useState();
    const [revCurrMonth, setRevCurrMonth] = useState();
    const [revPrevMonth, setRevPrevMonth] = useState();
    const [revToday, setRevToday] = useState();
    const [profCurrMonth, setProfCurrMonth] = useState();
    const [profPrevMonth, setProfPrevMonth] = useState();
    const [profToday, setProfToday] = useState();

    useEffect(() => {
        AnalyticsApiHelper.getCOGSCurrMonth()
          .then((results) => {
              setCogsCurrMonth(results[0]["value"]); })
          .catch(handleHttpError);
        AnalyticsApiHelper.getCOGSPrevMonth()
          .then((results) => {
              setCogsPrevMonth(results[0]["value"]); })
          .catch(handleHttpError);
        AnalyticsApiHelper.getCOGSToday()
          .then((results) => {
              setCogsToday(results[0]["value"]); })
          .catch(handleHttpError);

        AnalyticsApiHelper.getRevenueCurrMonth()
          .then((results) => {
              setRevCurrMonth(results[0]["value"]); })
          .catch(handleHttpError);
        AnalyticsApiHelper.getRevenuePrevMonth()
          .then((results) => {
              setRevPrevMonth(results[0]["value"]); })
          .catch(handleHttpError);
        AnalyticsApiHelper.getRevenueToday()
          .then((results) => {
              setRevToday(results[0]["value"]); })
          .catch(handleHttpError);

        AnalyticsApiHelper.getProfitsCurrMonth()
          .then((results) => {
              setProfCurrMonth(results[0]["value"]); })
          .catch(handleHttpError);
        AnalyticsApiHelper.getProfitsPrevMonth()
          .then((results) => {
              setProfPrevMonth(results[0]["value"]); })
          .catch(handleHttpError);
        AnalyticsApiHelper.getProfitsToday()
          .then((results) => {
              setProfToday(results[0]["profits"]); })
          .catch(handleHttpError);

          setLoading(false);
    },[handleHttpError, loading]);

    const cogsDiff = ((parseFloat(cogsCurrMonth) - parseFloat(cogsPrevMonth)) / parseFloat(cogsPrevMonth) * 100).toFixed(2);
    const revDiff = ((parseFloat(revCurrMonth) - parseFloat(revPrevMonth)) / parseFloat(revPrevMonth) * 100).toFixed(2);
    const profDiff = ((parseFloat(profCurrMonth) - parseFloat(profPrevMonth)) / parseFloat(profPrevMonth) * 100).toFixed(2);

    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>THIS MONTH COGS</Typography>
                <Typography.Title level={2} style={{margin:0}}>{formatCurrency(cogsCurrMonth)}</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}>
                    { cogsDiff < 0 
                        ? <><CaretDownFilled style={{color:'red'}}/>{cogsDiff.substring(1, cogsDiff.length)}% from last month</>
                        : <><CaretUpFilled style={{color:'green'}}/>{cogsDiff}% from last month</>
                    }
                </Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY COGS</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{formatCurrency(cogsToday)}</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>THIS MONTH REVENUE</Typography>
                <Typography.Title level={2} style={{margin:0}}>{formatCurrency(revCurrMonth)}</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}>
                    { revDiff < 0 
                        ? <><CaretDownFilled style={{color:'red'}}/>{revDiff.substring(1, revDiff.length)}% from last month</>
                        : <><CaretUpFilled style={{color:'green'}}/>{revDiff}% from last month</>
                    }
                </Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY REVENUE</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{formatCurrency(revToday)}</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>THIS MONTH PROFITS</Typography>
                <Typography.Title level={2} style={{margin:0}}>{formatCurrency(profCurrMonth)}</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}>
                    { profDiff < 0 
                        ? <><CaretDownFilled style={{color:'red'}}/>{profDiff.substring(1, profDiff.length)}% from last month</>
                        : <><CaretUpFilled style={{color:'green'}}/>{profDiff}% from last month</>
                    }
                </Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY PROFITS</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{formatCurrency(profToday)}</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}