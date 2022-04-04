import React, { useEffect, useState } from "react";
import { Typography, Space, Divider, Row, Spin, Tooltip, message } from "antd";
import MyCard from "../../../common/MyCard";
import { useApp } from "../../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../../api/AnalyticsApiHelper";
import { formatCurrency } from "../../../../utilities/currency";
import { Link } from 'react-router-dom';

export default function InventoryReturnsCard(props) {
  const [loading, setLoading] = useState(true);
  const { handleHttpError } = useApp();
  const [mostReturnedProduct, setMostReturnedProduct] = useState();
  const [highestValueLoss, setHighestValueLoss] = useState();

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [handleHttpError, loading, props.userInput]);

  const fetchData = async () => {
    await AnalyticsApiHelper.getSupplierReturnedGoodsOrderByQtyDesc(props.startDate, props.endDate)
      .then((results) => {
        if (results.length === 0) {
          setMostReturnedProduct(null);
        } else {
          setMostReturnedProduct(results[0]);
        }
      })
      .catch(handleHttpError);

      await AnalyticsApiHelper.getSupplierReturnedGoodsOrderByValueDesc(props.startDate, props.endDate)
      .then((results) => {
        if (results.length === 0) {
          setHighestValueLoss(null);
        } else {
          setHighestValueLoss(results[0]);
        }
      })
      .catch(handleHttpError);
  }

  return (
    <>
    { mostReturnedProduct && highestValueLoss ? 
    <>
      <Space direction="horizontal" wrap>
        <MyCard style={{ maxWidth: "40vw", marginLeft: "3px", marginBottom: 0 }}>
          <Typography>MOST RETURNED PRODUCT</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            { loading 
                ? <Spin /> 
                : <><Tooltip title="Click to view product"><Link to={`/inventory/products/${mostReturnedProduct?.product_uuid}`}> {mostReturnedProduct?.product_name} </Link></Tooltip></>
            }
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "auto" }}>
              TOTAL QUANTITY
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {loading ? <Spin /> : mostReturnedProduct?.quantity_returned}
            </Typography>
          </Row>
        </MyCard>

        <MyCard style={{ maxWidth: "40vw", marginLeft: "3px", marginBottom: 0 }}>
          <Typography>HIGHEST TOTAL VALUE LOSS</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            { loading 
                ? <Spin /> 
                : <><Tooltip title="Click to view product"><Link to={`/inventory/products/${highestValueLoss?.product_uuid}`}> {formatCurrency(highestValueLoss?.supplier_returned_goods_total_value)} </Link></Tooltip></>
            }
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "20px" }}>
              FROM
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {loading ? <Spin /> : highestValueLoss?.product_name}
            </Typography>
          </Row>
        </MyCard>
      </Space>
    </>
    : 
    <MyCard style={{minWidth:'23.5vw', marginLeft: '3px', marginRight: '3px' }}>
        <Typography.Title level={5} style={{margin:0}}>There is no data available for this period.</Typography.Title>
    </MyCard>
    }
    </>
  );
}
