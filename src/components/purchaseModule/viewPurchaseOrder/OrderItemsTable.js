import { DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, InputNumber, Table, Typography } from 'antd';
import React, { useState } from 'react'
import { POStatus } from '../../../enums/PurchaseOrderStatus';
import { PurchaseOrder } from '../../../models/PurchaseOrder';
import EditableCell from '../../general/EditableCell';
import MyToolbar from '../../layout/MyToolbar';
import NewOrderItemModal from './NewOrderItemModal';

export default function OrderItemsTable({ purchaseOrder, setPurchaseOrder, loading, setLoading }) {
  
  const [isNewOrderItemModalVisible, setIsNewOrderItemModalVisible] = useState(false);
  
  function handleDelete(record) {
    const newItems = purchaseOrder?.purchase_order_items.filter((item) => item.id !== record.id);
    setPurchaseOrder(new PurchaseOrder({ ...purchaseOrder, purchase_order_items: newItems }));
  };

  function handleSave(record) {
    const newData = [...purchaseOrder?.purchase_order_items];
    const index = newData?.findIndex((item) => record.id === item.id);
    if (newData && index >= 0) {
      newData.splice(index, 1, { ...newData[index], ...record });
      setPurchaseOrder(new PurchaseOrder({...purchaseOrder, purchase_order_items: newData }));
    }
  };

  const columns = [
    { width: 50, render: (_, record, index) => index+1 },
    { title: 'Name', dataIndex: 'product', render: (product) => product.name },
    { title: 'Description', dataIndex: 'product',  render: (product) => product.description || '-' },
    { title: 'Unit', dataIndex: 'product', render: (product) => product.unit },
    { title: 'Lastest Price', dataIndex: 'product', render: (product) => '-' },
    { title: '* Quantity', dataIndex: 'quantity', align: 'center', onCell: (record) => 
      ({ editable: purchaseOrder.isStatus(POStatus.PENDING), isToggleable: true, record, dataIndex: 'quantity', inputType: 'number', handleSave })
    },
    { title: '* Unit Price ($)', dataIndex: 'unit_cost', align: 'center', onCell: (record) => 
      ({ editable: purchaseOrder.isStatus(POStatus.PENDING), record, dataIndex: 'unit_cost', inputType: 'number', displayType: 'currency', handleSave })
    },
    { title: 'Subtotal', dataIndex: '', key: 'subtotal', render: (_, record) => `$${(record.quantity*record.unit_cost).toFixed(2)}`, align: 'center' },
    { align: 'center', width: 50, render: (_, record) => 
      <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} disabled={!purchaseOrder.isStatus(POStatus.PENDING)} />
    },
  ];

  return (
    <>
      { purchaseOrder != null && 
        <>
        { purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT) && 
          <MyToolbar title="Order Items">
              <Button icon={<PlusOutlined />} disabled={loading} onClick={() => setIsNewOrderItemModalVisible(true)}>Add More Items</Button>
          </MyToolbar>
        }

        <Table
            pagination={{ position: ['none', 'none'] }}
            columns={columns}
            dataSource={purchaseOrder.purchase_order_items}
            rowKey={(_, index) => index}
            components={{ body: { cell: EditableCell } }}
            summary={pageData => {
              if (purchaseOrder == null) return <></>

              return (
                <>
                  {(purchaseOrder.has_gst === 2 || purchaseOrder.has_gst === 3) && 
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={7}>
                        <Typography.Text strong>
                          {purchaseOrder.has_gst === 2 && `GST ${purchaseOrder.gst_rate}% (Inclusive)`}
                          {purchaseOrder.has_gst === 3 && `GST ${purchaseOrder.gst_rate}% (Exclusive)`}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align='center'>
                        <Typography.Text strong>
                          ${purchaseOrder.getGstAmount().toFixed(2)}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell />
                    </Table.Summary.Row>
                  }

                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={7}>
                      <Typography.Text strong>Offset</Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align='center'>
                      { purchaseOrder.isStatus(POStatus.PENDING) 
                        ?
                        <InputNumber value={purchaseOrder.offset} style={{ width: 80 }} prefix="$"
                          onChange={(value) => setPurchaseOrder(new PurchaseOrder({...purchaseOrder, offset: value }))} 
                        />
                        :
                        <Typography.Text strong>${(+purchaseOrder.offset).toFixed(2) || 0}</Typography.Text>
                      }
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                  </Table.Summary.Row>

                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={7}>
                      <Typography.Text strong>Total</Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align='center'>
                      <Typography.Text strong>
                        {`$${purchaseOrder.getOrderTotal().toFixed(2)}`}
                      </Typography.Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell />
                  </Table.Summary.Row>
                </>
              );
            }}
        />

        <NewOrderItemModal 
          supplier={purchaseOrder.supplier}
          purchaseOrder={purchaseOrder}
          setPurchaseOrder={setPurchaseOrder}
          isModalVisible={isNewOrderItemModalVisible} 
          setIsModalVisible={setIsNewOrderItemModalVisible} 
          loading={loading}
          setLoading={setLoading}
        />
        </>
      }
    </>
  )
}
