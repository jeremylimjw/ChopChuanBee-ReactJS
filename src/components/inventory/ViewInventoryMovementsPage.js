import { Button, Input, Select, Table, DatePicker, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import debounce from 'lodash.debounce';
import { SearchOutlined } from '@ant-design/icons';
import { useApp } from '../../providers/AppProvider';
import MyLayout from '../common/MyLayout';
import MyCard from '../common/MyCard';
import MyToolbar from '../common/MyToolbar';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { showTotal } from '../../utilities/table';
import { InventoryMovementsApiHelper } from '../../api/InventoryMovementsApiHelper';
import { MovementType, getSpecialMovementTypeTag } from '../../enums/MovementType';
import { Link } from 'react-router-dom';
import { parseDateTime } from '../../utilities/datetime';

const breadcrumbs = [
    { url: '/inventory/movements', name: 'Inventory' },
    { url: '/inventory/movements', name: 'Movements' },
]

export default function ViewInventoryMovementsPage() {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        InventoryMovementsApiHelper.get()
            .then(results => {
                setItems(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])


    function onValuesChange(_, form) {
        let start_date, end_date;
        if (form.date && form.date[0] && form.date[1]) {
            start_date = moment(form.date[0]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
            end_date = moment(form.date[1]).set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toDate();
        }
        InventoryMovementsApiHelper.get({...form, start_date, end_date })
            .then(results => {
                setItems(results);
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
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="View Inventory Movements">

            <MyCard>

                <MyToolbar title="Inventory Movements">
                    <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                        <Form.Item name="product_name">
                            <Input placeholder='Search Product' suffix={<SearchOutlined className='grey' />} />
                        </Form.Item>
                        <Form.Item name="date">
                            <DatePicker.RangePicker />
                        </Form.Item>
                        <Form.Item name="movement_type_id">
                            <Select style={{ width: 150 }} placeholder="Filter by Type" >
                                <Select.Option value={null}>All</Select.Option>
                                { Object.keys(MovementType).map((key, index) => <Select.Option key={index} value={MovementType[key].id}>{MovementType[key].name}</Select.Option>) }
                            </Select>
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                </MyToolbar>

                <Table 
                    dataSource={items} 
                    columns={columns} 
                    loading={loading} 
                    rowKey="id"
                    pagination={{ showTotal: showTotal }} 
                />
                
            </MyCard>
        
        </MyLayout>
    )
}

const columns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      ellipsis: true,
      render: (created_at) => parseDateTime(created_at),
      sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
      title: 'Name',
      key: 'company_name',
      ellipsis: true,
      width: '20%',
      render: (_, record) => getCompanyName(record),
      sorter: (a, b) => sortByString(getCompanyName(a), getCompanyName(b)),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      ellipsis: true,
      width: '20%',
      render: (product) => product?.name,
      sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
    },
    {
      title: 'Movement Type',
      dataIndex: 'movement_type_id',
      key: 'movement_type_id',
      align: 'center',
      width: '20%',
      render: (_, record) => getSpecialMovementTypeTag(record),
      sorter: (a, b) => sortByNumber(a.movement_type_id, b.movement_type_id),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '20%',
      sorter: (a, b) => sortByNumber(a.quantity, b.quantity),
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      width: '20%',
      render: (unit_cost) => unit_cost ? `$${(+unit_cost).toFixed(2)}` : '-',
      sorter: (a, b) => sortByNumber(a.unit_cost || 0, b.unit_cost || 0),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      width: '20%',
      render: (unit_price) => unit_price ? `$${(+unit_price).toFixed(2)}` : '-',
      sorter: (a, b) => sortByNumber(a.unit_price || 0, b.unit_price || 0),
    },
    {
      title: "Action",
      key: "link",
      width: 100,
      ellipsis: true,
      render: (_, record) => 
        record.purchase_order_item ? 
          <Link to={`/supplier/procurements/${record.purchase_order_item.purchase_order_id}`}>View</Link> 
          : 
          <Link to={`/customer/sales/${record.sales_order_item?.sales_order_id}`}>View</Link>,
    },
]

function getCompanyName(record) {
  if (record.purchase_order_item) {
    return record.purchase_order_item.purchase_order.supplier.company_name;
  } else if (record.sales_order_item) {
    return record.sales_order_item.sales_order.customer.company_name;
  } else {
    return '-';
  }
}
