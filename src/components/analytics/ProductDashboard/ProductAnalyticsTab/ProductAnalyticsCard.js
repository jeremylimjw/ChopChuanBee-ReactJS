import React, { useEffect, useState } from 'react';
import { Divider, Row, Space, Typography } from 'antd';
import MyCard from '../../../common/MyCard';

export default function ProductAnalyticsCard(props) {
    return (
        <>
            <Space direction='horizontal' wrap>

                <MyCard style={{ minWidth: '250px', marginLeft: '3px' }}>
                    <Typography>{props.title}</Typography>
                    <Typography.Title level={2} style={{ margin: 0 }}>{props.indicatorValue}</Typography.Title>
                    <Divider style={{ margin: '0.5rem 0' }} />
                    <Row>

                    </Row>
                </MyCard>
            </Space>
        </>
    )
}