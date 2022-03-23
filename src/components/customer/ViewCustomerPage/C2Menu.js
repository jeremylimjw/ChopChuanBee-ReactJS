import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Button, message, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomerApiHelper } from '../../../api/CustomerApiHelper';
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import { CustomCell } from '../../common/CustomCell';
import MyToolbar from '../../common/MyToolbar';

export default function C2Menu({ customer }) {

  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  columns[1].onCell = (record) => ({ type: 'input', toggleable: 'true', field: 'product_alias', record, handleSave });
  columns[2].onCell = (record) => ({ type: 'product_select', toggleable: 'true', field: 'product', record, handleSave, products });
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
  }, [customer, setLoading, handleHttpError])

  useEffect(() => {
    ProductApiHelper.getAllAvailable()
      .then(results => {
        setProducts(results);
      })
      .catch(handleHttpError)
  }, [handleHttpError, setProducts])

  function handleAddRow() {
    const newItems = [{ product_alias: '', product: null, key: Math.random() }, ...items];
    setItems(newItems);
  }

  function handleDeleteRow(record) {
    const newItems = items.filter((item) => (item.id !== record.id) || (item.key !== record.key));
    setItems(newItems);
  };

  function handleSave(newRecord) {
    const newItems = [...items];
    // Allow match record by 'id' or 'key'
    const index = newItems.findIndex(x => {
      if (newRecord.id) {
        return (x.id === newRecord.id)
      } else if (newRecord.key) {
        return (x.key === newRecord.key)
      } else {
        return false;
      }
    });
    const item = newItems[index];
    newItems.splice(index, 1, { ...item, ...newRecord });
    setItems(newItems);
  }

  function handleMenuUpdate() {
    const newItems = items.filter(x => (x.product_alias) && (x.product != null))
    setLoading(true);
    CustomerApiHelper.updateMenu(customer.id, newItems)
      .then(() => {
        setItems(newItems);
        setLoading(false);
        message.success(`Customer Menu successfully updated!`)
      })
      .catch(handleHttpError)
      .catch(() => setLoading(false))
  }

  return (
    <>
      <MyToolbar title={`Menu`}>
        {hasWriteAccessTo(View.CRM.name) &&
          <>
            <Button onClick={handleAddRow} icon={<PlusOutlined />}>New</Button>
            <Button type='primary' onClick={handleMenuUpdate} icon={<SaveOutlined />} loading={loading}>Save</Button>
          </>
        }
      </MyToolbar>

      <Table dataSource={items}
        columns={columns}
        loading={loading}
        rowKey={() => Math.random()}
        components={{ body: { cell: CustomCell } }}
        pagination={{ pageSize: 6, showTotal: showTotal }}
      />

    </>
  )
}

const columns = [
  {
    title: 'No',
    width: 50,
    ellipsis: true,
    render: (_, record, index) => index + 1,
  },
  {
    title: 'Alias',
    dataIndex: 'product_alias',
    key: 'product_alias',
    ellipsis: true,
    width: '20%',
    sorter: (a, b) => sortByString(a.product_alias, b.product_alias),
  },
  {
    title: 'Product Name',
    dataIndex: 'product',
    key: 'product',
    ellipsis: true,
    width: 300,
    render: (product) => product?.name,
    sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
  },
  {
    title: 'Latest Price',
    dataIndex: 'latest_price',
    key: 'latest_price',
    align: 'center',
    ellipsis: true,
    width: 120,
    render: (latest_price) => latest_price || '-',
    sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
  },
  {
    align: 'center',
    width: 50,
  },
]