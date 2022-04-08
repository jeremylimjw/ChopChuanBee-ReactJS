import React from "react";
import MyLayout from "../../common/MyLayout";
import moment from "moment";
import TodayProfitability from "./TodayProfitability";
import TodayProducts from "./TodayProducts";
import TodaySalesOrders from "./TodaySalesOrders";
import TodayPurchaseOrders from "./TodayPurchaseOrders";
import TodayInventoryReturns from "./TodayInventoryReturns";
import TodaySalesReturns from "./TodaySalesReturns";
import TodayDamagedGoods from "./TodayDamagedGoods";

export default function TodayDashboard() {
  const oneYearAgo = moment().clone().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const currDate = moment().clone().startOf('day');
  const currTime = moment();

  return (
    <MyLayout bannerTitle="Today Dashboard">
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TodayProfitability currDate={currDate} currTime={currTime} />
          <TodayProducts currDate={currDate} currTime={currTime} />

          <div style={{display: 'flex', flexDirection: 'row'}}>
            <TodaySalesOrders currDate={currDate} currTime={currTime} />
            <TodayPurchaseOrders currDate={currDate} currTime={currTime} />
          </div>

          <div style={{display: 'flex', flexDirection: 'row'}}>
            <TodayInventoryReturns currDate={currDate} currTime={currTime} />
            <TodaySalesReturns currDate={currDate} currTime={currTime} />
            <TodayDamagedGoods currDate={currDate} currTime={currTime} />
          </div>
        </div>
    </MyLayout>
  );
}
