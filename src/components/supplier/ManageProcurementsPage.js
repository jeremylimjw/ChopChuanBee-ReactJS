import { PlusOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, DatePicker, Form, Input, Progress, Select, Table } from 'antd';
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
import { POStatus } from '../../enums/PurchaseOrderStatus';
import debounce from 'lodash.debounce';
import moment from 'moment';
import { View } from '../../enums/View';
import { PurchaseOrder } from '../../models/PurchaseOrder';

const breadcrumbs = [
    { url: '/supplier/procurements', name: 'Supplier' },
    { url: '/supplier/procurements', name: 'Procurements' },
]

export default function ManageProcurementsPage() {

    const { handleHttpError, hasWriteAccessTo } = useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        PurchaseOrderApiHelper.get()
            .then(results => {
                setPurchaseOrders(results.map(x => new PurchaseOrder(x)));
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])


    function onValuesChange(_, form) {
        let startDate, endDate;
        if (form.date && form.date[0] && form.date[1]) {
            startDate = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            endDate = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        PurchaseOrderApiHelper.get({...form, startDate, endDate })
            .then(results => {
                setPurchaseOrders(results.map(x => new PurchaseOrder(x)));
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Procurements">

            <MyCard>
                <MyToolbar title="Procurements">
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="id">
                            <Input placeholder='Search Order ID' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="date">
                            <DatePicker.RangePicker />
                        </Form.Item>
                        <Form.Item name="purchase_order_status_id">
                            <Select style={{ width: 180 }} placeholder="Filter by Status">
                                <Select.Option value={null}>All</Select.Option>
                                {Object.keys(POStatus).map((key, idx) => 
                                    <Select.Option key={idx} value={POStatus[key].id}>{POStatus[key].name}</Select.Option>)
                                }
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    { hasWriteAccessTo(View.SCM.name) && 
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('./new')}>New</Button>
                    }
                </MyToolbar>
                <Table dataSource={purchaseOrders} columns={tableColumns} rowKey="id" loading={loading} />
            </MyCard>
            
        </MyLayout>
    )
}

const tableColumns = [
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      ellipsis: true,
      render: (created_at) => parseDateTime(created_at),
      sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    { 
        title: 'Order ID', 
        dataIndex: 'id', 
        key: 'id', 
        width: '11%', 
        ellipsis: true,
        sorter: (a, b) => sortByNumber(a.id, b.id),
    },
    { 
        title: 'Supplier', 
        dataIndex: 'supplier', 
        key: 'supplier', 
        ellipsis: true,
        render: (supplier) => supplier.company_name,
        sorter: (a, b) => sortByString(a.supplier.company_name, b.supplier.company_name),
    },
    { 
        title: 'Payment Term', 
        key: 'payment_term', 
        align: 'center', 
        width: '11%', 
        ellipsis: true,
        render: (_, record) => record.getPaymentTermTag(),
        sorter: (a, b) => sortByNumber(a.payment_term_id, b.payment_term_id), 
    },
    { 
        title: 'Total', 
        key: 'total', 
        align: 'center', 
        width: 100, 
        ellipsis: true,
        render: (_, record) => `$${record.getOrderTotal().toFixed(2)}`,
        sorter: (a, b) => sortByNumber(a.getOrderTotal(), b.getOrderTotal()), 
    },
    { 
        title: 'Paid', 
        key: 'payments_total', 
        align: 'center', 
        width: 100, 
        render: (_, record) => <Progress type="circle" percent={record.getPaymentProgress()} width={40} />,
        sorter: (a, b) => sortByNumber(a.getPaymentProgress(), b.getPaymentProgress()), 
    },
    { 
        title: 'Delivery', 
        dataIndex: '', 
        key: 'delivery', 
        width: 100, 
        align: 'center', 
        render: (_, record) => <Progress type="circle" percent={record.getQuantityProgress()} width={40} />,
        sorter: (a, b) => sortByNumber(a.getQuantityProgress(), b.getQuantityProgress()), 
    },
    { 
        title: 'Status', 
        key: 'purchase_order_status_id', 
        align: 'center', 
        width: 100, 
        render: (_, record) => record.getStatusTag(),
        sorter: (a, b) => sortByNumber(a.purchase_order_status_id, b.purchase_order_status_id), 
    },
    { 
        dataIndex: "id", 
        title: "", 
        key: "link", 
        width: 100, 
        render: (id) => <Link to={`./${id}`}>View</Link> 
    }
]
