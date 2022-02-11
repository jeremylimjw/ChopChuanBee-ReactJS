import { DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, Popconfirm, Table } from 'antd';
import React from 'react'
import EditableCell from '../../general/EditableCell';

export default function OrderItemsTable({ purchaseOrder, setPurchaseOrder }) {
  
    function handleDelete(record) {
      const newItems = purchaseOrder?.purchase_order_items.filter((item) => item.id !== record.id);
      setPurchaseOrder({ ...purchaseOrder, purchase_order_items: newItems });
    };
  
    function handleSave(record) {
      const newData = [...purchaseOrder?.purchase_order_items];
      const index = newData?.findIndex((item) => record.id === item.id);
      if (newData && index >= 0) {
        newData.splice(index, 1, { ...newData[index], ...record });
        setPurchaseOrder({...purchaseOrder, purchase_order_items: newData });
      }
    };
  
    const columns = [
      {
        align: 'center',
        width: 100,
        render: (_, record) => <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}><Button shape="circle" icon={<DeleteOutlined />} /></Popconfirm>
      },
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
        title: 'Lastest Price',
        dataIndex: 'product',
        render: (product) => '-',
      },
      {
        title: '* Quantity',
        dataIndex: 'quantity',
        align: 'center',
        onCell: (record) => ({ editable: true, isToggleable: true, record, dataIndex: 'quantity', inputType: 'number', handleSave })
      },
      {
        title: '* Unit Price ($)',
        dataIndex: 'unit_cost',
        align: 'center',
        onCell: (record) => ({ editable: true, record, dataIndex: 'unit_cost', inputType: 'number', handleSave })
      },
    ];

  return (
    <Table
        pagination={{ position: ['none', 'none'] }}
        columns={columns}
        dataSource={purchaseOrder?.purchase_order_items}
        rowKey="id"
        components={{ body: { cell: EditableCell } }}
    />
  )
}
