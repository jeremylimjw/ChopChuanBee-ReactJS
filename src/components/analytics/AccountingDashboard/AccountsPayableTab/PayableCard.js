import React, { useEffect, useState } from 'react';
import { Typography, Space, Divider, Row, Spin, Tooltip } from 'antd';
import MyCard from '../../../common/MyCard';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';
import { formatCurrency } from '../../../../utilities/currency';
import { parseDateTime } from '../../../../utilities/datetime';
import { Link } from 'react-router-dom';

export default function PayableCard(props) {
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();
    const [highestInvoiceAPAmt, setHighestInvoiceAPAmt] = useState();
    const [highestInvoiceAPID, setHighestInvoiceAPID] = useState();
    const [highestInvoiceAPSupplier, setHighestInvoiceAPSupplier] = useState();
    const [highestSupplierAPAmt, setHighestSupplierAPAmt] = useState();
    const [highestSupplierAPName, setHighestSupplierAPName] = useState();
    const [highestSupplierAPID, setHighestSupplierAPID] = useState();
    
    useEffect(() => {
        AnalyticsApiHelper.getPayableInvoices()
            .then(result => { 
                setHighestInvoiceAPAmt(result[0]["sum"]); 
                setHighestInvoiceAPID(result[0]["id"]); 
                setHighestInvoiceAPSupplier(result[0]["company_name"]); })
            .catch(handleHttpError);
        AnalyticsApiHelper.getPayableSuppliers()
            .then(result => { 
                setHighestSupplierAPAmt(result[0]["total_ap_amount"]); 
                setHighestSupplierAPName(result[0]["company_name"]);
                setHighestSupplierAPID(result[0]["supplier_uuid"]);
             })
            .catch(handleHttpError);
        setLoading(false);
    }, [handleHttpError, loading])

    return (
    <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>

        <Space direction='horizontal' wrap>
            <MyCard style={{minWidth:'250px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>HIGHEST OUTSTANDING INVOICE AMOUNT</Typography>
                <Typography.Title level={2} style={{margin:0}}>
                    { loading 
                        ? <Spin /> 
                        : <><Tooltip title="Click to view invoice"><Link to={`/supplier/procurements/${highestInvoiceAPID}`}> {formatCurrency(highestInvoiceAPAmt)} </Link></Tooltip></>
                    }
                </Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>OWING TO</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{highestInvoiceAPSupplier}</Typography>
                </Row>
                <Row>
                </Row>
            </MyCard>

            <MyCard style={{minWidth:'250px', marginLeft: '3px', marginBottom: 0}}>
                <Typography>HIGHEST OUTSTANDING ACCOUNTS PAYABLE</Typography>
                <Typography.Title level={2} style={{margin:0}}>
                    { loading 
                        ? <Spin /> 
                        : <><Tooltip title="Click to view supplier"><Link to={`/supplier/suppliers/${highestSupplierAPID}`}> {highestSupplierAPName} </Link></Tooltip></>
                    }
                </Typography.Title>
                <Divider style={{margin:'0.5rem 0'}}/>
                <Row>
                    <Typography style={{fontSize:'0.8rem', marginRight: 'auto'}}>TOTAL AMOUNT OWED</Typography>
                    <Typography style={{fontSize:'0.8rem', marginLeft: 'auto'}}>{ loading ? <Spin /> : formatCurrency(highestSupplierAPAmt)}</Typography>
                </Row>
            </MyCard>
        </Space>
    </>
    )
}