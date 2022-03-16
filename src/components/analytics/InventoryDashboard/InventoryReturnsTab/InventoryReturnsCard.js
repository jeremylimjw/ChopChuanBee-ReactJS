import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import { formatCurrency } from '../../../../utilities/currency';

export default function InventoryReturnsCard(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError, hasWriteAccessTo } = useApp();

    useEffect(() => {
        setLoading(true);

    }, [handleHttpError, setLoading])

    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + props.currTime}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'250px', marginLeft: '3px'}}>
                <Typography>MOST RETURNED PRODUCT</Typography>
                <Typography.Title level={2} style={{margin:0}}>Product A</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TOTAL QUANTITY</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>80</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'250px', marginLeft: '3px'}}>
                <Typography>HIGHEST VALUE LOSS</Typography>
                <Typography.Title level={2} style={{margin:0}}>$300.00</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>FROM</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>Product F</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}