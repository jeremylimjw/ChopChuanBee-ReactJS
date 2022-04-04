import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function ARCustomerChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();

    useEffect(() => {        
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
                text: "Sales Order ID",
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
            fields: ['id', 'sum', 'company_name', 'contact_person_name'],
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
            company_name: {
                alias: 'Customer Company Name',
            },
            contact_person_name: {
                alias: 'Contact Person Name',
            },
        },
    };

    return <> { data.length === 0 ? "" : <Column {...config} style={{marginTop:"50px"}} /> } </>;
}
