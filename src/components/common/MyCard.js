import { Card } from 'antd';
import React from 'react';

export default function MyCard({ children, style, title }) {
    const styles = {
        container: {
            margin: 24,
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            border: 'none',
            ...style,
        },
    }

    return (
        <Card style={styles.container} title={title}>
            {children}
        </Card>
    );
}
