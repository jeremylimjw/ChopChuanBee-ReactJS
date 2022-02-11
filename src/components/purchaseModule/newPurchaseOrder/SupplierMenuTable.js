import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons/lib/icons";
import { Button, Input, Popconfirm, Table, Form } from "antd";
import { useEffect, useState } from "react";
import { ProductApiHelper } from "../../../api/product";
import { SupplierApiHelper } from "../../../api/supplier";
import { useApp } from "../../../providers/AppProvider";
import EditableCell from "../../general/EditableCell";
import MyToolbar from "../../layout/MyToolbar";

export default function SupplierMenuTable({ selectedSupplier, selectedProducts, setSelectedProducts }) {

    const { handleHttpError } = useApp();
  
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
  
    useEffect(() => {
      setSelectedProducts([]);
      setLoading(true);
  
      SupplierApiHelper.getSupplierMenu(selectedSupplier[0].id)
        .then(results => {
          setDataSource(results.map(x => ({...x, quantity: 0, id: Math.random() })));
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
  
    }, [handleHttpError])
  
    function handleDelete(record) {
      setDataSource(dataSource.filter((item) => item.id !== record.id));
      setSelectedProducts(selectedProducts.filter(item => item.id !== record.id));
    };
  
    function handleSave(record) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index >= 0) {
        newData.splice(index, 1, { ...newData[index], ...record });
        setDataSource(newData);
      }
  
      const newSelectedProducts = [...selectedProducts];
      const selectedProductIndex = newSelectedProducts.findIndex((item) => record.id === item.id);
      if (selectedProductIndex >= 0) {
        newSelectedProducts.splice(selectedProductIndex, 1, { ...newSelectedProducts[selectedProductIndex], ...record });
        setSelectedProducts(newSelectedProducts);
      }
    };
  
    const columns = [
      {
        title: 'Name',
        dataIndex: 'product',
        render: (product) => product.name,
      },
      {
        title: 'Description',
        dataIndex: 'product',
        render: (product) => product.description || '-',
      },
      {
        title: 'Unit',
        dataIndex: 'product',
        render: (product) => product.unit,
      },
      {
        title: '* Quantity',
        dataIndex: 'quantity',
        align: 'center',
        onCell: (record) => ({ editable: true, record, dataIndex: 'quantity', inputType: 'number', handleSave })
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
          <Button type="primary" icon={<PlusOutlined />} disabled={loading}>New</Button>
        </MyToolbar>
        
        <Table loading={loading}
          rowSelection={{ onChange: (_, selectedRows) => setSelectedProducts(selectedRows) }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          components={{ body: { cell: EditableCell } }}
        />
      </>
    )
  
  }