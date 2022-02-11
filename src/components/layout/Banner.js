import { Breadcrumb, Typography } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Banner({ breadcrumbs, title }) {
  return (
    <Header style={styles.header}>
      <Breadcrumb style={styles.breadcrumb}>
        { breadcrumbs?.map((path, index) => <Breadcrumb.Item key={index}><Link to={path.url}>{path.name}</Link></Breadcrumb.Item>) }
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
