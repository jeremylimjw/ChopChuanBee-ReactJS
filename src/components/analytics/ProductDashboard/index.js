import { Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
import MyLayout from '../../common/MyLayout';

export default function ProductDashboard() {
    const { TabPane } = Tabs;
    const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    const currDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    const currTime = moment().toDate();

    return (
        <MyLayout bannerTitle='Product Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
                <TabPane tab="Contribution" key="1">
                </TabPane>

                <TabPane tab="Product Analytics" key="2">
                </TabPane>
            </Tabs>
        </MyLayout>
    );
}
