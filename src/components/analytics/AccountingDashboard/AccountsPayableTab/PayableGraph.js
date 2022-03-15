import React from 'react';
import { Tabs } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import APInvoiceChart from './APInvoiceChart';
import APSupplierChart from './APSupplierChart';

export default function PayableGraph() {
    const { TabPane } = Tabs;

    // function handlePayableNavigation(e, link) {
    //     e.preventDefault();
    //     navigate('/Accounting/Payable');
    // }

    return (
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='10 Outstanding Accounts Payable'>
                {/* <Button type='link' onClick={handlePayableNavigation}>
                    View all payable
                </Button> */}
            </MyToolbar>
            <Tabs defaultActiveKey='1'>
                <TabPane tab='Invoice Level' key='1'>
                    <APInvoiceChart />
                </TabPane>
                <TabPane tab='Supplier Level' key='2'>
                    <APSupplierChart />
                </TabPane>
            </Tabs>
        </MyCard>
    )
}