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
            <MyToolbar title='Aging Accounts Receivable'>
            </MyToolbar>
            <Tabs defaultActiveKey='1' type="card">
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