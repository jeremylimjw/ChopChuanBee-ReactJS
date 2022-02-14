import { SearchOutlined } from '@ant-design/icons/lib/icons';
import { Button, Input, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { SupplierApiHelper } from '../../../api/supplier';
import { useApp } from '../../../providers/AppProvider';
import { sortByString } from '../../../utilities/sorters';
import MyToolbar from '../../layout/MyToolbar';

const initialSearchForm = {
  company_name: '',
  name: '',
}

export default function SupplierTable({ selectedSupplier, setSelectedSupplier }) {

    const { handleHttpError } = useApp();
  
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const [searchForm, setSearchForm] = useState({...initialSearchForm});

    useEffect(() => {
      setLoading(true);
          
      SupplierApiHelper.search(searchForm.company_name, searchForm.name)
        .then(results => {
          setDataSource(results);
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false));

    }, [handleHttpError, searchForm, setSelectedSupplier]);
  
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
  
    }, [handleHttpError, setSelectedSupplier])

    return (
        <>
            <MyToolbar title="All Suppliers">
              <Input placeholder="Search Company Name" suffix={<SearchOutlined className='grey' />} value={searchForm.company_name} onChange={(e) => setSearchForm({...searchForm, company_name: e.target.value })} />
              <Input placeholder="Search Name" suffix={<SearchOutlined className='grey' />} value={searchForm.name} onChange={(e) => setSearchForm({...searchForm, name: e.target.value })} />
              <Button onClick={() => setSearchForm({...initialSearchForm})}>Reset</Button>
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
    width: '20%', 
    sorter: (a, b) => sortByString(a.company_name, b.company_name),
  },
  {
    title: 'Name',
    dataIndex: 's1_name',
    width: '16%', 
    sorter: (a, b) => sortByString(a.s1_name, b.s1_name),
  },
  {
    title: 'Phone Number',
    dataIndex: 's1_phone_number',
    width: '16%', 
    sorter: (a, b) => sortByString(a.s1_phone_number, b.s1_phone_number),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    render: (description) => description || '-',
    sorter: (a, b) => sortByString(a.description, b.description),
  },
];
