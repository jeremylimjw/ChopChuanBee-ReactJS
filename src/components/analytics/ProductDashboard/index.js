import { Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
import MyLayout from '../../common/MyLayout';
import ProductAnalyticsData from './ProductAnalyticsTab/ProductAnalyticsData';
import ContributionChart from './ContributionTab/ContributionChart';
import ContributionCard from './ContributionTab/ContributionCard';

export default function ProductDashboard() {
    const { TabPane } = Tabs;
    const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const currDate = moment().startOf('day');

    return (
        <MyLayout bannerTitle='Product Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
                <TabPane tab="Contribution" key="1">
                    <ContributionCard currDate={currDate} oneYearAgo={oneYearAgo} />
                    <ContributionChart currDate={currDate} oneYearAgo={oneYearAgo} />
                </TabPane>

                <TabPane tab="Product Analytics" key="2">
                    <ProductAnalyticsData currDate={currDate} oneYearAgo={oneYearAgo} />
                </TabPane>
            </Tabs>
        </MyLayout>
    );
}
