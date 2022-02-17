import { DeleteOutlined } from '@ant-design/icons/lib/icons';
import { Button, message, Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomerApiHelper } from '../../../api/customer'
import { useApp } from '../../../providers/AppProvider';
import { sortByString } from '../../../utilities/sorters';
import MyToolbar from '../../layout/MyToolbar'
import NewCustomerMenuModal from './NewCustomerMenuModal';

export default function C2Menu({ customer }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
      if (customer?.id) {
        setLoading(true);
        CustomerApiHelper.getMenu(customer?.id)
          .then(results => {
            setItems(results);
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false))
      }
    }, [handleHttpError, setLoading, customer])

    function addToTable(newMenuItems) {
      const newItems = [...items, ...newMenuItems];
      setItems(newItems);
    }

    function handleDelete(record) {
      setLoading(true);
      CustomerApiHelper.deleteMenu(record.id)
        .then(() => {
          const newItems = items.filter((item) => item.id !== record.id);
          setItems(newItems);
          setLoading(false);
          message.success(`Item successfully deleted!`)
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    };

    const columns = [
      {
        title: 'Alias',
        dataIndex: 'product_alias',
        key: 'product_alias',
        width: 150,
        sorter: (a, b) => sortByString(a.product_alias, b.product_alias),
      },
      {
        title: 'Product Name',
        dataIndex: 'product',
        key: 'product',
        render: (product) => product.name,
        sorter: (a, b) => sortByString(a.product.name, b.product.name),
      },
      {
        title: 'Latest Price',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 150,
        render: (id) => '-',
      },
      { align: 'center', width: 50, render: (_, record) => 
        <Popconfirm title="Confirm delete?" onConfirm={() => handleDelete(record)} disabled={loading}>
          <Button shape="circle" icon={<DeleteOutlined />} loading={loading} />
        </Popconfirm>
      },
    ]

    return (
        <>
            <MyToolbar title={`Customer's Menu`}>
                <Button type='primary' onClick={() => setIsModalVisible(true)}>Add New Items</Button>
            </MyToolbar>
            <Table dataSource={items} columns={columns} loading={loading} rowKey={() => Math.random()} />

            <NewCustomerMenuModal 
              customer={customer}
              isModalVisible={isModalVisible} 
              setIsModalVisible={setIsModalVisible}
              addToTable={addToTable}
            />
        </>  
    )
}
