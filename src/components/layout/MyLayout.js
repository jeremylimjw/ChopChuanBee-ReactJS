import Layout, { Content, Footer } from 'antd/lib/layout/layout'
import React from 'react'
import Banner from './Banner'

export default function MyLayout({ children, breadcrumbs, bannerTitle }) {
  return (
    <Layout>
      <Banner breadcrumbs={breadcrumbs} title={bannerTitle} />
      <Content>
        {children}
        <Footer style={{ textAlign: 'center', color: 'rgba(0,0,0,.45)' }}>© 2021 Produced by IS4103 Group 3 AY21/22 Sem 2</Footer>
      </Content>
    </Layout>
  )
}
