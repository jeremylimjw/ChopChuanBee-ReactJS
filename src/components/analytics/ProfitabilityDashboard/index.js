import { Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
import MyLayout from '../../common/MyLayout';
import ProfitabilityData from './ProfitabilityTab/ProfitabilityData';
import CustomerAnalyticsData from './CustomerAnalyticsTab/CustomerAnalyticsData';
import SalesBreakdownData from './SalesBreakdownTab/SalesBreakdownData';
import CashFlowData from './CashFlowTab/CashFlowData';
import '../analytics-style.css';

export default function ProfitabilityDashboard() {
    const { TabPane } = Tabs;
    const currTime = moment();
    const oneYearAgo = moment().clone().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    return (
        <MyLayout bannerTitle='Profitability Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{ margin: '24px' }}>
                <TabPane tab="Profitability" key="1">
                    <ProfitabilityData currTime={currTime} oneYearAgo={oneYearAgo} />
                </TabPane>

                <TabPane tab="Customer Analytics" key="2">
                    <CustomerAnalyticsData />
                </TabPane>

                <TabPane tab="Sales Breakdown" key="3">
                    <SalesBreakdownData currTime={currTime} oneYearAgo={oneYearAgo} />
                </TabPane>

                <TabPane tab="Cash Flow" key="4">
                    <CashFlowData currTime={currTime} oneYearAgo={oneYearAgo} />
                </TabPane>
            </Tabs>
        </MyLayout>
    );
}
