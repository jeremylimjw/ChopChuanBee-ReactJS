import { SearchOutlined } from '@ant-design/icons/lib/icons'
import { Button, DatePicker, Form, Input, Progress, Select, Table } from 'antd'
import debounce from 'lodash.debounce';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SalesOrderApiHelper } from '../../../api/SalesOrderApiHelper';
import { PaymentTerm } from '../../../enums/PaymentTerm';
import { SOStatus } from '../../../enums/SalesOrderStatus';
import { SalesOrder } from '../../../models/SalesOrder';
import { useApp } from '../../../providers/AppProvider';
import { parseDateTime } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyToolbar from '../../common/MyToolbar'

export default function C3History({ customer }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (customer) {
            setLoading(true);
            SalesOrderApiHelper.get({ customer_id: customer.id })
                .then(results => {
                    setItems(results.map(x => new SalesOrder(x)));
                    setLoading(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        }
    }, [customer, setLoading, handleHttpError])

    function onValuesChange(_, form) {
        let startDate, endDate;
        if (form.date && form.date[0] && form.date[1]) {
            startDate = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            endDate = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        setLoading(true);
        SalesOrderApiHelper.get({...form, startDate, endDate, customer_id: customer.id })
            .then(results => {
                setItems(results.map(x => new SalesOrder(x)));
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
        <>
            <MyToolbar title="Past Order History">
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name="id">
                        <Input placeholder='Search Order ID' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                    </Form.Item>
                    <Form.Item name="date">
                        <DatePicker.RangePicker />
                    </Form.Item>
                    <Form.Item name="payment_term_id">
                        <Select style={{ width: 180 }} placeholder="Filter by Payment Term">
                            <Select.Option value={null}>All</Select.Option>
                            {Object.keys(PaymentTerm).map((key, idx) => 
                                <Select.Option key={idx} value={PaymentTerm[key].id}>{PaymentTerm[key].name}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="sales_order_status_id">
                        <Select style={{ width: 180 }} placeholder="Filter by Status">
                            <Select.Option value={null}>All</Select.Option>
                            {Object.keys(SOStatus).map((key, idx) => 
                                <Select.Option key={idx} value={SOStatus[key].id}>{SOStatus[key].name}</Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Button onClick={resetForm}>Reset</Button>
                </Form>
            </MyToolbar>

            <Table 
                dataSource={items} 
                columns={columns} 
                loading={loading} 
                pagination={{ showTotal: showTotal }}
                rowKey="id" 
            />
        </>
    )
}

const columns = [
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
        title: 'Customer', 
        dataIndex: 'customer', 
        key: 'customer', 
        ellipsis: true,
        render: (customer) => customer.company_name,
        sorter: (a, b) => sortByString(a.customer.company_name, b.customer.company_name),
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
        render: (id) => <Link to={`/customer/sales/${id}`}>View</Link> 
    }
]
