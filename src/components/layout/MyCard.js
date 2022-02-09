import { Card } from 'antd';
import React from 'react';

export default function MyCard(props) {
    return (
        <Card style={{ margin: 24 }} {...props}>
            {props.children}
        </Card>
    );
}
