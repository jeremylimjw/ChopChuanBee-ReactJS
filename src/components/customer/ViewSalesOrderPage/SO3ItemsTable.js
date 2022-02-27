import { DeleteOutlined, PlusOutlined } from '@ant-design/icons/lib/icons';
import { Button, InputNumber, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { CustomerApiHelper } from '../../../api/CustomerApiHelper';
import { SOStatus } from '../../../enums/SalesOrderStatus';
import { View } from '../../../enums/View';
import { SalesOrder } from '../../../models/SalesOrder';
import { useApp } from '../../../providers/AppProvider';
import { CustomCell } from '../../common/CustomCell';
import MyToolbar from '../../common/MyToolbar';

export default function SO3ItemsTable({ salesOrder, setSalesOrder, loading, setLoading }) {

    const { handleHttpError, hasWriteAccessTo } = useApp();
    
    const [menuItems, setMenuItems] = useState([]);
    const [disabledProductsMap, setDisabledProductsMap] = useState({});

    columns[1].onCell = (record) => ({ 
        type: 'product_select', 
        toggleable: 'true', 
        field: 'product', 
        record, 
        handleSave, 
        products: menuItems,
        disabledProductsMap,
    });

    columns[5].onCell = (record) => ({ type: 'input_number', field: 'quantity', record, handleSave })
    columns[6].onCell = (record) => ({ type: 'input_number', field: 'unit_price', record, handleSave })
    columns[8].render = (_, record) => <Button shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteRow(record)} disabled={!hasWriteAccessTo(View.CRM.id) || !salesOrder.isStatus(SOStatus.PENDING)} />
    
    useEffect(() => {
        if (salesOrder.customer != null) {
            setLoading(true);
            CustomerApiHelper.getMenu(salesOrder.customer.id)
                .then(results => {
                    setMenuItems(results.map(x => ({ ...x.product })));
                    setLoading(false);
                })
                .catch(handleHttpError)
                .catch(() => setLoading(false))
        }

    }, [handleHttpError, salesOrder.customer, setMenuItems, setLoading])

    useEffect(() => {
        const disabledProducts = salesOrder?.sales_order_items.reduce((prev, current) => ({...prev, [current?.product?.id]: true }), {}) || {};
        setDisabledProductsMap(disabledProducts);
    }, [salesOrder.sales_order_items])

    function handleAddRow() {
        const newRow = {
            key: Math.random(),
            product: null,
            product_id: null, 
            quantity: 0,
            unit_price: null,
            inventory_movements: [],
            purchase_order_id: salesOrder?.id,
        }
        setSalesOrder(new SalesOrder({ ...salesOrder, sales_order_items: [newRow, ...salesOrder.sales_order_items] }));
    }

    function handleDeleteRow(record) {
        const newItems = salesOrder?.sales_order_items.filter((item) => (item.id !== record.id || item.key !== record.key));
        setSalesOrder(new SalesOrder({ ...salesOrder, sales_order_items: newItems }));
    };

    function handleSave(newRecord) {
        const newItems = [...salesOrder?.sales_order_items];
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
        setSalesOrder(new SalesOrder({...salesOrder, sales_order_items: newItems }));
    };

    return (
        <>
        { salesOrder != null && 
            <>
            { salesOrder.isStatus(SOStatus.PENDING, SOStatus.SENT) && 
            <MyToolbar title="Order Items">
                { hasWriteAccessTo(View.CRM.name) && 
                <Button icon={<PlusOutlined />} disabled={loading} onClick={() => handleAddRow()}>Add More Items</Button>
                }
            </MyToolbar>
            }

            <Table
                pagination={{ position: ['none', 'none'] }}
                columns={columns}
                dataSource={salesOrder.sales_order_items}
                rowKey={() => Math.random()}
                components={salesOrder.isStatus(SOStatus.PENDING) ? { body: { cell: CustomCell } } : {}}
                summary={pageData => {
                if (salesOrder == null) return <></>

                return (
                    <>
                    {(salesOrder.has_gst === 2) && 
                        <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={7}>
                            <Typography.Text strong>
                            {salesOrder.has_gst === 2 && `GST ${salesOrder.gst_rate}% (Exclusive)`}
                            </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align='center'>
                            <Typography.Text strong>
                            ${salesOrder.getGstAmount().toFixed(2)}
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
                        { salesOrder.isStatus(SOStatus.PENDING) 
                            ?
                            <InputNumber value={salesOrder.offset} style={{ width: 80 }} prefix="$"
                                onChange={(value) => setSalesOrder(new SalesOrder({...salesOrder, offset: value }))} 
                            />
                            :
                            <Typography.Text strong>${(+salesOrder.offset).toFixed(2) || 0}</Typography.Text>
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
                            {`$${salesOrder.getOrderTotal().toFixed(2)}`}
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
        render: (product) => product?.name 
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
        title: 'Lastest Price', 
        dataIndex: 'product', 
        render: (product) => '-',
        width: '10%',
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
        title: '* Unit Price ($)', 
        dataIndex: 'unit_price', 
        align: 'center', 
        width: '10%',
        ellipsis: true,
        render: (unit_price) => `$${(+unit_price).toFixed(2)}`
    },
    { 
        title: 'Subtotal', 
        dataIndex: '', 
        key: 'subtotal', 
        width: '10%',
        ellipsis: true,
        render: (_, record) => `$${(record.quantity*record.unit_price).toFixed(2)}`, align: 'center' 
    },
    { 
        align: 'center', 
        width: 80, 
    },
];
