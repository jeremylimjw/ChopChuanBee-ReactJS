import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function ARCustomerChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { handleHttpError } = useApp();

    useEffect(() => {        
        setLoading(true);

        AnalyticsApiHelper.getReceivableInvoices()
            .then(result => { 
                result.map(x => { 
                    x.sum = parseFloat(x.sum) * -1;
                    x.id = "#" + x.id;
                    return x;
                } ); 
                var ReverseArray = [];
                var length = result.length;
                for(var i = length - 1; i >= 0; i--){
                    ReverseArray.push(result[i]);
                }
                setData(ReverseArray);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));
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
                text: "Sales Order ID",
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
            fields: ['id', 'sum'],
            showTitle: false,
        },
        meta: {
            id: {
                alias: 'Sales Order ID',
            },
            sum: {
                alias: 'Accounts Receivable',
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
        },
    };

    return <Column {...config} />;
}