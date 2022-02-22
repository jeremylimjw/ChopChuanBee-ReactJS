import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';

export default function A3PaymentsDashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // asyncFetch();
        setData([...revenue, ...cogs, ...profitsEarned]);
    }, []);

    const testData = [
        {
            type: '分类一',
            value: 27,
        },
        {
            type: '分类二',
            value: 25,
        },
        {
            type: '分类三',
            value: 18,
        },
        {
            type: '分类四',
            value: 15,
        },
        {
            type: '分类五',
            value: 10,
        },
        {
            type: '其他',
            value: 5,
        },
    ];
    const config = {
        appendPadding: 10,
        testData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };

    const revenue = [
        {
            name: 'Revenue',
            month: 'January 2021',
            price: 1212.24,
        },
        {
            name: 'Revenue',
            month: 'February 2021',
            price: 212.24,
        },
        {
            name: 'Revenue',
            month: 'March 2021',
            price: 512.24,
        },
        {
            name: 'Revenue',
            month: 'April 2021',
            price: 212.24,
        },
        {
            name: 'Revenue',
            month: 'May 2021',
            price: 562.24,
        },
        {
            name: 'Revenue',
            month: 'June 2021',
            price: 912.24,
        },
        {
            name: 'Revenue',
            month: 'July 2021',
            price: 1212.24,
        },
        {
            name: 'Revenue',
            month: 'August 2021',
            price: 1512.24,
        },
        {
            name: 'Revenue',
            month: 'September 2021',
            price: 1512.24,
        },
        {
            name: 'Revenue',
            month: 'October 2021',
            price: 1712.24,
        },
        {
            name: 'Revenue',
            month: 'November 2021',
            price: 1212.24,
        },
        {
            name: 'Revenue',
            month: 'December 2021',
            price: 1512.24,
        },
    ];

    const cogs = [
        {
            name: 'Cost of Goods Sold',
            month: 'January 2021',
            price: 912.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'February 2021',
            price: 612.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'March 2021',
            price: 312.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'April 2021',
            price: 212.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'May 2021',
            price: 562.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'June 2021',
            price: 912.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'July 2021',
            price: 1212.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'August 2021',
            price: 1512.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'September 2021',
            price: 1512.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'October 2021',
            price: 1712.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'November 2021',
            price: 1212.24,
        },
        {
            name: 'Cost of Goods Sold',
            month: 'December 2021',
            price: 1512.24,
        },
    ];

    const profitsEarned = [
        {
            name: 'Profits',
            month: 'January 2021',
            price: 312.24,
        },
        {
            name: 'Profits',
            month: 'February 2021',
            price: 512.24,
        },
        {
            name: 'Profits',
            month: 'March 2021',
            price: 612.24,
        },
        {
            name: 'Profits',
            month: 'April 2021',
            price: 212.24,
        },
        {
            name: 'Profits',
            month: 'May 2021',
            price: 562.24,
        },
        {
            name: 'Profits',
            month: 'June 2021',
            price: 912.24,
        },
        {
            name: 'Profits',
            month: 'July 2021',
            price: 1212.24,
        },
        {
            name: 'Profits',
            month: 'August 2021',
            price: 1212.24,
        },
        {
            name: 'Profits',
            month: 'September 2021',
            price: 1412.24,
        },
        {
            name: 'Profits',
            month: 'October 2021',
            price: 1612.24,
        },
        {
            name: 'Profits',
            month: 'November 2021',
            price: 1012.24,
        },
        {
            name: 'Profits',
            month: 'December 2021',
            price: 1312.24,
        },
    ];

    return <Pie {...config} />;
    return <></>;
}
