import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button } from 'antd';
import { Column } from '@ant-design/plots';
import { AnalyticsApiHelper } from '../../../../api/AnalyticsApiHelper';
import debounce from 'lodash.debounce';
import moment from 'moment';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import { useApp } from '../../../../providers/AppProvider';

export default function InvoiceChart(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const { handleHttpError, hasWriteAccessTo } = useApp();

    useEffect(() => {        
        setLoading(true);

        const invoices = AnalyticsApiHelper.getPayableInvoices()
            .then(result => { console.log(result) })
            .catch(handleHttpError)
            .catch(() => setLoading(false));

        setData([invoices]);

    }, [handleHttpError, setLoading]);

    //Figure out if able to retrieve the data or not, or just rendering issue
    const initInvoices = [
        {
            type: '王静 Reed, Valentine and Howard',
            value: 20,
        },
        {
            type: '曹洁 Brooks and Sons',
            value: 15,
        },
        {
            type: '吴莹 Walker Group',
            value: 15,
        },
        {
            type: '朱霞 Williams, Lopez and Delgado',
            value: 10,
        },
        {
            type: '江阳 Stone-Cabrera',
            value: 10,
        },
        {
            type: 'Others',
            value: 10,
        },
        {
            type: '刘琳 Johnson Group',
            value: 5,
        },
        {
            type: '陈秀荣 Jones, Carter and Duarte',
            value: 5,
        },
        {
            type: '曲敏 Thomas Ltd',
            value: 5,
        },
        {
            type: '李冬梅 Rose-Martin',
            value: 5,
        },
    ];

    const config = {
        data,
        // xField: 'type',
        xField: 'id',
        // yField: 'value',
        yField: 'sum',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            // type: {
            //     alias: 'type',
            // },
            // sales: {
            //     alias: 'value',
            // },
            id: {
                alias: 'ID',
            },
            sum: {
                alias: 'sum',
            },
        },
    };

    return <Column {...config} />;
}
