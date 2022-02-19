import { Table } from 'antd'
import React from 'react'
import { sortByString } from '../../../utilities/sorters'
import MyToolbar from '../../layout/MyToolbar'

export default function P2PriceTable() {
    // const [loading, setLoading] = useState(false);

    return (
        <>
            <MyToolbar title="Latest Prices">
            </MyToolbar>
            
            <Table dataSource={[]} 
              columns={columns} 
              // loading={loading} 
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
      width: 180,
      sorter: (a, b) => sortByString(a.product_alias, b.product_alias),
    },
    {
      title: 'Supplier',
      dataIndex: 'product',
      key: 'product',
      render: (product) => product?.name,
      sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
    },
    {
      title: 'Price',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id) => '-',
      sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
    },
    { 
      align: 'center', 
      width: 50,
    },
]
