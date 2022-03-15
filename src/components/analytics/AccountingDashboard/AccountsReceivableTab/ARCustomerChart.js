import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function ARCustomerChart(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const { handleHttpError, hasWriteAccessTo } = useApp();

    useEffect(() => {        
        setLoading(true);

        AnalyticsApiHelper.getReceivableCustomers()
            .then(result => { setData(result) })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

    }, [handleHttpError, setLoading]);

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
        meta: {
            company_name: {
                alias: 'Customer Company Name',
            },
            total_ar_amount: {
                alias: 'Accounts Receivable',
            },
        },
    };

    return <Column {...config} />;
}
