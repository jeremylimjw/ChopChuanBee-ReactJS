import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';

export default function A1Profits() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // asyncFetch();
        setData([...revenue, ...cogs, ...profitsEarned]);
    }, []);

    //   const asyncFetch = () => {
    //     fetch(
    //       "https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json")
    //       .then((response) => response.json())
    //       .then((json) => setData(json))
    //       .catch((error) => {
    //         console.log("fetch data failed", error);
    //       });
    //   };

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

    const config = {
        data,
        xField: 'month',
        yField: 'price',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: (v) => `${(v / 1).toFixed(2)} `,
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };

    return <Line {...config} />;
    return <></>;
}
