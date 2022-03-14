import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, Table } from 'antd';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { CustomerApiHelper } from '../../../api/CustomerApiHelper';
import { useApp } from '../../../providers/AppProvider';
import { sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyToolbar from '../../common/MyToolbar';

export default function NS1CustomerTable({ selectedCustomer, setSelectedCustomer, setSelectedProducts }) {

    const { handleHttpError } = useApp();
  
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        setLoading(true);
        CustomerApiHelper.get(null, null, true)
            .then(results => {
                setCustomers(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])
  
    function onValuesChange(_, form) {
        CustomerApiHelper.get({ ...form, status: true })
            .then(results => {
                setCustomers(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }
  
    function resetForm() {
      form.resetFields();
      onValuesChange(null, form.getFieldsValue());
    }

    function handleRowSelect(_, selectedRows) {
        // Pre-populate 1 empty order item
        setSelectedCustomer(selectedRows[0]);
        const newItem = {
            product: null, 
            key: Math.random(),
            quantity: 0,
        }
        setSelectedProducts([newItem]);
    }

    return (
        <>
            <MyToolbar title="All Customers">
              <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                <Form.Item name="company_name">
                    <Input placeholder='Search Company' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
                <Form.Item name="p1_name">
                    <Input placeholder='Search Person Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
                <Button onClick={resetForm}>Reset</Button>
              </Form>
            </MyToolbar>

            <Table loading={loading}
              rowSelection={{ type: 'radio', onChange: handleRowSelect, selectedRowKeys: [selectedCustomer?.id] }}
              columns={columns}
              dataSource={customers}
              pagination={{ pageSize: 6, showTotal: showTotal }}
              rowKey="id"
            />
        </>
    )
}
  
const columns = [
  {
    title: 'Company Name',
    dataIndex: 'company_name',
    width: '20%', 
    ellipsis: true,
    sorter: (a, b) => sortByString(a.company_name, b.company_name),
  },
  {
    title: 'Name',
    dataIndex: 'p1_name',
    width: '16%', 
    ellipsis: true,
    sorter: (a, b) => sortByString(a.p1_name, b.p1_name),
  },
  {
    title: 'Phone Number',
    dataIndex: 'p1_phone_number',
    width: '16%', 
    ellipsis: true,
    sorter: (a, b) => sortByString(a.p1_phone_number, b.p1_phone_number),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    ellipsis: true,
    render: (description) => description || '-',
    sorter: (a, b) => sortByString(a.description, b.description),
  },
];
