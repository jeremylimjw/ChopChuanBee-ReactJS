import { Button, Form, Input, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { CustomerApiHelper } from '../../api/customer';
import { useApp } from '../../providers/AppProvider';
import { parseDateTime } from '../../utilities/datetime';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import MyToolbar from '../../components/layout/MyToolbar';
import { sortByDate, sortByString } from '../../utilities/sorters';
import { Link } from 'react-router-dom';

const breadcrumbs = [
  { url: '/customers', name: 'Customers' },
]

export default function ManageCustomersPage() {

    const { handleHttpError } = useApp();

    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        CustomerApiHelper.get()
            .then(results => {
                setLogs(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])


    function onValuesChange(_, form) {
        CustomerApiHelper.get(form.company_name, form.s1_name)
            .then(results => {
                setLogs(results);
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
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Customers">

            <MyCard>

                <MyToolbar title="Customers">
                    <Form form={form} onValuesChange={onValuesChange} layout='inline' autoComplete='off'>
                        <Form.Item name="company_name">
                            <Input placeholder='Search Company' />
                        </Form.Item>
                        <Form.Item name="p1_name">
                            <Input placeholder='Search Person' />
                        </Form.Item>
                        <Button onClick={resetForm}>Reset</Button>
                    </Form>
                    <Button type='primary' onClick={resetForm}>New</Button>
                </MyToolbar>

                <Table dataSource={logs} columns={columns} loading={loading} rowKey="id" />
                
            </MyCard>
        
        </MyLayout>
    )
}

const columns = [
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '16%',
    render: (created_at) => parseDateTime(created_at),
    sorter: (a, b) => sortByDate(a.created_at, b.created_at),
  },
  {
    title: 'Company',
    dataIndex: 'company_name',
    key: 'company_name',
    width: '14%',
    sorter: (a, b) => sortByString(a.company_name, b.company_name),
  },
  {
    title: 'Contact Person',
    dataIndex: 'p1_name',
    key: 'p1_name',
    width: '12%',
    sorter: (a, b) => sortByString(a.p1_name, b.p1_name),
  },
  {
    title: 'Contact Number',
    dataIndex: 'p1_phone_number',
    key: 'p1_phone_number',
    width: '14%',
    sorter: (a, b) => sortByString(a.p1_phone_number, b.p1_phone_number),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => sortByString(a.address, b.address),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    render: (email) => email || '-',
    sorter: (a, b) => sortByString(a.email, b.email),
  },
  { 
      dataIndex: "id", 
      title: "", 
      key: "link", 
      width: '8%', 
      render: (id) => <Link to={`./${id}`}>View</Link> 
  }
]
