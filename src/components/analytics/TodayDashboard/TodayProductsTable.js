import React from "react";
import { Table } from "antd";
import { showTotal } from "../../../utilities/table";
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { formatCurrency } from '../../../utilities/currency';
import { Link } from 'react-router-dom';

export default function TodayProductsTable(props) {    
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
            width: "25%",
            sorter: (a,b) => sortByNumber(a.quantity_sold, b.quantity_sold),
        },
        {
            title: "Selling Price",
            dataIndex: "average_selling_price",
            key: "average_selling_price",
            width: "25%",
            render: (average_selling_price) => formatCurrency(average_selling_price),
            sorter: (a,b) => sortByNumber(a.average_selling_price, b.average_selling_price),
        }
    ];

    return <Table
        dataSource={props.data}
        columns={columns}
        loading={props.loading}
        rowKey="product_uuid"
        size="small"
        pagination={{ pageSize: 5, showTotal }}
    />
}