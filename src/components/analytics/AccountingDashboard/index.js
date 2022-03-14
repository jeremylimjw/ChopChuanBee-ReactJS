import { Form, Input, DatePicker, Select, Button, Tabs, Radio } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { View } from '../../../enums/View';
import MyLayout from '../../common/MyLayout';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import { AnalyticsApiHelper } from '../../../api/AnalyticsApiHelper';
import ProfitabilityCard from './ProfitabilityTab/ProfitabilityCard';
import ProfitabilityGraph from './ProfitabilityTab/ProfitabilityGraph';
import PayableCard from './AccountsPayableTab/PayableCard';
import PayableGraph from './AccountsPayableTab/PayableGraph';

export default function AccountingDashboard() {
    let navigate = useNavigate();
    const { TabPane } = Tabs;
    const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    const currDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
    const currTime = moment().toDate();

    function callback(key) {
        console.log(key);
    }

    function handlePayableNavigation(e, link) {
        e.preventDefault();
        console.log(link);
        // navigate('/Accounting/Payable');
    }

    function handleReceivableNavigation(e, link) {
        e.preventDefault();
        console.log(link);
        // navigate('/Accounting/Receivable');
    }

    return (
        <MyLayout bannerTitle='Accounting Dashboard'>
            <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
                <TabPane tab="Profitability" key="1">
                    <ProfitabilityCard currTime={currTime}/>
                    <ProfitabilityGraph currDate={currDate} oneYearAgo={oneYearAgo}/>
                </TabPane>

                <TabPane tab="Accounts Payable" key="2">
                    <PayableCard currTime={currTime}/>
                    <PayableGraph />
                </TabPane>

                <TabPane tab="Accounts Receivable" key="3">
                    
                </TabPane>
                
                <TabPane tab="Customer Analytics" key="4">
                    
                </TabPane>
            </Tabs>

            {/* <Anchor affix={true} onClick={handleClick}>
                <Link href='#components-anchor-demo-basic' title='View all payable' />
            </Anchor> */}

            {/* <MyCard>
                <MyToolbar title='Top 10 Receivable'>
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name='date'>
                            <DatePicker.RangePicker />
                        </Form.Item>

                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    <Button type='link' onClick={handleReceivableNavigation}>
                        View all receivable
                    </Button>
                </MyToolbar>

                <Tabs defaultActiveKey='1' onChange={callback} tabPosition='left'>
                    <TabPane tab='PO Level' key='1'>
                        <A4PO />
                    </TabPane>
                    <TabPane tab='Customer Level' key='2'>
                        <A3AR />
                    </TabPane>
                </Tabs>
            </MyCard> */}
        </MyLayout>
    );
}
