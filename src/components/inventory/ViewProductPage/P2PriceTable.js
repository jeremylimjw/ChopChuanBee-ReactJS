import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters'
import MyToolbar from '../../common/MyToolbar'
import { showTotal } from '../../../utilities/table';
import { useApp } from '../../../providers/AppProvider'
import { SupplierAPIHelper } from '../../../api/SupplierAPIHelper'
import { parseDate } from '../../../utilities/datetime'

export default function P2PriceTable() {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const { handleHttpError } = useApp();

    useEffect(() => {
      setItems([]);
      setLoading(true);
      SupplierAPIHelper.get({ limit: Math.round(Math.random()*3)+1 })
        .then(results => {
          setItems(results.map(x => ({ 
            supplier: x, 
            id: Math.round(Math.random()*10)+1, 
            created_at: new Date(), 
            unit_cost: Math.round(Math.random()*100)/10
          })))
          setLoading(false);
        })
        .catch(handleHttpError)
    }, [handleHttpError, setItems]);

    return (
      <>
        <MyToolbar title="Latest Prices">
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
      sorter: (a, b) => sortByString(a.id, b.id),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      ellipsis: true,
      render: (supplier) => supplier?.company_name,
      sorter: (a, b) => sortByString(a.supplier?.company_name, b.supplier?.company_name),
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unit_cost',
      key: 'unit_cost',
      width: 120,
      ellipsis: true,
      render: (unit_cost) => `$${unit_cost.toFixed(2)}`,
      sorter: (a, b) => sortByNumber(+a.unit_cost, +b.unit_cost),
    },
    { 
      title: 'Action',
      dataIndex: 'id',
      width: 100,
      render: (id) => <Link to='/'>Re-order</Link>,
    },
]
