import { Button, Form, Input, Select, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { PlusOutlined, SearchOutlined, ExclamationCircleFilled } from '@ant-design/icons/lib/icons';
import debounce from 'lodash.debounce';
import { useApp } from '../../../providers/AppProvider';
import { ProductApiHelper } from '../../../api/ProductApiHelper';
import MyLayout from '../../common/MyLayout';
import MyCard from '../../common/MyCard';
import MyToolbar from '../../common/MyToolbar';
import NewProductModal from './NewProductModal';
import { parseDate } from '../../../utilities/datetime';
import { sortByDate, sortByNumber, sortByString } from '../../../utilities/sorters';
import { getActiveTag } from '../../../enums/ActivationStatus';
import { showTotal } from '../../../utilities/table';
import { View } from '../../../enums/View';

const breadcrumbs = [
  { url: '/inventory/products', name: 'Inventory' },
  { url: '/inventory/products', name: 'Products' },
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
                        <Select.Option value={true}>Listed</Select.Option>
                        <Select.Option value={false}>Unlisted</Select.Option>
                      </Select>
                    </Form.Item>
                    <Button onClick={resetForm}>Reset</Button>
                </Form>
                { hasWriteAccessTo(View.INVENTORY.name) && 
                  <Button type='primary' onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>New</Button>
                }
            </MyToolbar>
  
            <Table 
              dataSource={products} 
              columns={columns}
              loading={loading} 
              rowKey="id" 
              pagination={{ showTotal: showTotal }}
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
    ellipsis: true,
    sorter: (a, b) => sortByString(a.name, b.name),
  },
  {
    title: 'Min Level',
    dataIndex: 'min_inventory_level',
    key: 'min_inventory_level',
    align: 'center',
    width: 120,
    ellipsis: true,
    render: (min_inventory_level) => min_inventory_level || '0',
    sorter: (a, b) => sortByNumber(a.min_inventory_level, b.min_inventory_level),
  },
  {
    title: 'Stock',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center',
    width: 120,
    defaultSortOrder: 'ascend',
    ellipsis: true,
    render: (quantity) => {
      return (
        <Space>
          <Typography.Text>{quantity || 0}</Typography.Text>
          <ExclamationCircleFilled style={{ color: '#CD5C5C' }} />
        </Space>
      )
    },
    sorter: (a, b) => sortByNumber(a.quantity - a.min_inventory_level, b.quantity - b.min_inventory_level),
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    key: 'unit',
    align: 'center',
    width: 120,
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
    render: (deactivated_date) => getActiveTag(deactivated_date, ['Listed', 'Unlisted']),
    sorter: (a, b) => sortByNumber(a.deactivated_date ? 1 : 0, b.deactivated_date ? 1 : 0),
  },
  { 
    dataIndex: "id", 
    title: "Action", 
    key: "link", 
    width: 130,
    ellipsis: true,
    render: (id) => {
     return (
      <Space size="middle">
        <Link to={`./${id}`}>View</Link>
        <Link to={`./${id}`}>Restock</Link>
      </Space>
      )
    }
  }
]
