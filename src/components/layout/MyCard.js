import { Card } from 'antd';
import React from 'react';

export default function MyCard({ children, style, title  }) {
    const styles = {
        container: {
            margin: 24,
            ...style,
        },
    }

    return (
        <Card style={styles.container} title={title}>
            {children}
        </Card>
    );
}
