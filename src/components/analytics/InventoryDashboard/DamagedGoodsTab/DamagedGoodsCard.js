import React, { useEffect, useState } from "react";
import { Typography, Space, Divider, Row } from "antd";
import MyCard from "../../../common/MyCard";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import { formatCurrency } from "../../../../utilities/currency";

export default function DamagedGoodsCard(props) {
  const [loading, setLoading] = useState(true);
  const { handleHttpError } = useApp();
  const [mostReturnedProduct, setMostReturnedProduct] = useState([]);
  const [highestValueLoss, setHighestValueLoss] = useState([]);

  useEffect(() => {
    AnalyticsApiHelper.getDamagedGoods(props.startDate, props.endDate)
      .then((results) => {
        setMostReturnedProduct(results[0]);
        setHighestValueLoss(results[0]);
        setLoading(false);
      })
      .catch(handleHttpError);
  }, [handleHttpError, loading, props.userInput]);

  return (
    <>
      <Space direction="horizontal" wrap>
        <MyCard
          style={{ minWidth: "250px", marginLeft: "3px", marginBottom: 0 }}
        >
          <Typography>MOST DAMAGED PRODUCT</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {mostReturnedProduct.name}
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "auto" }}>
              TOTAL QUANTITY
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {mostReturnedProduct.quantity_returned}
            </Typography>
          </Row>
        </MyCard>

        <MyCard
          style={{ minWidth: "250px", marginLeft: "3px", marginBottom: 0 }}
        >
          <Typography>HIGHEST VALUE LOSS</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {formatCurrency(highestValueLoss.total_damaged_inventory_value)}
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "auto" }}>
              FROM
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {highestValueLoss.name}
            </Typography>
          </Row>
        </MyCard>
      </Space>
    </>
  );
}
