import Layout, { Content, Footer } from 'antd/lib/layout/layout'
import React from 'react'
import Banner from './Banner'

export default function MyLayout({ children, breadcrumbs, bannerTitle, bannerRight }) {
  return (
    <Layout>
      <Banner breadcrumbs={breadcrumbs} title={bannerTitle} bannerRight={bannerRight} />
      <Content>
        {children}
        <Footer style={{ textAlign: 'center', color: 'rgba(0,0,0,.45)' }}>© 2022 Produced by IS4103 ID04 AY21/22 S2</Footer>
      </Content>
    </Layout>
  )
}
