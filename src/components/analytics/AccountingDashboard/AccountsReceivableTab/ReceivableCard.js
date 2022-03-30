import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row, Spin } from 'antd';
import MyCard from '../../../common/MyCard';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import { formatCurrency } from '../../../../utilities/currency';
import { parseDateTime } from '../../../../utilities/datetime';
import { Link } from 'react-router-dom';

export default function ReceivableCard(props) {
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();
    const [highestInvoiceARAmt, setHighestInvoiceARAmt] = useState();
    const [highestInvoiceARID, setHighestInvoiceARID] = useState(); 
    const [highestInvoiceARCustomer, setHighestInvoiceARCustomer] = useState(); 
    const [highestCustomerARAmt, setHighestCustomerARAmt] = useState();
    const [highestCustomerARName, setHighestCustomerARName] = useState();

    useEffect(() => {
        AnalyticsApiHelper.getReceivableInvoices()
            .then(result => { 
                setHighestInvoiceARAmt(result[9]["sum"] * -1); 
                setHighestInvoiceARID(result[9]["id"]);
                setHighestInvoiceARCustomer(result[9]["company_name"]);
             })
            .catch(handleHttpError);
        AnalyticsApiHelper.getReceivableCustomers()
            .then(result => { 
                setHighestCustomerARAmt(result[0]["total_ar_amount"] * -1); 
                setHighestCustomerARName(result[0]["company_name"]); 
            })
            .catch(handleHttpError);
        setLoading(false);
    }, [handleHttpError, loading])
    
    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'250px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>HIGHEST OUTSTANDING AMOUNT</Typography>
                <Typography.Title level={2} style={{margin:0}}>{ loading ? <Spin /> : formatCurrency(highestInvoiceARAmt)}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>OWING FROM</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{highestInvoiceARCustomer}</Typography>
                </Row>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>INVOICE FROM</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>
                        <Link to={`/customer/sales/${highestInvoiceARID}`}>
                            {"Sales Order #" + highestInvoiceARID}
                        </Link>
                    </Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'250px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>HIGHEST ACCOUNTS RECEIVABLE</Typography>
                <Typography.Title level={2} style={{margin:0}}>{ loading ? <Spin /> : highestCustomerARName}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TOTAL AMOUNT OWED</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{ loading ? <Spin /> : formatCurrency(highestCustomerARAmt)}</Typography>
                </Row>
                <Row style={{height: '1.3rem'}}></Row>
            </MyCard>
        </Space>
    </>
    )
}