import React from 'react';
import { Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';

export default function APTrendsGraph() {
    return <>
    <MyCard style={{margin:'3px'}}>
    <Typography>The Accounts Payable Trends chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>monthly accounts payable amount and the amount of accounts payable being settled (cash paid to suppliers)</span>.</Typography>
    </MyCard>
    </>
}