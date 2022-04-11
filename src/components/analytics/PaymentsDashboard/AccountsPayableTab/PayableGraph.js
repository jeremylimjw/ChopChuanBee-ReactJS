import React from 'react';
import { Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import APInvoiceChart from './APInvoiceChart';
import APSupplierChart from './APSupplierChart';

export default function PayableGraph() {
    const { TabPane } = Tabs;

    return (
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='10 Outstanding Accounts Payable'>
            </MyToolbar>
            <Tabs defaultActiveKey='1' type="card">
                <TabPane tab='Invoice Level' key='1'>
                    <Typography>The Accounts Payable Insights (Invoice Level) chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>Top 10 supplier invoices with the highest value of outstanding accounts payable</span>.</Typography>
                    <APInvoiceChart />
                </TabPane>
                <TabPane tab='Supplier Level' key='2'>
                <Typography>The Accounts Payable Insights (Supplier Level) chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>Top 10 suppliers with the highest value of outstanding accounts payable</span>.</Typography>
                <APSupplierChart />
                </TabPane>
            </Tabs>
        </MyCard>
    )
}