import React from "react";
import { Typography, Space, Divider, Row, Spin, Tooltip, message, Card } from "antd";
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";
import TodayProductsTable from './TodayProductsTable';
import TodayProductsChart from './TodayProductsChart';

export default function TodayProducts(props) {

    return <>
    <div style={{display: "flex", flexDirection: "row"}} >
        <MyCard style={{ minWidth: "36vw" }} >
            <MyToolbar title="List of Products Sold Today"></MyToolbar>
            <TodayProductsTable oneYearAgo={props.oneYearAgo} currDate={props.currDate} />
        </MyCard>

        <MyCard style={{ minWidth: "36vw" }} >
            <MyToolbar title="List of Products Sold Today By Quantity"></MyToolbar>
            <TodayProductsChart oneYearAgo={props.oneYearAgo} currDate={props.currDate} />
        </MyCard>
    </div>
  </>
}