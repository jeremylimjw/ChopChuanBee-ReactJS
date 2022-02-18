import { Button, Form, Input, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { ProductApiHelper } from '../../api/product';
import { useApp } from '../../providers/AppProvider';
import { parseDate } from '../../utilities/datetime';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import MyToolbar from '../../components/layout/MyToolbar';
import { sortByDate, sortByString } from '../../utilities/sorters';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import NewProductModal from '../../components/inventoryModule/NewProduct/NewProductModal';

const breadcrumbs = [
  { url: '/products', name: 'Products' },
]

export default function ManageProductsPage() {

    const { handleHttpError } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        ProductApiHelper.get()
            .then(results => {
                setProducts(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])


    function onValuesChange(_, form) {
        ProductApiHelper.getOrderByName(form.name)
          .then(results => {
              setProducts(results);
              setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false))
    }

    function resetForm() {
        form.resetFields();
        onValuesChange(null, form.getFieldsValue());
    }

    return (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Products">
  
          <MyCard>
  
            <MyToolbar title="Products">
                <Form form={form} onValuesChange={onValuesChange} layout='inline' autoComplete='off' initialValues={{ status: null }}>
                    <Form.Item name="name">
                        <Input placeholder='Search Name' />
                    </Form.Item>
                    <Button onClick={resetForm}>Reset</Button>
                </Form>
                <Button type='primary' onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>New</Button>
            </MyToolbar>
  
            <Table dataSource={products} columns={columns} loading={loading} rowKey="id" />
              
          </MyCard>
  
          <NewProductModal products={products} setProducts={setProducts} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        
        </MyLayout>
    )
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 150,
    render: (created_at) => parseDate(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 450,
    sorter: (a, b) => sortByString(a.name, b.name),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (description) => description || '-',
    sorter: (a, b) => sortByString(a.description, b.description),
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    key: 'unit',
    width: '10%',
    render: (unit) => unit || '-',
    sorter: (a, b) => sortByString(a.unit, b.unit),
  },
  { 
    dataIndex: "id", 
    title: "", 
    key: "link", 
    width: '8%', 
    render: (id) => <Link to={`./${id}`}>View</Link> 
  }
]
