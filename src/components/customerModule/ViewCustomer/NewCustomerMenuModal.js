import { message, Table, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../../providers/AppProvider';
import MyToolbar from '../../layout/MyToolbar'
import { ProductApiHelper } from '../../../api/product'
import { DeleteOutlined } from '@ant-design/icons/lib/icons';
import Modal from 'antd/lib/modal/Modal';
import { CustomerApiHelper } from '../../../api/customer';
import { RenderCell } from '../../general/TableCell';


export default function NewCustomerMenuModal({ customer, addToTable, isModalVisible, setIsModalVisible }) {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);

    columns[1].onCell = (record) => ({ type: 'input', field: 'product_alias', items, setItems, record });
    columns[2].onCell = (record) => ({ type: 'product_select', field: 'product',  items, setItems, record, products });
    columns[5].render = (_, record) => <Button shape="circle" icon={<DeleteOutlined />} onClick={() => setItems(items.filter(x => x.key !== record.key))} />;

    useEffect(() => {
        if (isModalVisible === true) {
            setItems([]);
            setLoading(true);
            
            ProductApiHelper.getAll()
                .then(results => {
                    setProducts(results);
                    setLoading(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        }
    }, [handleHttpError, isModalVisible])

    function addRow() {
        const newItems = [...items];
        newItems.push({ product_alias: '', product: null, key: Math.random() });
        setItems(newItems);
    }

    function handleOk() {
        if (customer?.id == null) return;

        const selectedItems = items.filter(x => x.product?.id != null);
        const newMenuItems = selectedItems.map(x => ({ 
            product_id: x.product.id, 
            product: x.product,
            customer_id: customer.id, 
            product_alias: x.product_alias 
        }))

        setLoading(true);
        CustomerApiHelper.createMenu(newMenuItems)
            .then(() => {
                addToTable(newMenuItems)
                message.success(`Products successfully added!`)
                setLoading(false);
                setIsModalVisible(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }

    return (
        <Modal title="Add New Items" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} width={800}>

            <MyToolbar title="Selected Products">
                <Button type='primary' onClick={() => addRow()}>Add New Row</Button>
            </MyToolbar>
            <Table loading={loading}
                dataSource={items} 
                columns={columns} 
                rowKey={(_) => Math.random()}
                components={{ body: { cell: RenderCell } }} 
            />

        </Modal>
    )
}

const columns = [
    {
        title: 'No',
        width: 50,
        render: (_, record, index) => index+1,
    },
    {
        title: 'Product Alias',
        key: 'product_alias',
        width: 200,
    },
    {
        title: 'Product',
        key: 'product',
        width: 200,
    },
    {
        title: 'Description',
        dataIndex: 'product',
        key: 'product',
        width: 300,
        render: (product) => product?.description,
    },
    {
        title: 'Unit',
        dataIndex: 'product',
        key: 'product',
        width: 150,
        render: (product) => product?.unit,
    },
    {
        align: 'center',
        width: 50,
    },
]
