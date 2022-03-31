import React, { useState, useEffect } from 'react';
import { Typography, Space, Divider, Row, Spin, Tooltip } from 'antd';
import MyCard from '../../../common/MyCard';
import { useApp } from '../../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { formatCurrency } from "../../../../utilities/currency";
import { Link } from 'react-router-dom';

export default function ContributionCard(props) {
    const { handleHttpError } = useApp();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AnalyticsApiHelper.getProductAnalytics(props.startDate, props.endDate)
          .then((results) => {
            results.map((x) => {
              x.contribution_margin = parseFloat(x.contribution) / parseFloat(x.average_selling_price) * 100;
              return x;
            });
            setData(results[0]);
            setLoading(false);
          })
          .catch(handleHttpError);
      }, [handleHttpError, loading, props.userInput]);

    return (
        <>
        { data == null ? "" : 
        <>
        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'220px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>HIGHEST CONTRIBUTION MARGIN</Typography>
                <Typography.Title level={2} style={{margin:0}}>
                  { loading 
                      ? <Spin /> 
                      : <><Tooltip title="Click to view product"><Link to={`/inventory/products/${data.product_uuid}`}> {data.product_name} </Link></Tooltip></>
                  }
                </Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>Contribution Margin</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{loading ? <Spin /> : data.contribution_margin.toFixed(2)}</Typography>
                </Row>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>Contribution Value</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{loading ? <Spin /> : formatCurrency(data.contribution)}</Typography>
                </Row>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>Average Selling Price</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{loading ? <Spin /> : formatCurrency(data.average_selling_price)}</Typography>
                </Row>
            </MyCard>
        </Space>
        </>
        }
        </>
    )
}