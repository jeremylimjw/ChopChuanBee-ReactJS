import React, { useEffect, useState } from "react";
import { Typography, Spin, message } from "antd";
import MyCard from "../../common/MyCard";
import { useApp } from '../../../providers/AppProvider';
import { AnalyticsApiHelper } from '../../../api/AnalyticsApiHelper';
import { formatCurrency } from '../../../utilities/currency';

export default function TodayProfitability(props) {
    const [loading, setLoading] = useState(true);
    const { handleHttpError } = useApp();
    const [revToday, setRevToday] = useState();
    const [cogsToday, setCogsToday] = useState();
    const [profToday, setProfToday] = useState();
    const [errorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        fetchData();
        setLoading(false);
        checkErrorMessage();
    },[handleHttpError, loading]);

    const checkErrorMessage = () => {
        if (errorMessage) {
            message.error("There is no data available for this period.");
            setErrorMessage(false);
        }
    }

    const fetchData = async () => {
        await AnalyticsApiHelper.getRevenue(props.currDate, props.currTime)
        .then((result) => {
            if (result.length === 0) {
                setErrorMessage(true);
            }
            setRevToday(result[0].value);
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getCOGS(props.currDate, props.currTime)
        .then((result) => {
            if (result.length === 0) {
                setErrorMessage(true);
            }
            setCogsToday(result[0].value);
        })
        .catch(handleHttpError);
        await AnalyticsApiHelper.getProfits(props.currDate, props.currTime)
        .then((result) => {
            if (result.length === 0) {
                setErrorMessage(true);
            }
            setProfToday(result[0].value);
        })
        .catch(handleHttpError);
    }

    return <>
    { revToday || cogsToday || profToday ?
    <div style={{display: "flex", flexDirection: "row"}} >
        <MyCard style={{ minWidth: "16vw" }} >
            <Typography>REVENUE</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            {loading ? <Spin/> : formatCurrency(revToday)}
            </Typography.Title>
        </MyCard>

        <MyCard style={{ minWidth: "16vw" }} >
            <Typography>COGS</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            {loading ? <Spin/> : formatCurrency(cogsToday)}
            </Typography.Title>
        </MyCard>

        <MyCard style={{ minWidth: "16vw" }} >
            <Typography>PROFITS</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            {loading ? <Spin/> : formatCurrency(profToday)}
            </Typography.Title>
        </MyCard>

        <MyCard style={{ minWidth: "16vw" }} >
            <Typography>PRODUCTS SOLD</Typography>
            <Typography.Title level={2} style={{ margin: 0 }}>
            250
            </Typography.Title>
        </MyCard>
    </div>
    : "" }
  </>
}