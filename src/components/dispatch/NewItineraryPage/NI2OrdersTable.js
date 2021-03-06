import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, InputNumber, message, Table } from 'antd';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { DeliveryApiHelper } from '../../../api/DeliveryApiHelper';
import { DeliveryStatus } from '../../../enums/DeliveryStatus';
import { useApp } from '../../../providers/AppProvider';
import { parseDateTimeSeconds } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';

export default function NI2OrdersTable({ itinerary, setItinerary, selectedOrders, setSelectedOrders, step, setStep }) {

  const { handleHttpError } = useApp();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setLoading(true);
    DeliveryApiHelper.getOrders({ delivery_status_id: DeliveryStatus.PENDING.id })
      .then(results => {
        setOrders(results);
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
  }, [handleHttpError, setLoading])

  function onValuesChange(_, form) {
    DeliveryApiHelper.getOrders({ ...form, delivery_status_id: DeliveryStatus.PENDING.id })
      .then(results => {
        setOrders(results);
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
  }

  function resetForm() {
    form.resetFields();
    onValuesChange(null, form.getFieldsValue());
  }

  function handleRowSelect(_, selectedRows) {
    setSelectedOrders(selectedRows);
  }

  async function nextStep() {
    setLoading(true);
    DeliveryApiHelper.optimizeRoutes({ longitude: itinerary.longitude, latitude: itinerary.latitude }, selectedOrders)
      .then(waypoint_order => {
        const newOrders = [];
        for (let index of waypoint_order) {
            newOrders.push(selectedOrders[index]);
        }
        
        setSelectedOrders(newOrders);

        message.success('Delivery orders successfully optimized!');

        setLoading(false);
        setStep(step+1);
      })
      .catch(handleHttpError)
      .catch(() => {
        setLoading(false);
        setStep(step+1);
      })
  }

  return (
    <>
      <MyCard>
        <MyToolbar title="Outstanding Delivery Orders">
          <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
            <Form.Item name="sales_order_id">
              <InputNumber min={0} placeholder='Search Sales Order ID' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="customer_company_name">
              <Input placeholder='Search Company' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="customer_p1_name">
              <Input placeholder='Search Customer' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Button onClick={resetForm}>Reset</Button>
          </Form>
        </MyToolbar>

        <Table loading={loading}
          rowSelection={{ type: 'checkbox', onChange: handleRowSelect, selectedRowKeys: selectedOrders.map(x => x.id) }}
          columns={columns}
          dataSource={orders}
          pagination={{ pageSize: 6, showTotal: showTotal }}
          rowKey="id"
        />

        <MyToolbar style={{ marginTop: 15 }}>
          <Button onClick={() => setStep(step - 1)}>Back</Button>
          <Button type="primary" onClick={nextStep} disabled={selectedOrders.length === 0} loading={loading}>Optimize</Button>
        </MyToolbar>
      </MyCard>
    </>
  )
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 200,
    ellipsis: true,
    render: (created_at) => parseDateTimeSeconds(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Order ID',
    dataIndex: 'sales_order_id',
    key: 'sales_order_id',
    width: 120,
    ellipsis: true,
    render: (sales_order_id) => sales_order_id ? <Link to={`/customer/sales/${sales_order_id}`}>{sales_order_id}</Link> : '-',
    sorter: (a, b) => sortByNumber(a.sales_order_id, b.sales_order_id),
  },
  {
    title: 'Company',
    dataIndex: 'customer_company_name',
    key: 'customer_company_name',
    width: '20%',
    ellipsis: true,
    render: (customer_company_name, record) => customer_company_name ? <Link to={`/customer/customers/${record.customer_id}`}>{customer_company_name}</Link> : '-',
    sorter: (a, b) => sortByString(a.customer_company_name || '-', b.customer_company_name || '-'),
  },
  {
    title: 'Customer',
    dataIndex: 'customer_p1_name',
    key: 'customer_p1_name',
    width: '20%',
    ellipsis: true,
    render: (customer_p1_name, record) => customer_p1_name ? <Link to={`/customer/customers/${record.customer_id}`}>{customer_p1_name}</Link> : '-',
    sorter: (a, b) => sortByString(a.customer_p1_name || '-', b.customer_p1_name || '-'),
  },
  {
    title: 'Contact Number',
    dataIndex: 'customer_phone_number',
    key: 'customer_phone_number',
    width: '20%',
    ellipsis: true,
    render: (customer_phone_number) => customer_phone_number || '-',
    sorter: (a, b) => sortByString(a.customer_phone_number || '-', b.customer_phone_number || '-'),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: '20%',
    ellipsis: true,
    sorter: (a, b) => sortByString(a.address, b.address),
  },
  {
    title: 'Postal Code',
    dataIndex: 'postal_code',
    key: 'postal_code',
    width: '20%',
    ellipsis: true,
    sorter: (a, b) => sortByString(a.postal_code, b.postal_code),
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    key: 'remarks',
    width: '20%',
    ellipsis: true,
    render: (remarks) => remarks || '-',
    sorter: (a, b) => sortByString(a.remarks, b.remarks),
  },
];
