import { PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, Progress, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout';
import MyToolbar from '../components/layout/MyToolbar';
import { useApp } from '../providers/AppProvider';
import { getOrderTotal, getPaymentsTotal } from '../utilities/purchaseOrder';

const breadcrumbs = [
  { url: '/purchases/orders', name: 'Purchases' },
  { url: '/purchases/orders', name: 'Orders' },
]

export default function ManagePurchaseOrdersPage() {

    const { handleHttpError } = useApp();
    const navigate = useNavigate();
    const [purchaseOrders, setPurchaseOrders] = useState([])

    useEffect(() => {
        PurchaseOrderApiHelper.getAll()
            .then(results => {
                setPurchaseOrders(results);
            })
            .catch(handleHttpError);
    }, [handleHttpError]);

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Purchase Orders">

            <MyCard>
                <MyToolbar title="All Purchase Orders">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('./new')}>New Order</Button>
                </MyToolbar>
                <Table dataSource={purchaseOrders} columns={tableColumns} rowKey="id" />
            </MyCard>
            
        </MyLayout>
    )
}

const tableColumns = [
    { title: 'Date', dataIndex: 'created_at', key: 'created_at' },
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', render: (supplier) => supplier.company_name },
    { title: 'Payment Term', dataIndex: 'payment_term', key: 'payment_term', align: 'center', render: (payment_term) => {
        switch (payment_term?.id) {
            case 1:
                return (<Tag color='green'>{payment_term.name}</Tag>)
            case 2:
                return (<Tag color='geekblue'>{payment_term.name}</Tag>)
            default:
                return '-';
        }
     } },
    { title: 'Total Amount', dataIndex: 'totalAmount', key: 'totalAmount', align: 'center', render: (_, record) => {
        const total = getOrderTotal(record);
        return total == 0 ? '-': `$${total.toFixed(2)}`;
    } },
    { title: 'Paid', dataIndex: 'payments', key: 'payments', align: 'center', render: (payments, record) => {
        if (record.purchase_order_status_id !== 2) {
            return '-';
        }

        if (record.payment_term_id === 1) { // If payment by cash, always fully paid
            return <Progress type="circle" percent={100} width={40} />
        } else { // If made in credit, create AP
            const orderTotal = getOrderTotal(record);
            const percentage = getPaymentsTotal(record)/orderTotal;
    
            return <Progress type="circle" percent={percentage*100} width={40} />
        }
    } },
    { title: 'Delivery', dataIndex: '', key: 'delivery', align: 'center', render: (_, record) => {
        if (record.purchase_order_status_id !== 2) {
            return '-';
        }

        // TODO: logic for delivery
        return <Progress type="circle" percent={0} width={40} />
    } },
    { title: 'Status', dataIndex: 'purchase_order_status', key: 'purchase_order_status', align: 'center', render: (purchase_order_status) => {
        switch (purchase_order_status.id) {
            case 1:
                return (<Tag color='orange'>{purchase_order_status.name}</Tag>)
            case 2:
                return (<Tag color='green'>{purchase_order_status.name}</Tag>)
            case 3:
                return (<Tag color='volcano'>{purchase_order_status.name}</Tag>)
            case 4:
                return (<Tag color='geekblue'>{purchase_order_status.name}</Tag>)
            case 5:
                return (<Tag color='volcano'>{purchase_order_status.name}</Tag>)
            default:
                return <></>
        }
    } },
    { dataIndex: "id", title: "", key: "link", render: (id) => {
        return (<Link to={`./${id}`}>View</Link>);
      }
    }
]
