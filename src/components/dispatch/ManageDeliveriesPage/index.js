import { Button, Table, Input, Select, Form, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import debounce from "lodash.debounce";
import { useApp } from "../../../providers/AppProvider";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import { showTotal } from "../../../utilities/table";
import { parseDateTimeSeconds } from "../../../utilities/datetime";
import { sortByDate, sortByNumber, sortByString } from "../../../utilities/sorters";
import MyToolbar from "../../common/MyToolbar";
import { DeliveryApiHelper } from "../../../api/DeliveryApiHelper";
import { DeliveryStatus, getDeliveryStatusTag } from "../../../enums/DeliveryStatus";
import ViewDeliveryOrderModal from "../ViewDeliveryOrderModal";
import { Link } from "react-router-dom";
import NewDeliveryModal from "./NewDeliveryModal";
import { View } from "../../../enums/View";

const breadcrumbs = [
  { url: "/dispatch/deliveryOrders", name: "Dispatch" },
  { url: "/dispatch/deliveryOrders", name: "Delivery Orders" },
];

export default function ManageDeliveriesPage() {
  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showDeliveryOrder, setShowDeliveryOrder] = useState();

  columns[8].render = (_, record) => <Button type="link" style={{ paddingLeft: 0 }} onClick={() => setShowDeliveryOrder(record)}>View</Button>;

  useEffect(() => {
    setLoading(true);
    DeliveryApiHelper.getOrders()
      .then(results => {
        setOrders(results);
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
  }, [handleHttpError, setLoading])

  function onValuesChange(_, form) {
    DeliveryApiHelper.getOrders(form)
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

  function refreshDeliveryOrders() {
    onValuesChange(null, form.getFieldsValue());
  }

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Delivery Orders">
      <MyCard>
        <MyToolbar title="Delivery Orders">
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
            <Form.Item name="delivery_status_id">
              <Select style={{ width: 140 }} placeholder="Filter by Status">
                <Select.Option value={null}>All</Select.Option>
                {Object.keys(DeliveryStatus).map((key, idx) => <Select.Option key={idx} value={DeliveryStatus[key].id}>{DeliveryStatus[key].name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Button onClick={resetForm}>Reset</Button>
          </Form>
          { hasWriteAccessTo(View.DISPATCH.name) && 
            <Button type='primary' onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>New</Button>
          }
        </MyToolbar>

        <Table 
          dataSource={orders} 
          columns={columns} 
          loading={loading} 
          rowKey="id" 
          pagination={{ showTotal: showTotal }}
        />
      </MyCard>

      <ViewDeliveryOrderModal 
        showDeliveryOrder={showDeliveryOrder} 
        setShowDeliveryOrder={setShowDeliveryOrder} 
        myCallback={refreshDeliveryOrders}
      />

      <NewDeliveryModal 
        orders={orders} 
        setOrders={setOrders} 
        isModalVisible={isModalVisible} 
        setIsModalVisible={setIsModalVisible} 
      />

    </MyLayout>
  );
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
    title: 'Status',
    dataIndex: 'delivery_status_id',
    key: 'delivery_status_id',
    width: 120,
    align: 'center',
    ellipsis: true,
    render: (delivery_status_id) => getDeliveryStatusTag(delivery_status_id),
    sorter: (a, b) => sortByNumber(a.delivery_status_id, b.delivery_status_id),
  },
  {
    title: "Action",
    key: "link",
    width: 100,
    ellipsis: true,
  },
];
