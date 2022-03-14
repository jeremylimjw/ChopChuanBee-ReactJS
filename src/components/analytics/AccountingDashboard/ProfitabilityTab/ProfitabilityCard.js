import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';

export default function ProfitabilityCard(props) {
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

            <MyCard style={{minWidth:'220px'}}>
                <Typography>THIS MONTH REVENUE</Typography>
                <Typography.Title level={2} style={{margin:0}}>$5,600.00</Typography.Title>
                <Typography style={{fontSize:'0.8rem', marginTop:'1rem'}}><CaretUpFilled style={{color:'green'}}/>5% from last month</Typography>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TODAY REVENUE</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$300.00</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px'}}>
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