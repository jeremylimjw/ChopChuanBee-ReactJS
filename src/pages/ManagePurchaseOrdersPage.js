import { PlusOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Input, Progress, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout';
import MyToolbar from '../components/layout/MyToolbar';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { useApp } from '../providers/AppProvider';

const breadcrumbs = [
  { url: '/purchases/orders', name: 'Purchases' },
  { url: '/purchases/orders', name: 'Orders' },
]

export default function ManagePurchaseOrdersPage() {

    const { handleHttpError } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([])

    const [searchForm, setSearchForm] = useState({
      id: '',
    });

    useEffect(() => {
        setLoading(true);

        let promise;
        if (searchForm.id === '')
            promise = PurchaseOrderApiHelper.getAll();
        else
            promise = PurchaseOrderApiHelper.getById(searchForm.id);
            
        promise.then(results => {
            setPurchaseOrders(results.map(x => new PurchaseOrder(x)));
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    }, [handleHttpError, searchForm]);

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Purchase Orders">

            <MyCard>
                <MyToolbar title="All Purchase Orders">
                    <Input placeholder="Search Order ID" addonAfter={<SearchOutlined />} value={searchForm.id} onChange={(e) => setSearchForm({...searchForm, id: e.target.value })}  />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('./new')}>New Order</Button>
                </MyToolbar>
                <Table dataSource={purchaseOrders} columns={tableColumns} rowKey="id" loading={loading} />
            </MyCard>
            
        </MyLayout>
    )
}

const tableColumns = [
    { title: 'Date', dataIndex: 'created_at', key: 'created_at' },
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', render: (supplier) => supplier.company_name },
    { title: 'Payment Term', key: 'payment_term', align: 'center', render: (_, record) => record.getPaymentTermTag() },
    { title: 'Total Amount', key: 'total', align: 'center', render: (_, record) => `$${record.getOrderTotal().toFixed(2)}` },
    { title: 'Paid', key: 'payments_total', align: 'center', render: (_, record) => 
        <Progress type="circle" percent={Math.round(record.getPaymentsTotal()/record.getOrderTotal()*100)} width={40} /> 
    },
    { title: 'Delivery', dataIndex: '', key: 'delivery', align: 'center', render: (_, record) => {
        return <Progress type="circle" percent={Math.round(record.getTotalReceivedQuantities()/record.getTotalQuantities()*100)} width={40} />
    } },
    { title: 'Status', key: 'purchase_order_status_id', align: 'center', render: (_, record) => record.getStatusTag() },
    { dataIndex: "id", title: "", key: "link", render: (id) => <Link to={`./${id}`}>View</Link> }
]
