import React, { useEffect, useState, useCallback } from "react";
import { Typography, Spin } from "antd";
import MyCard from "../../common/MyCard";
import { useApp } from '../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../api/AnalyticsApiHelper';
import { formatCurrency } from '../../../utilities/currency';
import { parseDate } from '../../../utilities/datetime';

export default function TodayProfitability(props) {
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();
    const [revToday, setRevToday] = useState();
    const [cogsToday, setCogsToday] = useState();
    const [profToday, setProfToday] = useState();

    const getData = useCallback(
        async () => {
            await AnalyticsApiHelper.getRevenue(props.currDate, props.currTime)
                .then((result) => {
                if (result.length === 0) {
                    setRevToday(0);
                } else {
                    setRevToday(result[0].value);
                }
            })
            .catch(handleHttpError);

            await AnalyticsApiHelper.getCOGS(props.currDate, props.currTime)
                .then((result) => {
                if (result.length === 0) {
                    setCogsToday(0);
                } else {
                    setCogsToday(result[0].value);
                }
            })
            .catch(handleHttpError);

            await AnalyticsApiHelper.getProfits(props.currDate, props.currTime)
                .then((result) => {
                if (result.length === 0) {
                    setProfToday(0);
                } else {
                    setProfToday(result[0].value);
                }
            })
            .catch(handleHttpError);
        },
        [handleHttpError, props, setRevToday, setCogsToday, setProfToday]
    )

    useEffect(() => {
        getData();
        setLoading(false);
    },[getData, setLoading]);

    return <>
    <div style={{display: "flex", flexDirection: "row"}} >
        <MyCard style={{ marginBottom: 0, marginRight: 0, width: "-webkit-fill-available" }} >
            <Typography>DATE</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            {parseDate(props.currDate)}
            </Typography.Title>
        </MyCard>
        
        <MyCard style={{ marginBottom: 0, marginRight: 0, width: "-webkit-fill-available" }} >
            <Typography>REVENUE</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            {loading 
                ? <Spin/> 
                : formatCurrency(revToday)}
            </Typography.Title>
        </MyCard>

        <MyCard style={{ marginBottom: 0, marginRight: 0, width: "-webkit-fill-available" }} >
            <Typography>COGS</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            {loading ? <Spin/> : formatCurrency(cogsToday)}
            </Typography.Title>
        </MyCard>

        <MyCard style={{ marginBottom: 0, width: "-webkit-fill-available" }} >
            <Typography>PROFITS</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            {loading ? <Spin/> : formatCurrency(profToday)}
            </Typography.Title>
        </MyCard>
    </div>
  </>
}