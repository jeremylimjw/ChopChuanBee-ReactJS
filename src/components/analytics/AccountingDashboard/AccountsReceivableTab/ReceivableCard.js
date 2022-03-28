import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import { formatCurrency } from '../../../../utilities/currency';
import { parseDateTime } from '../../../../utilities/datetime';

export default function ReceivableCard(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError } = useApp();
    const [highestInvoiceARAmt, setHighestInvoiceARAmt] = useState();
    const [highestInvoiceARID, setHighestInvoiceARID] = useState(); //To be used to link to the sales order page
    const [highestCustomerARAmt, setHighestCustomerARAmt] = useState();
    const [highestCustomerARName, setHighestCustomerARName] = useState(); //To be added: supplier ID to link to the customer page? (TBC since it doesn't help to link to the customer)

    useEffect(() => {
        setLoading(true);
        AnalyticsApiHelper.getReceivableInvoices()
            .then(result => { setHighestInvoiceARAmt(result[9]["sum"] * -1); setHighestInvoiceARID(result[9]["customer_invoice_id"]); })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    
        AnalyticsApiHelper.getReceivableCustomers()
            .then(result => { setHighestCustomerARAmt(result[0]["total_ar_amount"] * -1); setHighestCustomerARName(result[0]["company_name"]); })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }, [handleHttpError, loading])
    
    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>

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