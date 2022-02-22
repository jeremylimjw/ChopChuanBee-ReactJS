import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Form, Input, Table } from 'antd';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react'
import { SupplierAPIHelper } from '../../../api/SupplierAPIHelper';
import { useApp } from '../../../providers/AppProvider';
import { sortByString } from '../../../utilities/sorters';
import { showTotal } from '../../../utilities/table';
import MyToolbar from '../../common/MyToolbar';

export default function NP1SupplierTable({ selectedSupplier,  setSelectedSupplier }) {

    const { handleHttpError } = useApp();
  
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
      setLoading(true);
      SupplierAPIHelper.get({ status: true })
        .then(results => {
          setSuppliers(results);
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    }, [handleHttpError, setLoading])
  
    function onValuesChange(_, form) {
      SupplierAPIHelper.get({ ...form, status: true })
        .then(results => {
          setSuppliers(results);
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
        <>
            <MyToolbar title="All Suppliers">
              <Form form={form} onValuesChange={debounce(onValuesChange, 300)} layout='inline' autoComplete='off'>
                <Form.Item name="company_name">
                    <Input placeholder='Search Company' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
                <Form.Item name="s1_name">
                    <Input placeholder='Search Person Name' style={{ width: 180 }} suffix={<SearchOutlined className='grey' />} />
                </Form.Item>
                <Button onClick={resetForm}>Reset</Button>
              </Form>
            </MyToolbar>

            <Table loading={loading}
              rowSelection={{ type: 'radio', onChange: (_, selectedRows) => setSelectedSupplier(selectedRows[0]), selectedRowKeys: [selectedSupplier?.id] }}
              columns={columns}
              dataSource={suppliers}
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
    dataIndex: 's1_name',
    width: '16%', 
    ellipsis: true,
    sorter: (a, b) => sortByString(a.s1_name, b.s1_name),
  },
  {
    title: 'Phone Number',
    dataIndex: 's1_phone_number',
    width: '16%', 
    ellipsis: true,
    sorter: (a, b) => sortByString(a.s1_phone_number, b.s1_phone_number),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    ellipsis: true,
    render: (description) => description || '-',
    sorter: (a, b) => sortByString(a.description, b.description),
  },
];
