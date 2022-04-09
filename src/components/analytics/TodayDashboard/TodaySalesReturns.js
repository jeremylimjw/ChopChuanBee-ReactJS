import React, { useState, useEffect, useCallback } from "react";
import { Table } from "antd";
import { showTotal } from "../../../utilities/table";
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { Link } from 'react-router-dom';
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";
import { useApp } from "../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../api/AnalyticsApiHelper";

export default function TodaySalesReturns(props) {    
    const { handleHttpError } = useApp();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);

    const fetchData = useCallback(
        async() => {
            await AnalyticsApiHelper.getCustomerReturnedGoodsOrderByQtyDesc(props.currDate, props.currTime)
            .then((results) => {
              setData(results);
              setLoading(false);
            })
            .catch(handleHttpError);
        }, [props, handleHttpError, setData]
    )

    useEffect(() => {
        fetchData();
      }, [fetchData, loading]);

    const columns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
            width: "50%",
            sorter: (a,b) => sortByString(a.name, b.name),
            
        },
        {
            title: "Qty",
            dataIndex: "quantity_returned",
            key: "quantity_returned",
            width: "1%",
            sorter: (a,b) => sortByNumber(a.quantity_returned, b.quantity_returned),
        },
        {
            title: "Action",
            dataIndex: "product_uuid",
            key: "link",
            width: "1%",
            render: (product_uuid) => <Link to = {`/inventory/products/${product_uuid}`}>View</Link>
        },
    ];

    return (<>
    <MyCard style={{ marginRight: 0, marginBottom: 0, width: "-webkit-fill-available" }} >
        <MyToolbar title="Sales Returns Today"></MyToolbar>
        <Table
            dataSource={data}
            columns={columns}
            loading={props.loading}
            rowKey="product_uuid"
            size="small"
            pagination={{ pageSize: 3, showTotal }}
        />
    </MyCard>
    </>)
}