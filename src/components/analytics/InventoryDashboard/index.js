import { Tabs } from "antd";
import React from "react";
import MyLayout from "../../common/MyLayout";
import moment from "moment";
import InventoryReturnsCard from "./InventoryReturnsTab/InventoryReturnsCard";
import InventoryReturnsData from "./InventoryReturnsTab/InventoryReturnsData";

export default function InventoryDashboard() {
  const { TabPane } = Tabs;
  const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const currDate = moment().startOf('day');
  const currTime = moment();

  return (
    <MyLayout bannerTitle='Inventory Dashboard'>
        <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
            <TabPane tab="Inventory Returns" key="1">
                <InventoryReturnsCard currTime={currTime}/>
                <InventoryReturnsData currDate={currDate} oneYearAgo={oneYearAgo} />
            </TabPane>

            <TabPane tab="Sales Returns" key="2">
                
            </TabPane>

            <TabPane tab="Damaged Goods" key="3">
                
            </TabPane>
        </Tabs>
    </MyLayout>
  );
}
