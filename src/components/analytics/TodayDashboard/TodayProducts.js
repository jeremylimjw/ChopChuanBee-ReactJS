import React, { useEffect, useState } from "react";
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";
import TodayProductsTable from './TodayProductsTable';
import TodayProductsChart from './TodayProductsChart';
import { AnalyticsApiHelper } from "../../../api/AnalyticsApiHelper";
import { useApp } from "../../../providers/AppProvider";

export default function TodayProducts(props) {
    const { handleHttpError } = useApp();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AnalyticsApiHelper.getProductAnalytics(props.currDate, props.currTime)
          .then((results) => {
            results.map((x) => {
              x.contribution_margin = parseFloat(x.contribution) / parseFloat(x.average_selling_price) * 100;
              return x;
            });
            setData(results);
            setLoading(false);
          })
          .catch(handleHttpError);
      }, [handleHttpError, loading]);

    return <>
    {/* { data.length === 0 ? "" : */}
    <div style={{display: "flex", flexDirection: "row"}} >
        <MyCard style={{ marginRight: 0, marginBottom: 0, width: "-webkit-fill-available" }} >
            <MyToolbar title="Products Sold Today"></MyToolbar>
            <TodayProductsTable data={data} loading={loading}/>
        </MyCard>

        <MyCard style={{ marginBottom: 0, width: "-webkit-fill-available" }} >
            <MyToolbar title="Top 5 Products Sold Today By Contribution Margin"></MyToolbar>
            <TodayProductsChart data={data} />
        </MyCard>
    </div> 
    {/* } */}
  </>
}