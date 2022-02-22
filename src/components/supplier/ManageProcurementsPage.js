import { PlusOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, DatePicker, Input, Progress, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useApp } from '../../providers/AppProvider';
import { PurchaseOrderApiHelper } from '../../api/PurchaseOrderApiHelper';
import MyLayout from '../common/MyLayout';
import MyCard from '../common/MyCard';
import MyToolbar from '../common/MyToolbar';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { parseDateTime } from '../../utilities/datetime';

const breadcrumbs = [
  { url: '/supplier/procurements', name: 'Procurements' },
]

export default function ManageProcurementsPage() {

    const { handleHttpError } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([])

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Procurements">

            <MyCard>
                <MyToolbar title="Procurements">
                </MyToolbar>
                <Table dataSource={purchaseOrders} columns={tableColumns} rowKey="id" loading={loading} />
            </MyCard>
            
        </MyLayout>
    )
}

const tableColumns = [
    { 
        title: 'Date', 
        dataIndex: 'created_at', 
        key: 'created_at', 
        width: '16%', 
        sorter: (a, b) => sortByDate(a.created_at, b.created_at), 
        render: (created_at) => parseDateTime(created_at),
    },
    { 
        title: 'Order ID', 
        dataIndex: 'id', 
        key: 'id', 
        width: '11%', 
        sorter: (a, b) => sortByNumber(a.id, b.id),
    },
    { 
        title: 'Supplier', 
        dataIndex: 'supplier', 
        key: 'supplier', 
        render: (supplier) => supplier.company_name,
        sorter: (a, b) => sortByString(a.supplier.company_name, b.supplier.company_name),
    },
    { 
        title: 'Payment Term', 
        key: 'payment_term', 
        align: 'center', 
        width: '11%', 
        render: (_, record) => record.getPaymentTermTag(),
        sorter: (a, b) => sortByNumber(a.payment_term_id, b.payment_term_id), 
    },
    { 
        title: 'Total', 
        key: 'total', 
        align: 'center', 
        width: '8%', 
        render: (_, record) => `$${record.getOrderTotal().toFixed(2)}`,
        sorter: (a, b) => sortByNumber(a.getOrderTotal(), b.getOrderTotal()), 
    },
    { 
        title: 'Paid', 
        key: 'payments_total', 
        align: 'center', 
        width: '8%', 
        render: (_, record) => <Progress type="circle" percent={record.getPaymentProgress()} width={40} />,
        sorter: (a, b) => sortByNumber(a.getPaymentProgress(), b.getPaymentProgress()), 
    },
    { 
        title: 'Delivery', 
        dataIndex: '', 
        key: 'delivery', 
        width: '8%', 
        align: 'center', 
        render: (_, record) => <Progress type="circle" percent={record.getQuantityProgress()} width={40} />,
        sorter: (a, b) => sortByNumber(a.getQuantityProgress(), b.getQuantityProgress()), 
    },
    { 
        title: 'Status', 
        key: 'purchase_order_status_id', 
        align: 'center', 
        width: '8%', 
        render: (_, record) => record.getStatusTag(),
        sorter: (a, b) => sortByNumber(a.purchase_order_status_id, b.purchase_order_status_id), 
    },
    { 
        dataIndex: "id", 
        title: "", 
        key: "link", 
        width: '8%', 
        render: (id) => <Link to={`./${id}`}>View</Link> 
    }
]
