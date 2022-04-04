import { Tabs } from "antd";
import React from "react";
import MyLayout from "../../common/MyLayout";
import moment from "moment";
import InventoryLevelGraph from "./InventoryLevelTab/InventoryLevelGraph";
import InventoryReturnsData from "./InventoryReturnsTab/InventoryReturnsData";
import SalesReturnsData from "./SalesReturnsTab/SalesReturnsData";
import DamagedGoodsData from "./DamagedGoodsTab/DamagedGoodsData";
import '../analytics-style.css';

export default function InventoryDashboard() {
  const { TabPane } = Tabs;
  const oneYearAgo = moment().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const currDate = moment().startOf('day');

  return (
    <MyLayout bannerTitle='Inventory Dashboard'>
        <Tabs defaultActiveKey="1" type="card" style={{margin:'24px'}}>
            <TabPane tab="Inventory Level" key="1">
              <InventoryLevelGraph />
            </TabPane>
            
            <TabPane tab="Inventory Returns" key="2">
              <InventoryReturnsData currDate={currDate} oneYearAgo={oneYearAgo} />
            </TabPane>

            <TabPane tab="Sales Returns" key="3">
              <SalesReturnsData currDate={currDate} oneYearAgo={oneYearAgo} />
            </TabPane>

            <TabPane tab="Damaged Goods" key="4">
              <DamagedGoodsData currDate={currDate} oneYearAgo={oneYearAgo} />
            </TabPane>
        </Tabs>
    </MyLayout>
  );
}
