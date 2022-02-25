import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters'
import MyToolbar from '../../common/MyToolbar'
import { useNavigate } from 'react-router';
import { showTotal } from '../../../utilities/table';
import { useApp } from '../../../providers/AppProvider'
import { parseDate } from '../../../utilities/datetime'
import { ProductApiHelper } from '../../../api/ProductApiHelper'
import { Link } from 'react-router-dom';

export default function P2PriceTable({ product }) {

    const { handleHttpError } = useApp();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    columns[4].render = (id) => <Link to={`/supplier/procurements/${id}`}>View</Link>

    useEffect(() => {
      setItems([]);
      setLoading(true);
      ProductApiHelper.getLatestPrices(product?.id)
        .then(results => {
          setItems(results)
          setLoading(false);
        })
        .catch(handleHttpError)
    }, [handleHttpError, setItems, product]);

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
      dataIndex: 'company_name',
      key: 'company_name',
      ellipsis: true,
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
      width: 100,
    },
]
