import React from 'react';
import { Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';
import MyToolbar from '../../../common/MyToolbar';
import AgingReceivableGraph from './AgingReceivableGraph';
import AgingReceivableTable from './AgingReceivableTable';
import { parseDateTime } from '../../../../utilities/datetime';

export default function AgingReceivableData(props) {
    const { TabPane } = Tabs;

    return (
        <>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic'}}>{"Last Updated: " + parseDateTime(props.currTime)}</Typography>
        <MyCard style={{marginLeft: '3px', marginRight: '3px'}}>
            <MyToolbar title='Aging Accounts Receivable'></MyToolbar>
            <Typography style={{marginLeft:'3px'}}>The Aging Accounts Receivable chart below segregates the company's account receivables according to the <span style={{color:"#1890ff", fontWeight:"bold"}}>length of time a customer invoice has been outstanding</span> for better management of credit and cash flow. <br/><br/> The "age" of a receivable is calculated as the number of days since the invoice was created till date. There are 4 categories of age: <span style={{color:"#1890ff", fontWeight:"bold"}}>less than 30 days, over 30 to 60 days, over 60 to 90 days, more than 90 days.</span></Typography>
            <Tabs defaultActiveKey='1' type="card" style={{marginTop:"20px"}}>
                <TabPane tab='Graph' key='1'>
                    <AgingReceivableGraph />
                </TabPane>
                <TabPane tab='Table' key='2'>
                    <AgingReceivableTable />
                </TabPane>
            </Tabs>
        </MyCard>
        </>
    )
}