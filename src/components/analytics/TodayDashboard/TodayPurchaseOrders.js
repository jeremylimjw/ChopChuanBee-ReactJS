import React from "react";
import { Table } from "antd";
import { showTotal } from "../../../utilities/table";
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { formatCurrency } from '../../../utilities/currency';
import { Link } from 'react-router-dom';
import MyCard from "../../common/MyCard";
import MyToolbar from "../../common/MyToolbar";

export default function TodayPurhcaseOrders(props) {    
    const columns = [
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            width: "50%",
            sorter: (a,b) => sortByString(a.product_name, b.product_name),
            
        },
        {
            title: "Qty",
            dataIndex: "quantity_sold",
            key: "quantity_sold",
            width: "1%",
            sorter: (a,b) => sortByNumber(a.quantity_sold, b.quantity_sold),
        },
        {
            title: "Selling Price",
            dataIndex: "average_selling_price",
            key: "average_selling_price",
            width: "25%",
            render: (average_selling_price) => formatCurrency(average_selling_price),
            sorter: (a,b) => sortByNumber(a.average_selling_price, b.average_selling_price),
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
    <MyCard style={{ marginBottom: 0, width: "-webkit-fill-available" }} >
        <MyToolbar title="List of Purchase Orders Created Today"></MyToolbar>
        {/* <Table
            dataSource={data}
            columns={columns}
            loading={props.loading}
            rowKey="product_uuid"
            size="small"
            pagination={{ pageSize: 5, showTotal }}
        /> */}
    </MyCard>
    </>)
}