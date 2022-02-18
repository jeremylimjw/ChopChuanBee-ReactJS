import { Table } from 'antd';
import React, { useState } from 'react'
import { sortByString } from '../../../utilities/sorters';
import MyToolbar from '../../layout/MyToolbar';

export default function P3InventoryTable() {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <MyToolbar title="Inventory">
            </MyToolbar>
            
            <Table dataSource={[]} 
              columns={columns} 
              loading={loading} 
              rowKey={() => Math.random()} 
            />
        </>  
    )
}

const columns = [
    {
      title: 'Date',
      dataIndex: 'product_alias',
      key: 'product_alias',
      width: 150,
      sorter: (a, b) => sortByString(a.product_alias, b.product_alias),
    },
    {
      title: 'Order ID',
      dataIndex: 'product_alias',
      key: 'product_alias',
      sorter: (a, b) => sortByString(a.product_alias, b.product_alias),
    },
    {
      title: 'Quantity',
      dataIndex: 'product',
      key: 'product',
      width: '20%',
      render: (product) => product?.name,
      sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
    },
    {
      title: 'Unit Price',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
      render: (id) => '-',
      sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
    },
    {
      title: 'Movement Type',
      dataIndex: 'id',
      key: 'id',
      width: '20%',
      render: (id) => '-',
      sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
    },
    { 
      align: 'center', 
      width: 100,
    },
]

