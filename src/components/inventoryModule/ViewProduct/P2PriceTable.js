import { Table } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { sortByString } from '../../../utilities/sorters'
import MyToolbar from '../../layout/MyToolbar'
import { showTotal } from '../../../utilities/table';

export default function P2PriceTable() {
    // const [loading, setLoading] = useState(false);

    return (
        <>
            <MyToolbar title="Latest Prices">
                    <Link to="./">Last Ordered:  21/2/2022</Link>
            </MyToolbar>
            
            <Table dataSource={[]} 
              columns={columns} 
              // loading={loading} 
              rowKey={() => Math.random()} 
              pagination={{ pageSize: 6, showTotal }}
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
