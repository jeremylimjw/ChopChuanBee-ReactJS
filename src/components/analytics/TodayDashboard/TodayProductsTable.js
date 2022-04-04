import React, { useEffect, useState } from "react";
import { useApp } from "../../../providers/AppProvider";
import { Table } from "antd";
import { AnalyticsApiHelper } from "../../../api/AnalyticsApiHelper";
import { showTotal } from "../../../utilities/table";
import { sortByNumber, sortByString } from '../../../utilities/sorters';
import { formatCurrency } from '../../../utilities/currency';
import { Link } from 'react-router-dom';

export default function TodayProductsTable(props) {
    const { handleHttpError } = useApp();
    const [loading, setLoading] = useState(false);
    
    const columns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
            width: "50%",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            width: "20%",
        },
        {
            title: "Profits",
            dataIndex: "total_profits",
            key: "total_profits",
            width: "20%",
        },
        {
            title: "Action",
            dataIndex: "product_uuid",
            key: "link",
            width: "10%",
            render: (product_uuid) => <Link to = {`/inventory/products/${product_uuid}`}>View</Link>
        },
    ];

    const data = [
        { 
            "name": "Product A",
            "quantity": 123,
            "total_profits": "$150.00",
            "product_uuid": 0,
        },
        { 
            "name": "Product B",
            "quantity": 123,
            "total_profits": "$150.00",
            "product_uuid": 0,
        },
        { 
            "name": "Product C",
            "quantity": 123,
            "total_profits": "$150.00",
            "product_uuid": 0,
        },
        { 
            "name": "Product D",
            "quantity": 123,
            "total_profits": "$150.00",
            "product_uuid": 0,
        },
        { 
            "name": "Product E",
            "quantity": 123,
            "total_profits": "$150.00",
            "product_uuid": 0,
        }
    ]

    return <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="name"
        pagination={{ showTotal }}
    />
}