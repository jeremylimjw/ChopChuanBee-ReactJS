import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';

export default function PayableCard(props) {
    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + props.currTime}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'220px', marginLeft: '3px'}}>
                <Typography>HIGHEST OUTSTANDING AMOUNT</Typography>
                <Typography.Title level={2} style={{margin:0}}>$176.00</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>OWING TO</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>Supplier ABC</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'220px'}}>
                <Typography>HIGHEST ACCOUNTS PAYABLE</Typography>
                <Typography.Title level={2} style={{margin:0}}>Supplier DEF</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TOTAL AMOUNT OWED</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$300.00</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}