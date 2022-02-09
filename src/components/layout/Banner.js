import { Breadcrumb, Typography } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import React from 'react'

export default function Banner({ paths, title }) {
  return (
    <Header style={styles.header}>
      <Breadcrumb style={styles.breadcrumb}>
        { paths?.map((path, index) => <Breadcrumb.Item key={index}>{path}</Breadcrumb.Item>) }
      </Breadcrumb>
      <Typography.Title level={4}>{title}</Typography.Title>
    </Header>
  )
}

const styles = {
  header: {
    background: '#fff',
    height: 'auto',
    padding: '15px 25px',
  },
  breadcrumb: {
    marginTop: 8,
    marginBottom: 16,
  }
}
