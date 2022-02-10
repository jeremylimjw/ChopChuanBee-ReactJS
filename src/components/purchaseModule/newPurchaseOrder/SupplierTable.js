import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { SupplierApiHelper } from '../../../api/supplier';
import { useApp } from '../../../providers/AppProvider';
import MyToolbar from '../../layout/MyToolbar';

export default function SupplierTable({ selectedSupplier, setSelectedSupplier }) {

    const { handleHttpError } = useApp();
  
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
  
    useEffect(() => {
      setSelectedSupplier([]);
      setLoading(true);
  
      SupplierApiHelper.getAll()
        .then(results => {
          setDataSource(results);
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
  
    }, [handleHttpError])

    return (
        <>
            <MyToolbar title="All Suppliers">
                <Form layout='inline'>
                    <Form.Item label="Company Name">
                        <Input placeholder="Enter Search String" addonAfter={<SearchOutlined />} />
                    </Form.Item>
                    <Form.Item label="Name">
                        <Input placeholder="Enter Search String" addonAfter={<SearchOutlined />} />
                    </Form.Item>
                    <Form.Item>
                        <Button>Reset</Button>
                    </Form.Item>
                </Form>
            </MyToolbar>

            <Table loading={loading}
                rowSelection={{ type: 'radio', onChange: (_, selectedRows) => setSelectedSupplier(selectedRows) }}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
            />
        </>
    )
}
  
const columns = [
  {
    title: 'Company Name',
    dataIndex: 'company_name',
  },
  {
    title: 'Name',
    dataIndex: 's1_name',
  },
  {
    title: 'Phone Number',
    dataIndex: 's1_phone_number',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    render: (description) => description || '-',
  },
];
