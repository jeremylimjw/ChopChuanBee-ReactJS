import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row } from 'antd';
import MyCard from '../../../common/MyCard';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import { formatCurrency } from '../../../../utilities/currency';

export default function PayableCard(props) {
    const [loading, setLoading] = useState(false);
    const { handleHttpError, hasWriteAccessTo } = useApp();
    const [highestInvoiceAPAmt, setHighestInvoiceAPAmt] = useState();
    const [highestInvoiceAPID, setHighestInvoiceAPID] = useState();
    const [highestSupplierAPAmt, setHighestSupplierAPAmt] = useState();
    const [highestSupplierAPName, setHighestSupplierAPName] = useState();

    useEffect(() => {
        setLoading(true);
        AnalyticsApiHelper.getPayableInvoices()
            .then(result => { setHighestInvoiceAPAmt(result[0]["sum"]); setHighestInvoiceAPID(result[0]["supplier_invoice_id"]); })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    
        AnalyticsApiHelper.getPayableSuppliers()
            .then(result => { setHighestSupplierAPAmt(result[0]["total_ap_amount"]); setHighestSupplierAPName(result[0]["company_name"]); })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
    }, [handleHttpError, setLoading])

    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + props.currTime}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'250px', marginLeft: '3px'}}>
                <Typography>HIGHEST OUTSTANDING AMOUNT</Typography>
                <Typography.Title level={2} style={{margin:0}}>{formatCurrency(highestInvoiceAPAmt)}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>OWING TO</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>Supplier ABC</Typography>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'250px'}}>
                <Typography>HIGHEST ACCOUNTS PAYABLE</Typography>
                <Typography.Title level={2} style={{margin:0}}>{highestSupplierAPName}</Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TOTAL AMOUNT OWED</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{formatCurrency(highestSupplierAPAmt)}</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}