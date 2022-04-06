import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { useApp } from '../../../../providers/AppProvider';
import { parseDateTime } from '../../../../utilities/datetime';

export default function CustomerAnalyticsCard(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError } = useApp();
    const start = props.period[0].format('LL')
    const end = props.period[1].format('LL')
    console.log(start)
    return (
        <>
            <MyCard style={{ minWidth: '250px', marginLeft: '3px' }}>
                <Typography>{props.title}</Typography>
                <Typography.Title level={2} style={{ margin: 0 }}>$ {props.value.toFixed('2')}</Typography.Title>
                <Divider style={{ margin: '0.5rem 0' }} />
                <Row>
                    <Typography style={{ fontSize: '0.8rem' }}>{start} - {end}</Typography>
                </Row>
            </MyCard>
        </>
    )
}