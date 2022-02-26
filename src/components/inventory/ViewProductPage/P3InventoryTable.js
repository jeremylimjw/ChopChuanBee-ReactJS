import { Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { getMovementTypeTag } from '../../../enums/MovementType';
import { useApp } from '../../../providers/AppProvider';
import { parseDateTime } from '../../../utilities/datetime';
import { sortByDate, sortByNumber } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyToolbar from '../../common/MyToolbar';

export default function P3InventoryTable({ product }) {

  const { handleHttpError } = useApp();

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
          </MyToolbar>
          
          <Table dataSource={movements} 
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
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 180,
    ellipsis: true,
    render: (created_at) => parseDateTime(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Movement Type',
    dataIndex: 'movement_type_id',
    key: 'movement_type_id',
    align: 'center',
    width: '20%',
    render: (movement_type_id) => getMovementTypeTag(movement_type_id),
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
        <Link to={`/customer/procurements/${record.sales_order_item.sales_order_id}`}>View</Link>, // TODO
  },
]

