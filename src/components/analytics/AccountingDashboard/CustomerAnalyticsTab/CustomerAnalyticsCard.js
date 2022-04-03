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
            <MyCard style={{ minWidth: '250px', marginLeft: '3px' }}>
                {/* <Typography>{props.title_2}</Typography> */}
                <Typography.Title level={4} style={{ margin: 0 }}>{props.title}</Typography.Title>
                <Divider style={{ margin: '0.5rem 0' }} />
                <Row>
                    <Typography style={{ fontSize: '0.8rem', marginLeft: 'auto' }}>{props.value}</Typography>
                </Row>
            </MyCard>
        </>
    )
}