import { DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, InputNumber, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SupplierAPIHelper } from '../../../api/SupplierAPIHelper';
import { POStatus } from '../../../enums/PurchaseOrderStatus';
import { View } from '../../../enums/View';
import { PurchaseOrder } from '../../../models/PurchaseOrder';
import { useApp } from '../../../providers/AppProvider';
import { sortByNumber } from '../../../utilities/sorters';
import { CustomCell } from '../../common/CustomCell';
import MyToolbar from '../../common/MyToolbar';

export default function PO3ItemsTable({ purchaseOrder, setPurchaseOrder, loading, setLoading }) {

  const { handleHttpError, hasWriteAccessTo } = useApp();
  
  const [menuItems, setMenuItems] = useState([]);
  const [disabledProductsMap, setDisabledProductsMap] = useState({});
  const [myPrices, setMyPrices] = useState({});

  columns[1].onCell = (record) => ({ 
    type: 'product_select', 
    toggleable: 'true', 
    field: 'product', 
    record, 
    handleSave, 
    products: menuItems,
    disabledProductsMap,
  });

  columns[4].render = (product) => product?.id ? (myPrices[product.id] ? `$${(+myPrices[product.id]).toFixed(2)}` : '-') : '-';
  columns[4].sorter = (a, b) => sortByNumber(+myPrices[a.product?.id] || 0, +myPrices[b.product?.id] || 0);
  columns[5].onCell = (record) => ({ type: 'input_number', field: 'quantity', record, handleSave })
  columns[6].onCell = (record) => ({ type: 'input_number', field: 'unit_cost', currency: 'true', record, handleSave })
  columns[8].render = (_, record) => <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} disabled={!hasWriteAccessTo(View.SCM.id) || !purchaseOrder.isStatus(POStatus.PENDING)} />
  
  useEffect(() => {
    if (purchaseOrder.supplier != null) {
      setLoading(true);
      SupplierAPIHelper.getMenu(purchaseOrder.supplier.id)
        .then(results => {
          setMenuItems(results.map(x => ({ ...x.product })));
          setLoading(false);
        })
        .catch(handleHttpError)
        .catch(() => setLoading(false))
        
      // Get supplier's latest prices for all products
      SupplierAPIHelper.getMyLatestPrices(purchaseOrder.supplier.id)
        .then(results => {
          setMyPrices(results.reduce((prev, current) => ({...prev, [current.product_id]: current.unit_cost }), {}));
        })
        .catch(handleHttpError)
    }

  }, [handleHttpError, purchaseOrder.supplier, setMenuItems, setLoading])

  useEffect(() => {
    const disabledProducts = purchaseOrder?.purchase_order_items.reduce((prev, current) => ({...prev, [current?.product?.id]: true }), {}) || {};
    setDisabledProductsMap(disabledProducts);
  }, [purchaseOrder.purchase_order_items])

  function handleAddRow() {
    const newRow = {
      key: Math.random(),
      product: null,
      product_id: null, 
      quantity: 0,
      unit_cost: null,
      inventory_movements: [],
      purchase_order_id: purchaseOrder?.id,
    }
    setPurchaseOrder(new PurchaseOrder({ ...purchaseOrder, purchase_order_items: [newRow, ...purchaseOrder.purchase_order_items] }));
  }

  function handleDeleteRow(record) {
    const newItems = purchaseOrder?.purchase_order_items.filter((item) => (item.id !== record.id || item.key !== record.key));
    setPurchaseOrder(new PurchaseOrder({ ...purchaseOrder, purchase_order_items: newItems }));
  };

  function handleSave(newRecord) {
    const newItems = [...purchaseOrder?.purchase_order_items];
    // Allow match record by 'id' or 'key'
    const index = newItems.findIndex(x => {
        if (newRecord.id) {
            return (x.id === newRecord.id)
        } else if (newRecord.key) {
            return (x.key === newRecord.key)
        } else {
            return false;
        }
    });
    const item = newItems[index];
    newItems.splice(index, 1, { ...item, ...newRecord });
    setPurchaseOrder(new PurchaseOrder({...purchaseOrder, purchase_order_items: newItems }));
  };

  return (
    <>
      { purchaseOrder != null && 
        <>
        { purchaseOrder.isStatus(POStatus.PENDING, POStatus.SENT) && 
          <MyToolbar title="Order Items">
            { hasWriteAccessTo(View.SCM.name) && 
              <Button icon={<PlusOutlined />} disabled={loading} onClick={() => handleAddRow()}>Add More Items</Button>
            }
          </MyToolbar>
        }

        <Table
            pagination={{ position: ['none', 'none'] }}
            columns={columns}
            dataSource={purchaseOrder.purchase_order_items}
            rowKey={() => Math.random()}
            components={purchaseOrder.isStatus(POStatus.PENDING) ? { body: { cell: CustomCell } } : {}}
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
        
        </>
      }
    </>
  )
}

const columns = [
  { 
    width: 50, 
    render: (_, record, index) => index+1 
  },
  { 
    title: 'Name', 
    dataIndex: 'product', 
    width: '20%',
    ellipsis: true,
    render: (product) => product ? <Link to={`/inventory/products/${product.id}`}>{product.name}</Link> : '-', 
  },
  { 
    title: 'Description', 
    dataIndex: 'product',  
    width: '20%',
    ellipsis: true,
    render: (product) => product?.description || '-' 
  },
  { 
    title: 'Unit', 
    dataIndex: 'product', 
    width: '10%',
    ellipsis: true,
    render: (product) => product?.unit 
  },
  {
    title: 'Latest Cost Price',
    dataIndex: 'product',
    key: 'latest_unit_cost',
    align: 'center',
    width: 170,
    ellipsis: true,
  },
  { 
    title: '* Quantity', 
    dataIndex: 'quantity', 
    align: 'center', 
    width: '10%',
    ellipsis: true,
  },
  { 
    title: '* Unit Cost', 
    dataIndex: 'unit_cost', 
    align: 'center', 
    width: '10%',
    ellipsis: true,
    render: (unit_cost) => `$${(+unit_cost).toFixed(2)}`
  },
  { 
    title: 'Subtotal', 
    dataIndex: '', 
    key: 'subtotal', 
    width: '10%',
    ellipsis: true,
    render: (_, record) => `$${(record.quantity*record.unit_cost).toFixed(2)}`, align: 'center' 
  },
  { 
    align: 'center', 
    width: 80, 
  },
];
