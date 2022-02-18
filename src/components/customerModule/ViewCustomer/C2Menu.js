import { DeleteOutlined } from '@ant-design/icons/lib/icons';
import { Button, message, Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomerApiHelper } from '../../../api/customer'
import { ProductApiHelper } from '../../../api/product';
import { useApp } from '../../../providers/AppProvider';
import { sortByString } from '../../../utilities/sorters';
import { RenderCell } from '../../general/TableCell';
import MyToolbar from '../../layout/MyToolbar'

export default function C2Menu({ customer }) {

  const { handleHttpError } = useApp();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  columns[1].onCell = (record) => ({ type: 'input', field: 'product_alias', items, setItems, record });
  columns[2].onCell = (record) => ({ type: 'product_select', field: 'product',  items, setItems, record, products });
  columns[4].render = (_, record) => <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} loading={loading} />;

  useEffect(() => {
    setLoading(true);
    if (customer) {
      CustomerApiHelper.getMenu(customer.id).then(results => {
        setItems(results);
        setLoading(false);
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
    }
  }, [customer, setLoading])

  useEffect(() => {
    ProductApiHelper.getAll()
      .then(results => {
          setProducts(results);
      })
      .catch(handleHttpError)
  }, [handleHttpError, setProducts])

  function handleAddRow() {
      const newItems = [...items];
      newItems.push({ product_alias: '', product: null, key: Math.random() });
      setItems(newItems);
  }

  function handleDeleteRow(record) {
    const newItems = items.filter((item) => (item.id !== record.id) || (item.key !== record.key));
    setItems(newItems);
  };

  function handleMenuUpdate() {
    setLoading(true);
    CustomerApiHelper.updateMenu(customer.id, items)
      .then(newMenu => {
        setItems(newMenu);
        setLoading(false);
        message.success(`Customer Menu successfully updated!`)
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
  }

  return (
    <>
        <MyToolbar title={`Customer's Menu`}>
            <Button onClick={handleAddRow}>Add New Row</Button>
            <Button type='primary' onClick={handleMenuUpdate} loading={loading}>Save</Button>
        </MyToolbar>
        
        <Table dataSource={items} 
          columns={columns} 
          loading={loading} 
          rowKey={() => Math.random()} 
          components={{ body: { cell: RenderCell } }} 
        />
    </>  
  )
}


const columns = [
  {
      title: 'No',
      width: 50,
      render: (_, record, index) => index+1,
  },
  {
    title: 'Alias',
    dataIndex: 'product_alias',
    key: 'product_alias',
    width: 180,
    sorter: (a, b) => sortByString(a.product_alias, b.product_alias),
  },
  {
    title: 'Product Name',
    dataIndex: 'product',
    key: 'product',
    render: (product) => product?.name,
    sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
  },
  {
    title: 'Latest Price',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 150,
    render: (id) => '-',
    sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
  },
  { 
    align: 'center', 
    width: 50,
  },
]