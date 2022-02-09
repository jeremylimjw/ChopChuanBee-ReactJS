import { Typography } from 'antd';
import React from 'react'

export default function MyToolbar({ children, title, style }) {
    const styles = {
        container: {
            display: 'flex',
            marginBottom: 15,
            ...style,
        },
        title: {
            paddingLeft: 4,
        },
        right: {
            marginLeft: 'auto'
        }
    }

    return (
        <div style={styles.container}>
            <Typography.Title level={5} style={styles.title}>{title}</Typography.Title>
            <div style={styles.right}>
                {children}
            </div>
        </div>
    );
}
