import React, { useEffect, useState, useCallback } from "react";
import { Table } from "antd";
import { showTotal } from "../../../utilities/table";
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { formatCurrency } from '../../../utilities/currency';
import { Link } from 'react-router-dom';
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";
import { useApp } from "../../../providers/AppProvider";
import { AnalyticsApiHelper } from "../../../api/AnalyticsApiHelper";

export default function TodayPurchaseOrders(props) {   
    const { handleHttpError } = useApp();
    const [loading, setLoading]  = useState(true);
    const [data, setData] = useState([]);

    const fetchData = useCallback(
        async () => {
            await AnalyticsApiHelper.getPOTable(props.currDate, props.currTime)
            .then((results) => {
              results.map(x => {
                  x.supplier_name = x.supplier.company_name;
                  let PO_items_sum = 0;
                  x.purchase_order_items.forEach((item) => {
                      if (item.unit_cost !== null) {
                          PO_items_sum += parseFloat(item.unit_cost) * parseInt(item.quantity);
                      }
                  })
                  x.total_amount = PO_items_sum;
                  return x;
              }); 
              setData(results);
              setLoading(false);
            })
            .catch(handleHttpError);
        }
        ,[props, handleHttpError, setData]
    )

    useEffect(() => {
        fetchData();
    }, [fetchData, loading]);

    const columns = [
        {
            title: "PO ID",
            dataIndex: "id",
            key: "id",
            width: "15%",
            sorter: (a,b) => sortByString(a.id, b.id),
            
        },
        {
            title: "Supplier",
            dataIndex: "supplier_name",
            key: "supplier_name",
            width: "40%",
            sorter: (a,b) => sortByNumber(a.supplier_name, b.supplier_name),
        },
        {
            title: "Total",
            dataIndex: "total_amount",
            key: "total_amount",
            width: "15%",
            render: (total_amount) => formatCurrency(total_amount),
            sorter: (a,b) => sortByNumber(a.total_amount, b.total_amount),
        },
        {
            title: "Action",
            dataIndex: "id",
            key: "link",
            width: "1%",
            render: (id) => <Link to = {`/supplier/procurements/${id}`}>View</Link>
        },
    ];

    return (<>
    <MyCard style={{ marginBottom: 0, width: "-webkit-fill-available" }} >
        <MyToolbar title="Purchase Orders Created Today"></MyToolbar>
        <Table
            dataSource={data}
            columns={columns}
            loading={props.loading}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, showTotal }}
        />
    </MyCard>
    </>)
}