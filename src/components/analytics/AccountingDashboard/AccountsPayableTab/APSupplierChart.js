import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import { useApp } from '../../../../providers/AppProvider';

export default function APSupplierChart(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { handleHttpError, hasWriteAccessTo } = useApp();

    useEffect(() => {        
        setLoading(true);

        AnalyticsApiHelper.getPayableSuppliers()
            .then(result => { 
                var ReverseArray = [];
                var length = result.length;
                for(var i = length - 1; i >= 0; i--){
                    ReverseArray.push(result[i]);
                }
                setData(ReverseArray);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

    }, [handleHttpError, setLoading]);

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
