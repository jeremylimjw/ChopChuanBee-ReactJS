import React, { useEffect, useState } from "react";
import { Typography, Space, Divider, Row, Spin, Tooltip } from "antd";
import MyCard from "../../../common/MyCard";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import { formatCurrency } from "../../../../utilities/currency";
import { Link } from 'react-router-dom';

export default function DamagedGoodsCard(props) {
  const [loading, setLoading] = useState(true);
  const { handleHttpError } = useApp();
  const [mostDamagedProduct, setMostDamagedProduct] = useState([]);
  const [highestValueLoss, setHighestValueLoss] = useState([]);

  useEffect(() => {
    AnalyticsApiHelper.getDamagedGoods(props.startDate, props.endDate)
      .then((results) => {
        setMostDamagedProduct(results[0]);
        setHighestValueLoss(results[0]);
        setLoading(false);
      })
      .catch(handleHttpError);
  }, [handleHttpError, loading, props.userInput]);

  return (
    <>
    { mostDamagedProduct == null ? "" : 
    <>
      <Space direction="horizontal" wrap>
        <MyCard style={{ maxWidth: "40vw", marginLeft: "3px", marginBottom: 0 }} >
          <Typography>MOST DAMAGED PRODUCT</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            { loading 
                ? <Spin /> 
                : <><Tooltip title="Click to view product"><Link to={`/inventory/products/${mostDamagedProduct.product_uuid}`}> {mostDamagedProduct.name} </Link></Tooltip></>
            }
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "auto" }}>
              TOTAL QUANTITY
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {mostDamagedProduct.quantity_returned}
            </Typography>
          </Row>
        </MyCard>

        <MyCard style={{ maxWidth: "40vw", marginLeft: "3px", marginBottom: 0 }} >
          <Typography>HIGHEST VALUE LOSS</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            { loading 
                ? <Spin /> 
                : <><Tooltip title="Click to view product"><Link to={`/inventory/products/${highestValueLoss.product_uuid}`}> {formatCurrency(highestValueLoss.total_damaged_inventory_value)} </Link></Tooltip></>
            }
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "20px" }}>
              FROM
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {highestValueLoss.name}
            </Typography>
          </Row>
        </MyCard>
      </Space>
    </>
    }
    </>
  );
}
