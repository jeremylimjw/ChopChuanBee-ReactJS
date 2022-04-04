import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row, Spin, message } from 'antd';
import MyCard from '../../../common/MyCard';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { formatCurrency } from '../../../../utilities/currency';
import { parseDate } from '../../../../utilities/datetime';

export default function ProfitabilityCard(props) {
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();
    const [revTotal, setRevTotal]= useState(0);
    const [revFinalMonth, setRevFinalMonth] = useState();
    const [revSecondFinalMonth, setRevSecondFinalMonth] = useState();
    const [cogsTotal, setCogsTotal] = useState(0);
    const [cogsFinalMonth, setCogsFinalMonth] = useState();
    const [cogsSecondFinalMonth, setCogsSecondFinalMonth] = useState();
    const [profTotal, setProfTotal]= useState(0);
    const [profFinalMonth, setProfFinalMonth] = useState();
    const [profSecondFinalMonth, setProfSecondFinalMonth] = useState();
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        fetchData();
        setLoading(false);
        checkErrorMessage();
    },[handleHttpError, loading, props.userInput]);

    const checkErrorMessage = () => {
        if (errorMessage) {
            message.error("There is no data available for this period.");
            setErrorMessage(false);
        }
    }

    const fetchData = async () => {
        // Get total revenue, cost of goods sold, and profits for the given period
        await AnalyticsApiHelper.getRevenue(props.startDate, props.endDate)
        .then((result) => {
            if (result.length === 0) {
                setErrorMessage(true);
            }
            let sum = 0;
            result.forEach(x => {
                sum = sum + parseFloat(x.value);
                return x;
            });
            setRevTotal(sum);
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getCOGS(props.startDate, props.endDate)
        .then((result) => {
            if (result.length === 0) {
                setErrorMessage(true);
            }
            let sum = 0;
            result.forEach(x => {
                sum = sum + parseFloat(x.value);
                return x;
            });
            setCogsTotal(sum);
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getProfits(props.startDate, props.endDate)
        .then((result) => {
            if (result.length === 0) {
                setErrorMessage(true);
            }
            let sum = 0;
            result.forEach(x => {
                sum = sum + parseFloat(x.value);
                return x;
            });
            setProfTotal(sum);
        })
        .catch(handleHttpError);

        // Get final month's (up to end date) revenue, cost of goods sold, and profits for the given period
        const finalMonthStart = props.endDate.clone().startOf('month').toDate();
        const finalMonthEnd = props.endDate.clone().endOf('month').toDate();

        await AnalyticsApiHelper.getRevenue(finalMonthStart, finalMonthEnd)
        .then((result) => {
            if (result.length === 0) {
                setRevFinalMonth(0);
            } else {
                setRevFinalMonth(parseFloat(result[0].value));
            }
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getCOGS(finalMonthStart, finalMonthEnd)
        .then((result) => {
            if (result.length === 0) {
                setCogsFinalMonth(0);
            } else {
                setCogsFinalMonth(parseFloat(result[0].value));
            }
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getProfits(finalMonthStart, finalMonthEnd)
        .then((result) => {
            if (result.length === 0) {
                setProfFinalMonth(0);
            } else {
                setProfFinalMonth(parseFloat(result[0].value));
            }
        })
        .catch(handleHttpError);

        // Get second final month's revenue, cost of goods sold, and profits for the given period
        const secondFinalMonthStart = props.endDate.clone().subtract(1, "month").startOf('month').toDate();
        const secondFinalMonthEnd = props.endDate.clone().subtract(1, "month").endOf('month').toDate();
        
        await AnalyticsApiHelper.getRevenue(secondFinalMonthStart, secondFinalMonthEnd)
        .then((result) => {
            if (result.length === 0) {
                setRevSecondFinalMonth(0);
            } else {
                setRevSecondFinalMonth(parseFloat(result[0].value));
            }
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getCOGS(secondFinalMonthStart, secondFinalMonthEnd)
        .then((result) => {
            if (result.length === 0) {
                setCogsSecondFinalMonth(0);
            } else {
                setCogsSecondFinalMonth(parseFloat(result[0].value));
            }
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getProfits(secondFinalMonthStart, secondFinalMonthEnd)
        .then((result) => {
            if (result.length === 0) {
                setProfSecondFinalMonth(0);
            } else {
                setProfSecondFinalMonth(parseFloat(result[0].value));
            }
        })
        .catch(handleHttpError);
    }

    let revDiff = 0;
    let cogsDiff = 0;
    let profDiff = 0;

    if (revSecondFinalMonth !== 0) {
        revDiff = ((parseFloat(revFinalMonth) - parseFloat(revSecondFinalMonth)) / parseFloat(revSecondFinalMonth) * 100).toFixed(0);
    }

    if (cogsSecondFinalMonth !== 0) {
        cogsDiff = ((parseFloat(cogsFinalMonth) - parseFloat(cogsSecondFinalMonth)) / parseFloat(cogsSecondFinalMonth) * 100).toFixed(0);
    }

    if (profSecondFinalMonth !== 0) {
        profDiff = ((parseFloat(profFinalMonth) - parseFloat(profSecondFinalMonth)) / parseFloat(profSecondFinalMonth) * 100).toFixed(0);
    }

    return (
    <>
    { revTotal || cogsTotal || profTotal ?
        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'23.5vw', marginLeft: '3px', marginRight: '3px', marginBottom: 0}}>
                <Typography>TOTAL REVENUE</Typography>
                <Typography.Title level={2} style={{margin:0}}>{loading ? <Spin/> : formatCurrency(revTotal)}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: '10px'}}>THIS MONTH (To {loading ? <Spin/> : parseDate(props.endDate)}) </Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>
                        {loading ? <Spin/> : 
                            <>
                                {revDiff < 0
                                    ? revDiff === "NaN" ? "" : <><CaretDownFilled style={{color:'red'}}/><span style={{color:'red', marginRight: '10px'}}>{revDiff.substring(1, revDiff.length)}%</span></>
                                    : revDiff === "NaN" || revDiff === 0 ? "" : <><CaretUpFilled style={{color:'green'}}/><span style={{color:'green', marginRight: '10px'}}>{revDiff}%</span></>
                                }
                                {formatCurrency(revFinalMonth)}
                            </>
                        }
                    </Typography>
                </Row>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>LAST MONTH</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{loading ? <Spin/> : formatCurrency(revSecondFinalMonth)}</Typography>
                </Row>
            </MyCard>
            
            <MyCard style={{minWidth:'23.5vw', marginLeft: '3px', marginRight: '3px', marginBottom: 0}}>
                <Typography>TOTAL COGS</Typography>
                <Typography.Title level={2} style={{margin:0}}>{loading ? <Spin/> : formatCurrency(cogsTotal)}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                <Typography style={{fontSize:'0.8rem', marginRight: '10px'}}>THIS MONTH (To {loading ? <Spin/> : parseDate(props.endDate)}) </Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>
                        {loading ? <Spin/> : 
                            <>
                                {cogsDiff < 0
                                    ? cogsDiff === "NaN" ? "" : <><CaretDownFilled style={{color:'red'}}/><span style={{color:'red', marginRight: '10px'}}>{cogsDiff.substring(1, cogsDiff.length)}%</span></>
                                    : cogsDiff === "NaN" || cogsDiff === 0 ? "" : <><CaretUpFilled style={{color:'green'}}/><span style={{color:'green', marginRight: '10px'}}>{cogsDiff}%</span></>
                                }
                                {formatCurrency(cogsFinalMonth)}
                            </>
                        }
                    </Typography>
                </Row>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>LAST MONTH</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{loading ? <Spin/> : formatCurrency(cogsSecondFinalMonth)}</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'23.5vw', marginLeft: '3px', marginBottom: 0}}>
                <Typography>TOTAL PROFITS</Typography>
                <Typography.Title level={2} style={{margin:0}}>{loading ? <Spin/> : formatCurrency(profTotal)}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                <Typography style={{fontSize:'0.8rem', marginRight: '10px'}}>THIS MONTH (To {loading ? <Spin/> : parseDate(props.endDate)}) </Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>
                        <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>
                        {loading ? <Spin/> : 
                            <>
                                {profDiff < 0
                                    ? profDiff === "NaN" ? "" : <><CaretDownFilled style={{color:'red'}}/><span style={{color:'red', marginRight: '10px'}}>{profDiff.substring(1, cogsDiff.length)}%</span></>
                                    : profDiff === "NaN" || profDiff === 0 ? "" :  <><CaretUpFilled style={{color:'green'}}/><span style={{color:'green', marginRight: '10px'}}>{profDiff}%</span></>
                                }
                                {formatCurrency(profFinalMonth)}
                            </>
                        }
                        </Typography>
                    </Typography>
                </Row>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>LAST MONTH</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{loading ? <Spin/> : formatCurrency(profSecondFinalMonth)}</Typography>
                </Row>
            </MyCard>
        </Space>
        : "" }
    </>
    )
}