import { PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { getSpecialMovementTypeTag } from '../../../enums/MovementType';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { parseDateTime } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyToolbar from '../../common/MyToolbar';
import CreateMovementModal from './CreateMovementModal';

export default function P3InventoryTable({ product }) {

  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (product) {
      ProductApiHelper.getInventoryMovements(product.id)
        .then(results => {
          setMovements(results);
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    }
  }, [product, setLoading, handleHttpError])

  return (
    <>
      <MyToolbar title="Inventory">
        { hasWriteAccessTo(View.INVENTORY.name) && 
          <Button type="primary" icon={<PlusOutlined />} loading={loading} onClick={() => setIsModalVisible(true)}>Damaged Goods</Button> // MovementType.DAMAGED and unit_price = 0
        }
      </MyToolbar>
      
      <Table dataSource={movements} 
        columns={columns} 
        loading={loading} 
        pagination={{ showTotal: showTotal }}
        rowKey="id"
      />

      <CreateMovementModal 
        product={product}
        isModalVisible={isModalVisible} 
        setIsModalVisible={setIsModalVisible} 
        setMovements={setMovements}
      />
    </>  
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
    render: (_, record) => {
      if (record.purchase_order_item) {
        return <Link to={`/supplier/procurements/${record.purchase_order_item.purchase_order_id}`}>View</Link>;
      }
      if (record.sales_order_item) {
        return <Link to={`/customer/sales/${record.sales_order_item?.sales_order_id}`}>View</Link>;
      }

      return <Button style={{ margin: 0, padding: 0 }} type='link' disabled>View</Button>
    }
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