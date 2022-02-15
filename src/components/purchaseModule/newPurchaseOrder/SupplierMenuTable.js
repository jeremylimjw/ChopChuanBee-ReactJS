import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Button, Input, message, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { SupplierApiHelper } from "../../../api/supplier";
import { useApp } from "../../../providers/AppProvider";
import { sortByString } from "../../../utilities/sorters";
import EditableCell from "../../general/EditableCell";
import MyToolbar from "../../layout/MyToolbar";
import NewSupplierMenuModal from "../../supplierModule/NewSupplierMenuModal";

const initialSearchForm = {
  name: '',
};

export default function SupplierMenuTable({ selectedSupplier, selectedProducts, setSelectedProducts, disabledProductsMap = {} }) {

    const { handleHttpError } = useApp();
  
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [searchForm, setSearchForm] = useState({...initialSearchForm});
  
    useEffect(() => {
      if (selectedSupplier != null) {
        setSelectedProducts([]);
        setLoading(true);
        SupplierApiHelper.getSupplierMenu(selectedSupplier.id)
          .then(results => {
            setDataSource(results.map(x => ({...x, quantity: 0, id: Math.random() })));
            setLoading(false);
          })
          .catch(handleHttpError)
          .catch(() => setLoading(false))
      }
  
    }, [handleHttpError, searchForm, selectedSupplier, setSelectedProducts, disabledProductsMap])

    function addToTable(products) {
      const newDataSource = [...dataSource];
      for (let product of products) {
        newDataSource.push({ 
          id: Math.random(), 
          quantity: 0, 
          supplier_id: selectedSupplier?.id, 
          product_id: product.id,
          product: product 
        })
      }
      setDataSource(newDataSource);
    }
  
    function handleDelete(record) {
      setLoading(true);
      SupplierApiHelper.deleteSupplierMenuItem(selectedSupplier.id, record.product_id)
        .then(() => {
          message.success(`${record.product.name} successfully removed!`)
          const newData = dataSource.filter((item) => item.id !== record.id);
          setDataSource(newData);
          setSelectedProducts(newData.filter(x => x.quantity > 0))
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
    };
  
    function handleSave(record) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index >= 0) {
        newData.splice(index, 1, { ...newData[index], ...record });
        setDataSource(newData);
      }

      setSelectedProducts(newData.filter(x => x.quantity > 0))
    };
  
    const columns = [
      { 
        align: '',
        width: 50, 
        render: (_, record, index) => index+1 
      },
      {
        title: 'Name',
        dataIndex: 'product',
        width: '20%', 
        render: (product) => product.name,
        sorter: (a, b) => sortByString(a.product.name, b.product.name),
      },
      {
        title: 'Description',
        dataIndex: 'product',
        render: (product) => product.description || '-',
        sorter: (a, b) => sortByString(a.product.description, b.product.description),
      },
      {
        title: 'Unit',
        dataIndex: 'product',
        width: '11%', 
        render: (product) => product.unit,
        sorter: (a, b) => sortByString(a.product.unit, b.product.unit),
      },
      {
        title: 'Lastest Price',
        dataIndex: 'product',
        width: '11%', 
        render: (product) => '-',
        sorter: (a, b) => sortByString(a.product.unit, b.product.unit),
      },
      {
        title: '* Quantity',
        dataIndex: 'quantity',
        align: 'center',
        width: '11%', 
        onCell: (record) => ({ editable: true, record, dataIndex: 'quantity', inputType: 'number', handleSave }),
      },
      {
        align: 'center',
        width: 100,
        render: (_, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><Button shape="circle" icon={<DeleteOutlined />} /></Popconfirm>
      },
    ];
  
    return (
      <>
        <MyToolbar title="Supplier's Menu">
          <Input placeholder="Search Name" suffix={<SearchOutlined className='grey' />} value={searchForm.name} onChange={(e) => setSearchForm({...searchForm, name: e.target.value })} />
          <Button icon={<PlusOutlined />} disabled={loading} onClick={() => setIsModalVisible(true)}>Add Item</Button>
        </MyToolbar>
        
        <Table loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey={(_, index) => index}
          components={{ body: { cell: EditableCell } }}
        />

        <NewSupplierMenuModal 
          supplier={selectedSupplier}
          addToTable={addToTable}
          isModalVisible={isModalVisible} 
          setIsModalVisible={setIsModalVisible} 
          disabledProductsMap={dataSource.reduce((prev, current) => {
            prev[`${current.product_id}`] = true;
            return prev;
          }, {})} 
        />
      </>
    )
  
  }