import { Input, message, Table, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../providers/AppProvider';
import MyToolbar from '../layout/MyToolbar'
import { ProductApiHelper } from '../../api/product'
import { SearchOutlined } from '@ant-design/icons/lib/icons';
import Modal from 'antd/lib/modal/Modal';
import { SupplierApiHelper } from '../../api/supplier';

const initialSearchForm = {
  name: '',
};

export default function NewSupplierMenuModal({ supplier, addToTable, isModalVisible, setIsModalVisible, disabledProductsMap }) {

    const { handleHttpError } = useApp();
  
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [searchForm, setSearchForm] = useState({...initialSearchForm});
  
    useEffect(() => {
      if (isModalVisible === true) {
        setLoading(true);
    
        ProductApiHelper.searchByName(searchForm.name)
          .then(results => {
            setDataSource(results);
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false))
      }
  
    }, [handleHttpError, searchForm, isModalVisible])


    function handleOk() {
      if (supplier?.id == null) return;

      setLoading(true);
      SupplierApiHelper.createSupplierMenu(selectedProducts.map(x => ({ product_id: x.id, supplier_id: supplier.id })))
        .then(() => {
          addToTable(selectedProducts)
          message.success(`Products successfully added!`)
          setLoading(false);
          setIsModalVisible(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    }

    return (
      <Modal title="Add to Supplier Menu" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} width={800}>
        <MyToolbar title="Products">
          <Input placeholder="Search Name" suffix={<SearchOutlined className='grey' />} value={searchForm.name} onChange={(e) => setSearchForm({...searchForm, name: e.target.value })} />
          <Button onClick={() => setSearchForm({...initialSearchForm})}>Reset</Button>
        </MyToolbar>
            
        <Table loading={loading}
            columns={columns}
            dataSource={dataSource}
            rowSelection={{ onChange: (_, selectedRows) => setSelectedProducts(selectedRows), getCheckboxProps: (record) => ({ disabled: disabledProductsMap[record.id] }) }}
            rowKey="id"
            pagination={{ pageSize: 6 }}
        />
      </Modal>
    )
}
  
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (name) => name,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    render: (description) => description || '-',
  },
  {
    title: 'Unit',
    dataIndex: 'unit',
    render: (unit) => unit,
  },
];
