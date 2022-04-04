import React from 'react';
import { Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import ARInvoiceChart from './ARInvoiceChart';
import ARCustomerChart from './ARCustomerChart';

export default function ReceivableGraph() {
    const { TabPane } = Tabs;

    return (
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='10 Outstanding Accounts Receivable'>
            </MyToolbar>
            <Tabs defaultActiveKey='1' type="card">
                <TabPane tab='Invoice Level' key='1'>
                <Typography>The Accounts Receivable Insights (Invoice Level) chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>Top 10 customer invoices with the highest value of outstanding accounts receivable</span>.</Typography>
                    <ARInvoiceChart />
                </TabPane>
                <TabPane tab='Customer Level' key='2'>
                <Typography>The Accounts Receivable Insights (Customer Level) chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>Top 10 customers with the highest value of outstanding accounts receivable</span>.</Typography>
                    <ARCustomerChart />
                </TabPane>
            </Tabs>
        </MyCard>
    )
}