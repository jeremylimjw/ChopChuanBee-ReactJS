import { Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
import MyLayout from '../../common/MyLayout';
import PayableCard from './AccountsPayableTab/PayableCard';
import PayableGraph from './AccountsPayableTab/PayableGraph';
import APTrendsGraph from './APTrendsTab/APTrendsGraph';
import ARTrendsGraph from './ARTrendsTab/ARTrendsGraph';
import ReceivableCard from './AccountsReceivableTab/ReceivableCard';
import ReceivableGraph from './AccountsReceivableTab/ReceivableGraph';
import AgingReceivableData from './AgingARReportTab/AgingReceivableData';
import '../analytics-style.css';

export default function PaymentsDashboard() {
    const { TabPane } = Tabs;
    const currTime = moment();
    const oneYearAgo = moment().clone().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    return (
        <MyLayout bannerTitle='Payments Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{ margin: '24px' }}>

                <TabPane tab="Payable Trends" key="1">
                    <APTrendsGraph />
                </TabPane>

                <TabPane tab="Payable Insights" key="2">
                    <PayableCard currTime={currTime} />
                    <PayableGraph />
                </TabPane>

                <TabPane tab="Receivable Trends" key="3">
                    <ARTrendsGraph />
                </TabPane>

                <TabPane tab="Receivable Insights" key="4">
                    <ReceivableCard currTime={currTime} />
                    <ReceivableGraph />
                </TabPane>

                <TabPane tab="Aging Receivables" key="5">
                    <AgingReceivableData currTime={currTime} />
                </TabPane>
            </Tabs>
        </MyLayout>
    );
}
