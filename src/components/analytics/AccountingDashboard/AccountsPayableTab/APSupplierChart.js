import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function APSupplierChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { handleHttpError } = useApp();

    useEffect(() => {        
        setLoading(true);

        AnalyticsApiHelper.getPayableSuppliers()
            .then(result => { 
                result.map(x => { 
                    x.total_ap_amount = parseFloat(x.total_ap_amount); 
                    return x;
                }); 
                setData(result);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

    }, [handleHttpError, loading]);

    const config = {
        data,
        xField: 'company_name',
        yField: 'total_ap_amount',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            title: {
                text: "Supplier Name",
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
            fields: ['company_name', 'total_ap_amount', 's1_name'],
            showTitle: false,
        },
        meta: {
            company_name: {
                alias: 'Supplier Company Name',
            },
            total_ap_amount: {
                alias: 'Accounts Payable',
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
            s1_name: {
                alias: 'Contact Person Name',
            }
        },
    };

    return <Column {...config} />;
}