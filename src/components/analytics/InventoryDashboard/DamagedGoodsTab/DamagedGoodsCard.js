import React, { useEffect, useState } from "react";
import { Typography, Space, Divider, Row, Spin, Tooltip, message } from "antd";
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
    fetchData();
    setLoading(false);
  }, [handleHttpError, loading, props.userInput]);

  const fetchData = () => {
    AnalyticsApiHelper.getDamagedGoodsOrderByQtyDesc(props.startDate, props.endDate)
    .then((results) => {
      if (results.length === 0) {
        setMostDamagedProduct(null);
      } else {
        setMostDamagedProduct(results[0]);
      }
    })
    .catch(handleHttpError);

    AnalyticsApiHelper.getDamagedGoodsOrderByValueDesc(props.startDate, props.endDate)
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
    { mostDamagedProduct && highestValueLoss ?  
    <>
      <Space direction="horizontal" wrap>
        <MyCard style={{ maxWidth: "40vw", marginLeft: "3px", marginBottom: 0 }} >
          <Typography>MOST DAMAGED PRODUCT</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            { loading 
                ? <Spin /> 
                : <><Tooltip title="Click to view product"><Link to={`/inventory/products/${mostDamagedProduct?.product_uuid}`}> {mostDamagedProduct?.name} </Link></Tooltip></>
            }
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "auto" }}>
              TOTAL QUANTITY
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {mostDamagedProduct?.quantity_damaged}
            </Typography>
          </Row>
        </MyCard>

        <MyCard style={{ maxWidth: "40vw", marginLeft: "3px", marginBottom: 0 }} >
          <Typography>HIGHEST VALUE LOSS</Typography>
          <Typography.Title level={2} style={{ margin: 0 }}>
            { loading 
                ? <Spin /> 
                : <><Tooltip title="Click to view product"><Link to={`/inventory/products/${highestValueLoss?.product_uuid}`}> {formatCurrency(highestValueLoss?.total_damaged_inventory_value)} </Link></Tooltip></>
            }
          </Typography.Title>
          <Divider style={{ margin: "0.5rem 0" }} />
          <Row>
            <Typography style={{ fontSize: "0.8rem", marginRight: "20px" }}>
              FROM
            </Typography>
            <Typography style={{ fontSize: "0.8rem", marginLeft: "auto" }}>
              {highestValueLoss?.name}
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
