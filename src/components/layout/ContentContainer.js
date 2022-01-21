import React from 'react';
import { Layout } from 'antd';

const ContentContainer = (props) => {
  const { Content } = Layout;
  return (
    <Layout>
      <Content>{props.children}</Content>;
    </Layout>
  );
};

export default ContentContainer;
