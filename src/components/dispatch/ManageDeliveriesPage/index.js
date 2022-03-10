import { Button, Table, Input, Select, Form } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { useApp } from "../../../providers/AppProvider";
import { SupplierAPIHelper } from "../../../api/SupplierAPIHelper";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import { showTotal } from "../../../utilities/table";
import { parseDate, parseDateTimeSeconds } from "../../../utilities/datetime";
import { sortByDate, sortByNumber, sortByString } from "../../../utilities/sorters";
import { getActiveTag } from "../../../enums/ActivationStatus";
import MyToolbar from "../../common/MyToolbar";
import { View } from "../../../enums/View";
import { DeliveryApiHelper } from "../../../api/DeliveryApiHelper";
import { getDeliveryStatus, getDeliveryStatusTag } from "../../../enums/DeliveryStatus";

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
    SupplierAPIHelper.get(form)
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

  return (
    <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Delivery Orders">
      <MyCard>
        <MyToolbar title="Delivery Orders">
          <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
            <Form.Item name="company_name">
                <Input placeholder='Search Company' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="s1_name">
                <Input placeholder='Search Person Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
            </Form.Item>
            <Form.Item name="status">
              <Select style={{ width: 140 }} placeholder="Filter by Status">
                <Select.Option value={null}>All</Select.Option>
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Button onClick={resetForm}>Reset</Button>
          </Form>
        </MyToolbar>

        <Table 
          dataSource={orders} 
          columns={columns} 
          loading={loading} 
          rowKey="id" 
          pagination={{ showTotal: showTotal }}
        />
      </MyCard>

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
    sorter: (a, b) => sortByNumber(a.sales_order_id, b.sales_order_id),
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
    dataIndex: "sales_order_id",
    key: "link",
    width: 185,
    ellipsis: true,
    render: (sales_order_id) => (
        <>
        <Button type="link" style={{ paddingLeft: 0 }}>Unassign</Button>
        <Button type="link" style={{ paddingLeft: 0 }}>Complete</Button>
        </>
    ),
  },
];
