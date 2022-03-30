import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function APInvoiceChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();

    useEffect(() => {        
        AnalyticsApiHelper.getPayableInvoices()
            .then(result => { 
                result.map(x => { 
                    x.sum = parseFloat(x.sum);
                    x.id = "#" + x.id;
                    return x;
                }); 
                setData(result);
                setLoading(false);
            })
            .catch(handleHttpError);

    }, [handleHttpError, loading]);

    const config = {
        data,
        xField: 'id',
        yField: 'sum',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            title: {
                text: "Purchase Order ID",
                style: {
                    fill: "black",
                    fillOpacity: 0.5,
                    stroke: "black",
                },
            },
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        yAxis: {
            title: {
                text: "Amount (SGD)",
                style: {
                    fill: "black",
                    fillOpacity: 0.5,
                    stroke: "black",
                },
            },
            label: {
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
        },
        tooltip: {
            fields: ['id', 'supplier_invoice_id', 'sum', 'company_name', 'contact_person_name'],
            showTitle: false,
        },
        meta: {
            id: {
                alias: 'Purchase Order ID',
            },
            sum: {
                alias: 'Accounts Payable',
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
            supplier_invoice_id: {
                alias: 'Supplier Invoice ID',
            },
            company_name: {
                alias: 'Supplier Company Name',
            },
            contact_person_name: {
                alias: 'Contact Person Name',
            },
        },
    };

    return <Column {...config} />;
}
