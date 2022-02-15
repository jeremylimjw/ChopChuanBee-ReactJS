import { PlusOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, DatePicker, Input, Progress, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PurchaseOrderApiHelper } from '../api/purchaseOrder';
import MyCard from '../components/layout/MyCard';
import MyLayout from '../components/layout/MyLayout';
import MyToolbar from '../components/layout/MyToolbar';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { useApp } from '../providers/AppProvider';
import { parseDateTime } from '../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../utilities/sorters';
import moment from 'moment';

const breadcrumbs = [
  { url: '/procurements', name: 'Procurements' },
]
const initialSearchForm = {
  id: '',
  month: null,
  year: null,
};

export default function ManagePurchaseOrdersPage() {

    const { handleHttpError } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([])

    const [searchForm, setSearchForm] = useState({...initialSearchForm});

    useEffect(() => {
        setLoading(true);

        let promise;
        if (searchForm.id === '') {
            if (searchForm.month != null) {
                const startDate = searchForm.month.set({ date: 1, hour: 0, minute: 0, second: 0, milisecond: 0 }).toDate();
                const endDate = moment(startDate).add(1, 'month').toDate();
                promise = PurchaseOrderApiHelper.getAll(startDate, endDate);
            } else if (searchForm.year != null) {
                const startDate = searchForm.year.set({ date: 1, month: 1, hour: 0, minute: 0, second: 0, milisecond: 0 }).toDate();
                const endDate = moment(startDate).add(1, 'year').toDate();
                promise = PurchaseOrderApiHelper.getAll(startDate, endDate);
            } else {
                promise = PurchaseOrderApiHelper.getAll();
            }
        } else {
            promise = PurchaseOrderApiHelper.getById(searchForm.id);
        }
            
        promise.then(results => {
            setPurchaseOrders(results.map(x => new PurchaseOrder(x)));
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    }, [handleHttpError, searchForm]);

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Procurements">

            <MyCard>
                <MyToolbar title="Procurements">
                    <Input placeholder="Search Order ID" suffix={<SearchOutlined className='grey' />} value={searchForm.id} onChange={(e) => setSearchForm({...searchForm, id: e.target.value })} />
                    <DatePicker placeholder="Filter Month" picker="month" value={searchForm.month} onChange={(value) => setSearchForm({...searchForm, month: value })} />
                    <DatePicker placeholder="Filter Year" picker="year" value={searchForm.year} onChange={(value) => setSearchForm({...searchForm, year: value })} />
                    <Button onClick={() => setSearchForm({...initialSearchForm})}>Reset</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('./new')}>New Order</Button>
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
