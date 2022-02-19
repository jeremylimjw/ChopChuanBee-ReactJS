import { Button, Form, Input, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { ProductApiHelper } from '../../api/product';
import { useApp } from '../../providers/AppProvider';
import { parseDate } from '../../utilities/datetime';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import MyToolbar from '../../components/layout/MyToolbar';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { Link } from 'react-router-dom';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons/lib/icons';
import NewProductModal from '../../components/inventoryModule/NewProduct/NewProductModal';
import { getActiveTag } from '../../enums/ActivationStatus';
import debounce from 'lodash.debounce';
import { View } from '../../enums/View';
import { showTotal } from '../../utilities/table';

const breadcrumbs = [
  { url: '/products', name: 'Products' },
]

export default function ManageProductsPage() {

    const { handleHttpError, hasWriteAccessTo } = useApp();

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
      ProductApiHelper.get(form.name, form.status)
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
                <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                    <Form.Item name="name">
                        <Input placeholder='Search Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                    </Form.Item>
                    <Form.Item name="status">
                      <Select style={{ width: 140 }} placeholder="Filter by Status">
                        <Select.Option value={null}>All</Select.Option>
                        <Select.Option value={true}>Active</Select.Option>
                        <Select.Option value={false}>Inactive</Select.Option>
                      </Select>
                    </Form.Item>
                    <Button onClick={resetForm}>Reset</Button>
                </Form>
                <Button type='primary' onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />} disabled={!hasWriteAccessTo(View.INVENTORY.name)}>New</Button>
            </MyToolbar>
  
            <Table 
              dataSource={products} 
              columns={columns}
              loading={loading} 
              rowKey="id" 
              pagination={{ showTotal }}
            />
              
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
    ellipsis: true,
    render: (created_at) => parseDate(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 450,
    ellipsis: true,
    sorter: (a, b) => sortByString(a.name, b.name),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: (description) => description || '-',
    sorter: (a, b) => sortByString(a.description, b.description),
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    key: 'unit',
    width: '10%',
    ellipsis: true,
    render: (unit) => unit || '-',
    sorter: (a, b) => sortByString(a.unit, b.unit),
  },
  {
    title: 'Status',
    dataIndex: 'deactivated_date',
    key: 'deactivated_date',
    width: 120,
    align: 'center',
    ellipsis: true,
    render: (deactivated_date) => getActiveTag(deactivated_date),
    sorter: (a, b) => sortByNumber(a.deactivated_date ? 1 : 0, b.deactivated_date ? 1 : 0),
  },
  { 
    dataIndex: "id", 
    title: "Action", 
    key: "link", 
    width: 100,
    ellipsis: true,
    render: (id) => <Link to={`./${id}`}>View</Link> 
  }
]
