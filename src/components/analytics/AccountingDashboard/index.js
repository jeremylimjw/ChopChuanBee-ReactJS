import { Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
import MyLayout from '../../common/MyLayout';
import ProfitabilityData from './ProfitabilityTab/ProfitabilityData';
import PayableCard from './AccountsPayableTab/PayableCard';
import PayableGraph from './AccountsPayableTab/PayableGraph';
import ReceivableCard from './AccountsReceivableTab/ReceivableCard';
import ReceivableGraph from './AccountsReceivableTab/ReceivableGraph';
import AgingReceivableGraph from './AgingARReportTab/AgingReceivableGraph';
import CustomerAnalyticsCard from './CustomerAnalyticsTab/CustomerAnalyticsCard';
import CustomerAnalyticsData from './CustomerAnalyticsTab/CustomerAnalyticsData';

export default function AccountingDashboard() {
    const { TabPane } = Tabs;
    const currTime = moment();
    const oneYearAgo = moment().clone().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    return (
        <MyLayout bannerTitle='Accounting Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
                <TabPane tab="Profitability" key="1">
                    <ProfitabilityData currTime={currTime} oneYearAgo={oneYearAgo} />
                </TabPane>

                <TabPane tab="Outstanding Accounts Payable" key="2">
                    <PayableCard currTime={currTime} />
                    <PayableGraph />
                </TabPane>

                <TabPane tab="Outstanding Accounts Receivable" key="3">
                    <ReceivableCard currTime={currTime} />
                    <ReceivableGraph />
                </TabPane>

                <TabPane tab="Aging Accounts Receivable" key="4">
                    <AgingReceivableGraph />
                </TabPane>
                
                <TabPane tab="Customer Analytics" key="5">
                    <CustomerAnalyticsData />
                    <CustomerAnalyticsCard />
                </TabPane>
            </Tabs>
        </MyLayout>
    );
}
