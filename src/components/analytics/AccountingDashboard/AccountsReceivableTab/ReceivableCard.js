import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import { formatCurrency } from '../../../../utilities/currency';

export default function ReceivableCard(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [highestInvoiceARAmt, setHighestInvoiceARAmt] = useState();
    const [highestInvoiceARID, setHighestInvoiceARID] = useState();
    const [highestCustomerARAmt, setHighestCustomerARAmt] = useState();
    const [highestCustomerARName, setHighestCustomerARName] = useState();

    useEffect(() => {
        setLoading(true);
        AnalyticsApiHelper.getReceivableInvoices()
            .then(result => { setHighestInvoiceARAmt(result[9]["sum"] * -1); setHighestInvoiceARID(result[9]["customer_invoice_id"]); })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    
        AnalyticsApiHelper.getReceivableCustomers()
            .then(result => { setHighestCustomerARAmt(result[0]["total_ar_amount"]); setHighestCustomerARName(result[0]["company_name"]); })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }, [handleHttpError, setLoading])
    
    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + props.currTime}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'250px', marginLeft: '3px'}}>
                <Typography>HIGHEST OUTSTANDING AMOUNT</Typography>
                <Typography.Title level={2} style={{margin:0}}>{formatCurrency(highestInvoiceARAmt)}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>OWING FROM</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>Customer ABC</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'250px', marginLeft: '3px'}}>
                <Typography>HIGHEST ACCOUNTS RECEIVABLE</Typography>
                <Typography.Title level={2} style={{margin:0}}>{highestCustomerARName}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TOTAL AMOUNT OWED</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{formatCurrency(highestCustomerARAmt)}</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}