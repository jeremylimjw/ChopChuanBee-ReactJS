import { Button, Form, Input, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { CustomerApiHelper } from '../../api/customer';
import { useApp } from '../../providers/AppProvider';
import { parseDate } from '../../utilities/datetime';
import MyCard from '../../components/layout/MyCard';
import MyLayout from '../../components/layout/MyLayout';
import MyToolbar from '../../components/layout/MyToolbar';
import { sortByDate, sortByNumber, sortByString } from '../../utilities/sorters';
import { Link } from 'react-router-dom';
import { getActiveTag } from '../../enums/ActivationStatus';
import NewCustomerModal from '../../components/customerModule/NewCustomer/NewCustomerModal';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import debounce from 'lodash.debounce';

const breadcrumbs = [
  { url: '/customers', name: 'Customers' },
]

export default function ManageCustomersPage() {

    const { handleHttpError } = useApp();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        CustomerApiHelper.get()
            .then(results => {
                setCustomers(results);
                setLoading(false);
            })
            .catch(handleHttpError)
            .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])


    function onValuesChange(_, form) {
      CustomerApiHelper.get(form.company_name, form.p1_name, form.status)
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

    return (
      <MyLayout breadcrumbs={breadcrumbs} bannerTitle="Manage Customers">

        <MyCard>

          <MyToolbar title="Customers">
              <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off' initialValues={{ status: null }}>
                  <Form.Item name="company_name">
                      <Input placeholder='Search Company' />
                  </Form.Item>
                  <Form.Item name="p1_name">
                      <Input placeholder='Search Person Name' />
                  </Form.Item>
                  <Form.Item name="status">
                    <Select style={{ width: 120 }} placeholder="Filter by Status">
                      <Select.Option value={null}>All</Select.Option>
                      <Select.Option value={true}>Active</Select.Option>
                      <Select.Option value={false}>Inactive</Select.Option>
                    </Select>
                  </Form.Item>
                  <Button onClick={resetForm}>Reset</Button>
              </Form>
              <Button type='primary' onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>New</Button>
          </MyToolbar>

          <Table dataSource={customers} columns={columns} loading={loading} rowKey="id" />
            
        </MyCard>

        <NewCustomerModal customers={customers} setCustomers={setCustomers} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
      
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
    title: 'Email',
    dataIndex: 'company_email',
    key: 'company_email',
    render: (company_email) => company_email || '-',
    sorter: (a, b) => sortByString(a.company_email, b.company_email),
  },
  {
    title: 'AR',
    key: 'AR',
    width: 80,
    render: (AR) => '-',
    sorter: (a, b) => sortByString(a.company_email, b.company_email),
  },
  {
    title: 'Status',
    dataIndex: 'deactivated_date',
    key: 'deactivated_date',
    width: 120,
    render: (deactivated_date) => getActiveTag(deactivated_date),
    sorter: (a, b) => sortByNumber(a.deactivated_date ? 1 : 0, b.deactivated_date ? 1 : 0),
  },
  { 
    dataIndex: "id", 
    title: "", 
    key: "link", 
    width: 100,
    render: (id) => <Link to={`./${id}`}>View</Link> 
  }
]
