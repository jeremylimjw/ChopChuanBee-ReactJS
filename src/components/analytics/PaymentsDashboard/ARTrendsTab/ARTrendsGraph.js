import React from 'react';
import { Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';

export default function ARTrendsGraph() {
    return <>
    <MyCard style={{margin:'3px'}}>
    <Typography>The Accounts Receivable Trends chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>monthly accounts receivable amount and the amount of accounts receivable being settled (cash paid by customers)</span>.</Typography>
    </MyCard>
    </>
}