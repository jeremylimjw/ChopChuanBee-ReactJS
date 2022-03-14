import React, { useState, useEffect } from 'react';
import { Pie, G2 } from '@ant-design/plots';

export default function A3AR() {
    const G = G2.getEngine('canvas');

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
        appendPadding: 10,
        data,
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
    return <Pie {...config} />;
}
