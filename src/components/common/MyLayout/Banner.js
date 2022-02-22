import { Breadcrumb, Typography } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Banner({ breadcrumbs, title, bannerRight }) {
  return (
    <Header style={styles.header}>
      <div>
        <Breadcrumb style={styles.breadcrumb}>
          { breadcrumbs?.map((path, index) => <Breadcrumb.Item key={index}><Link to={path.url}>{path.name}</Link></Breadcrumb.Item>) }
        </Breadcrumb>
        <Typography.Title level={4}>{title}</Typography.Title>
      </div>
      { bannerRight && 
        <div style={styles.bannerRight}>
          {bannerRight}
        </div>
      }
    </Header>
  )
}

const styles = {
  header: {
    background: '#fff',
    height: 'auto',
    padding: '15px 25px',
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
    border: 'none',
    display: 'flex',
  },
  breadcrumb: {
    marginTop: 8,
    marginBottom: 16,
  },
  bannerRight: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: '0.5em',
  }
}
