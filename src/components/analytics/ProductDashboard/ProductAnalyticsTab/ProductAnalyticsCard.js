import React, { useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import MyCard from '../../../common/MyCard';

export default function ProductAnalyticsCard(props) {
    return (
        <>
        <Space direction='horizontal' wrap>
            {/* Dummy Data for now, have not implemented the relevant API methods to get product inventory returns, sales returns, damaged goods qty and inventory turnover by product name in the backend yet*/}

            <MyCard style={{minWidth:'210px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>INVENTORY RETURNS QTY</Typography>
                <Typography.Title level={2} style={{margin:0}}>12</Typography.Title>
            </MyCard>

            <MyCard style={{minWidth:'210px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>SALES RETURNS QTY</Typography>
                <Typography.Title level={2} style={{margin:0}}>5</Typography.Title>
            </MyCard>

            <MyCard style={{minWidth:'210px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>DAMAGED GOODS QTY</Typography>
                <Typography.Title level={2} style={{margin:0}}>0</Typography.Title>
            </MyCard>

            <MyCard style={{minWidth:'210px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>INVENTORY TURNOVER</Typography>
                <Typography.Title level={2} style={{margin:0}}>9.05</Typography.Title>
            </MyCard>
        </Space>
        </>
    )
}