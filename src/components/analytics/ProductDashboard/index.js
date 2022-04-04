import { Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
import MyLayout from '../../common/MyLayout';
import ProductAnalyticsData from './ProductAnalyticsTab/ProductAnalyticsData';
import ContributionData from './ContributionTab/ContributionData';
import '../analytics-style.css';

export default function ProductDashboard() {
    const { TabPane } = Tabs;
    const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const currDate = moment().startOf('day');

    return (
        <MyLayout bannerTitle='Product Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
                <TabPane tab="Product Analytics" key="1">
                    <ProductAnalyticsData currDate={currDate} oneYearAgo={oneYearAgo} />
                </TabPane>
                
                <TabPane tab="Contribution Margin" key="2">
                    <ContributionData currDate={currDate} oneYearAgo={oneYearAgo} />
                </TabPane>
            </Tabs>
        </MyLayout>
    );
}
