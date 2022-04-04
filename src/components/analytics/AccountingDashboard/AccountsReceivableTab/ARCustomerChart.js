import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function ARCustomerChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();

    useEffect(() => {        
        AnalyticsApiHelper.getReceivableCustomers()
            .then(result => { 
                result.map(x => { 
                    x.total_ar_amount = parseFloat(x.total_ar_amount) * -1;
                    return x;
                }); 
                setData(result);
                setLoading(false);
            })
            .catch(handleHttpError);
    }, [handleHttpError, loading]);

    const config = {
        data,
        xField: 'company_name',
        yField: 'total_ar_amount',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            title: {
                text: "Customer Name",
                style: {
                    fill: "black",
                    fillOpacity: 0.5,
                    stroke: "black",
                },
            },
            label: {
                autoHide: true,
                autoRotate: true,
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
            fields: ['total_ar_amount', 'company_name', 'p1_name'],
            showTitle: false,
        },
        meta: {
            company_name: {
                alias: 'Customer Company Name',
            },
            total_ar_amount: {
                alias: 'Accounts Receivable',
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
            p1_name: {
                alias: 'Contact Person Name',
            }
        },
    };

    return <> { data.length === 0 ? "" : <Column {...config} style={{marginTop:"50px"}}/> } </>;
}
