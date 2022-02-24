import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons/lib/icons';
import { Button, message, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import { SupplierAPIHelper } from '../../../api/SupplierAPIHelper';
import { View } from '../../../enums/View';
import { useApp } from '../../../providers/AppProvider';
import { sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import { CustomCell } from '../../common/CustomCell';
import MyToolbar from '../../common/MyToolbar';

export default function S2Menu({ supplier }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [disabledProducts, setDisabledProducts] = useState({});
    const [products, setProducts] = useState([]);

    columns[1].onCell = (record) => ({ 
        type: 'product_select', 
        toggleable: 'true', 
        field: 'product', 
        record, 
        handleSave, 
        products: products,
        disabledProducts: disabledProducts,
    });
    columns[3].render = (_, record) => <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} loading={loading} />;

    useEffect(() => {
        setLoading(true);
        if (supplier) {
        SupplierAPIHelper.getMenu(supplier.id).then(results => {
            setItems(results.map(x => ({...x, key: Math.random() })));
            setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
        }
    }, [supplier, setLoading, handleHttpError])

    useEffect(() => {
        ProductApiHelper.getAllAvailable()
            .then(results => {
                setProducts(results);
            })
            .catch(handleHttpError)
    }, [handleHttpError, setProducts])

    useEffect(() => {
        const disabledProducts = items.reduce((prev, current) => {
            if (current.product) {
                prev[`${current.product.id}`] = true;
            }
            return prev;
        }, {})
        setDisabledProducts(disabledProducts);
    }, [items])
    

    function handleAddRow() {
        const newItems = [{ product: null, key: Math.random() }, ...items];
        setItems(newItems);
    }

    function handleDeleteRow(record) {
        const newItems = items.filter((item) => item.key !== record.key);
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
        const newItems = items.filter(x => x.product != null)
        setLoading(true);
        SupplierAPIHelper.updateMenu(supplier.id, newItems)
        .then(() => {
            setItems(newItems);
            setLoading(false);
            message.success(`Supplier Menu successfully updated!`)
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    }

    return (
        <>
            <MyToolbar title={`Menu`}>
                { hasWriteAccessTo(View.SCM.name) && 
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
      render: (_, record, index) => index+1,
  },
  {
    title: 'Product Name',
    dataIndex: 'product',
    key: 'product',
    width: 280,
    ellipsis: true,
    render: (product) => product?.name,
    sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
  },
  {
    title: 'Latest Price',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 120,
    ellipsis: true,
    render: (id) => '-',
    sorter: (a, b) => sortByString(a.product?.name, b.product?.name),
  },
  { 
    align: 'center', 
    width: 50,
  },
]