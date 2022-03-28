import React, { useState, useEffect } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { parseDateTime } from '../../../../utilities/datetime';
import { formatCurrency } from '../../../../utilities/currency';

export default function ContributionCard(props) {
    const { handleHttpError } = useApp();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AnalyticsApiHelper.getProductAnalytics(props.oneYearAgo, props.currDate)
          .then((results) => {
            results.map((x) => {
              x.total_contribution = parseFloat(x.total_contribution);
              return x;
            });
            setData(results[0]);
            setLoading(false);
          })
          .catch(handleHttpError);
      }, [handleHttpError, loading]);

    return (
        <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>ALL TIME HIGHEST CONTRIBUTION</Typography>
                <Typography.Title level={2} style={{margin:0}}>{data.product_name}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>Total Contribution</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{formatCurrency(data.total_contribution)}</Typography>
                </Row>
            </MyCard>
        </Space>
        </>
    )
}