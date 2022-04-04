import React from "react";
import { Typography } from "antd";
import MyLayout from "../../common/MyLayout";
import moment from "moment";
import { useApp } from "../../../providers/AppProvider";
import { parseDate } from "../../../utilities/datetime";
import { parseDateTime } from "../../../utilities/datetime";
import TodayProfitability from "./TodayProfitability";
import TodayProducts from "./TodayProducts";

export default function TodayDashboard() {
  const { user } = useApp();
  const oneYearAgo = moment().clone().subtract(1, "year").set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const currDate = moment().clone().startOf('day');
  const currTime = moment();

  return (
    <MyLayout bannerTitle={<>Hello, {user.name}! <br/> This is the analytics for today, {parseDate(currDate.toDate())}.</>}>
        <Typography style={{fontSize:'0.8rem', marginBottom: 0, fontStyle:'italic', margin: "24px 24px 0"}}>{"Last Updated: " + parseDateTime(currTime)}</Typography>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TodayProfitability currDate={currDate} currTime={currTime} />
          <TodayProducts oneYearAgo={oneYearAgo} currDate={currDate} />
        </div>
    </MyLayout>
  );
}
