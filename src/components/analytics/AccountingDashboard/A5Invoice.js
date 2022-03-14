import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';

export default function A5Invoice() {
    const data = [
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
        xField: 'type',
        yField: 'value',
        label: {
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'bottom', 'middle',
            // 配置样式
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
            type: {
                alias: 'type',
            },
            sales: {
                alias: 'value',
            },
        },
    };
    return <Column {...config} />;
}
