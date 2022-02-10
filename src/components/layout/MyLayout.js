import Layout, { Content, Footer } from 'antd/lib/layout/layout'
import React, { useState } from 'react'
import Banner from './Banner'

export default function MyLayout({ children, bannerPath: path, bannerTitle: title }) {

  const [bannerPath, setBannerPath] = useState(path);
  const [bannerTitle, setBannerTitle] = useState(title);

  return (
    <Layout>
        <Banner paths={bannerPath} title={bannerTitle} />
        <Content>
            {React.cloneElement(children, { setBannerPath, setBannerTitle } )}
            <Footer style={{ textAlign: 'center', color: 'rgba(0,0,0,.45)' }}>© 2021 Produced by IS4103 Group 3 AY21/22 Sem 2</Footer>
        </Content>
    </Layout>
  )
}
