import React from 'react';
import { Tabs, Typography } from 'antd';
import MyCard from '../../../common/MyCard';

export default function InventoryLevelGraph() {
    return <>
    <MyCard style={{margin:'3px'}}>
    <Typography>The Inventory Level chart below displays the <span style={{color:"#1890ff", fontWeight:"bold"}}>Top 10 inventories with the lowest percentage ratio of current inventory level and the minimum inventory level</span>.</Typography>
    </MyCard>
    </>
}