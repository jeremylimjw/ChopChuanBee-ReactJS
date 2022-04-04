import React from "react";
import { Typography } from "antd";
import MyLayout from "../../common/MyLayout";
import moment from "moment";
import { parseDateTime } from "../../../utilities/datetime";
import TodayProfitability from "./TodayProfitability";
import TodayProducts from "./TodayProducts";

export default function TodayDashboard() {
  const oneYearAgo = moment().clone().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const currDate = moment().clone().startOf('day');
  const currTime = moment();

  return (
    <MyLayout bannerTitle="Today Dashboard">
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TodayProfitability currDate={currDate} currTime={currTime} />
          <TodayProducts oneYearAgo={oneYearAgo} currDate={currDate} />
        </div>
    </MyLayout>
  );
}
