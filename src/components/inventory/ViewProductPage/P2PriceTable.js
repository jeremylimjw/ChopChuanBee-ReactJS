import { Button, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters'
import MyToolbar from '../../common/MyToolbar'
import { showTotal } from '../../../utilities/table';
import { useApp } from '../../../providers/AppProvider'
import { parseDate } from '../../../utilities/datetime'
import { ProductApiHelper } from '../../../api/ProductApiHelper'
import { Link } from 'react-router-dom';
import { PurchaseOrderApiHelper } from '../../../api/PurchaseOrderApiHelper';
import { useNavigate } from 'react-router';

export default function P2PriceTable({ product }) {

  const { handleHttpError } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  columns[4].render = (id) => (
    <Space size="middle">
      <Link to={`/supplier/procurements/${id}`}>View</Link>
      <Button type="link" style={{ margin: 0, padding: 0 }} onClick={() => redirect(id)}>Reorder</Button>
    </Space>
  )

  useEffect(() => {
    setItems([]);
    setLoading(true);
    ProductApiHelper.getLatestPrices(product?.id)
      .then(results => {
        setItems(results);
        setLoading(false);
      })
      .catch(handleHttpError)
  }, [handleHttpError, setItems, product]);

  function redirect(purchaseOrderId) {
    PurchaseOrderApiHelper.get({ id: purchaseOrderId })
      .then(results => {
        if (results.length > 0) {
          navigate(`/supplier/procurements/new`, { state: { purchaseOrder: { ...results[0], purchase_order_items: results[0].purchase_order_items.filter(x => x.product_id === product.id) } } })
        }
      })
      .catch(handleHttpError)
  }

  return (
    <>
      <MyToolbar title="Latest Cost Price for Each Supplier">
      </MyToolbar>

      <Table dataSource={items}
        columns={columns}
        loading={loading}
        rowKey={() => Math.random()}
        pagination={{ pageSize: 6, showTotal }}
      />
    </>
  )
}

const columns = [
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    ellipsis: true,
    render: (created_at) => parseDate(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Order ID',
    dataIndex: 'id',
    key: 'id',
    width: 150,
    ellipsis: true,
    render: (id) => <Link to={`/supplier/procurements/${id}`}>{id}</Link>,
    sorter: (a, b) => sortByString(a.id, b.id),
  },
  {
    title: 'Supplier',
    dataIndex: 'company_name',
    key: 'company_name',
    ellipsis: true,
    render: (company_name, record) => <Link to={`/supplier/suppliers/${record.supplier_id}`}>{company_name}</Link>,
    sorter: (a, b) => sortByString(a.company_name, b.company_name),
  },
  {
    title: 'Unit Cost',
    dataIndex: 'unit_cost',
    key: 'unit_cost',
    width: 120,
    ellipsis: true,
    render: (unit_cost) => `$${(+unit_cost).toFixed(2)}`,
    sorter: (a, b) => sortByNumber(+a.unit_cost, +b.unit_cost),
  },
  {
    title: 'Action',
    dataIndex: 'id',
    width: 130,
  },
]
