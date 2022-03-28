import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { useApp } from '../../../../providers/AppProvider';
import { parseDateTime } from '../../../../utilities/datetime';

export default function CustomerAnalyticsCard(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError } = useApp();

    useEffect(() => {
        setLoading(true);
    }, [handleHttpError, loading])

    return (
    <>
        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'250px', marginLeft: '3px'}}>
                <Typography>MOST PROFITABLE CUSTOMER</Typography>
                <Typography.Title level={2} style={{margin:0}}>Customer E</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TOTAL PROFITS</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>$6,800.00</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'250px', marginLeft: '3px'}}>
                <Typography>HIGHEST SALES AMOUNT</Typography>
                <Typography.Title level={2} style={{margin:0}}>$3,000.00</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>SOLD TO</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>Customer E</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}