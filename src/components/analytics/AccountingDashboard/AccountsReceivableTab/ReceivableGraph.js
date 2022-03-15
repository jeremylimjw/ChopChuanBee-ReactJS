import React from 'react';
import { Tabs } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import ARInvoiceChart from './ARInvoiceChart';
import ARCustomerChart from './ARCustomerChart';

export default function ReceivableGraph() {
    const { TabPane } = Tabs;

    // function handleReceivableNavigation(e, link) {
    //     e.preventDefault();
    //     navigate('/Accounting/Receivable');
    // }

    return (
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='10 Outstanding Accounts Receivable'>
                {/* <Button type='link' onClick={handlePayableNavigation}>
                    View all payable
                </Button> */}
            </MyToolbar>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='Invoice Level' key='1'>
                    <ARInvoiceChart />
                </TabPane>
                <TabPane tab='Customer Level' key='2'>
                    <ARCustomerChart />
                </TabPane>
            </Tabs>
        </MyCard>
    )
}