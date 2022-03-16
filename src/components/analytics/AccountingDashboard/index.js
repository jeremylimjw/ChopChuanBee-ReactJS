import { Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
import MyLayout from '../../common/MyLayout';
import ProfitabilityCard from './ProfitabilityTab/ProfitabilityCard';
import ProfitabilityGraph from './ProfitabilityTab/ProfitabilityGraph';
import PayableCard from './AccountsPayableTab/PayableCard';
import PayableGraph from './AccountsPayableTab/PayableGraph';
import ReceivableCard from './AccountsReceivableTab/ReceivableCard';
import ReceivableGraph from './AccountsReceivableTab/ReceivableGraph';
import CustomerAnalyticsCard from './CustomerAnalyticsTab/CustomerAnalyticsCard';
import CustomerAnalyticsData from './CustomerAnalyticsTab/CustomerAnalyticsData';

export default function AccountingDashboard() {
    const { TabPane } = Tabs;
    const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    const currDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    const currTime = moment().toDate();

    return (
        <MyLayout bannerTitle='Accounting Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
                <TabPane tab="Profitability" key="1">
                    <ProfitabilityCard currTime={currTime} />
                    <ProfitabilityGraph currDate={currDate} oneYearAgo={oneYearAgo} />
                </TabPane>

                <TabPane tab="Accounts Payable" key="2">
                    <PayableCard currTime={currTime} />
                    <PayableGraph />
                </TabPane>

                <TabPane tab="Accounts Receivable" key="3">
                    <ReceivableCard currTime={currTime} />
                    <ReceivableGraph />
                </TabPane>
                
                <TabPane tab="Customer Analytics" key="4">
                    <CustomerAnalyticsCard currTime={currTime} />
                    <CustomerAnalyticsData />
                </TabPane>
            </Tabs>
        </MyLayout>
    );
}
