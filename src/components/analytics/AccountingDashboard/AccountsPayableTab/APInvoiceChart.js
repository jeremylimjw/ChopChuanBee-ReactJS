import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function APInvoiceChart(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { handleHttpError, hasWriteAccessTo } = useApp();

    useEffect(() => {        
        setLoading(true);

        AnalyticsApiHelper.getPayableInvoices()
            .then(result => { 
                result.map(x => { x.sum = parseFloat(x.sum); } ); 
                setData(result);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

    }, [handleHttpError, setLoading]);

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
                text: "Procurement ID",
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
            fields: ['id', 'supplier_invoice_id', 'sum'],
            showTitle: false,
        },
        meta: {
            id: {
                alias: 'Procurement ID',
            },
            sum: {
                alias: 'Accounts Payable',
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
            supplier_invoice_id: {
                alias: 'Supplier Invoice ID'
            }
        },
    };

    return <Column {...config} />;
}
